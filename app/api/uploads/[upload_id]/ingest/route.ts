// app/api/uploads/[upload_id]/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { parseExcel } from '@/lib/excel/parse'
import { computeHash } from '@/lib/hash'
import { downloadFileFromStorage } from '@/lib/storage/download'
import { EntityType } from '@/lib/validation/schema'

const REQUIRED_ENTITIES: EntityType[] = [
  'CLF',
  'VO',
  'SHG',
  'MEMBER',
]

const SNAPSHOT_TABLE: Record<EntityType, string> = {
  CLF: 'clf',
  VO: 'vo',
  SHG: 'shg',
  MEMBER: 'member',
}

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ upload_id: string }> }
) {
  const { upload_id } = await context.params
  const supabase = await createSupabaseServer()

  /* ======================================================
     1️⃣ VERIFY UPLOAD SESSION
     ====================================================== */
  const { data: upload, error: uploadError } = await supabase
    .schema('snapshot')
    .from('uploads')
    .select('upload_id, snapshot_date, status')
    .eq('upload_id', upload_id)
    .single()

  if (uploadError || !upload) {
    return NextResponse.json(
      { error: 'Upload session not found' },
      { status: 404 }
    )
  }

  if (upload.status !== 'PENDING') {
    return NextResponse.json(
      {
        error: 'Upload is not eligible for ingestion',
        current_status: upload.status,
      },
      { status: 400 }
    )
  }

  /* ======================================================
     2️⃣ VERIFY FILE STATES
     ====================================================== */
  const { data: files, error: filesError } = await supabase
    .schema('snapshot')
    .from('upload_files')
    .select('entity_type, status')
    .eq('upload_id', upload_id)

  if (filesError || !files || files.length === 0) {
    return NextResponse.json(
      { error: 'No uploaded files found for this upload' },
      { status: 400 }
    )
  }

  const fileMap = new Map(
    files.map(f => [f.entity_type as EntityType, f.status])
  )

  const missing = REQUIRED_ENTITIES.filter(
    e => !fileMap.has(e)
  )

  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Missing required files', missing },
      { status: 400 }
    )
  }

  const invalid = REQUIRED_ENTITIES.filter(
    e => fileMap.get(e) !== 'VALIDATED'
  )

  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'Some files failed validation', invalid },
      { status: 400 }
    )
  }

  /* ======================================================
     3️⃣ SNAPSHOT INSERTION
     ====================================================== */
  const insertedCounts: Record<EntityType, number> = {
    CLF: 0,
    VO: 0,
    SHG: 0,
    MEMBER: 0,
  }

  try {
    for (const entity of REQUIRED_ENTITIES) {
      const buffer = await downloadFileFromStorage(upload_id, entity)
      const { rows } = parseExcel(buffer)

      if (!rows || rows.length === 0) {
        throw new Error(`${entity} Excel has no data rows`)
      }

      const snapshotRows = rows.map(row => ({
        ...row, // already normalized & schema-safe
        data_hash: computeHash(row),
        snapshot_date: upload.snapshot_date,
        upload_id,
      }))

      const { error } = await supabase
        .schema('snapshot')
        .from(SNAPSHOT_TABLE[entity])
        .insert(snapshotRows)

      if (error) {
        throw new Error(
          `Snapshot insert failed for ${entity}: ${error.message}`
        )
      }

      insertedCounts[entity] = snapshotRows.length
    }
  } catch (err: any) {
    await supabase
      .schema('snapshot')
      .from('uploads')
      .update({ status: 'FAILED' })
      .eq('upload_id', upload_id)

    return NextResponse.json(
      {
        upload_id,
        status: 'FAILED',
        stage: 'SNAPSHOT_INSERT',
        error: err.message,
      },
      { status: 500 }
    )
  }

  /* ======================================================
     4️⃣ RUN DELTAS
     ====================================================== */
  try {
    await supabase.rpc('run_clf_delta')
    await supabase.rpc('run_vo_delta')
    await supabase.rpc('run_shg_delta')
    await supabase.rpc('run_member_delta')
  } catch (err: any) {
    await supabase
      .schema('snapshot')
      .from('uploads')
      .update({ status: 'FAILED' })
      .eq('upload_id', upload_id)

    return NextResponse.json(
      {
        upload_id,
        status: 'FAILED',
        stage: 'DELTA_EXECUTION',
        error: err.message,
      },
      { status: 500 }
    )
  }

  /* ======================================================
     5️⃣ MARK SUCCESS
     ====================================================== */
  await supabase
    .schema('snapshot')
    .from('uploads')
    .update({ status: 'SUCCESS' })
    .eq('upload_id', upload_id)

  return NextResponse.json({
    upload_id,
    snapshot_date: upload.snapshot_date,
    status: 'SUCCESS',
    inserted: insertedCounts,
    message: 'Snapshot ingested and deltas applied successfully',
  })
}
