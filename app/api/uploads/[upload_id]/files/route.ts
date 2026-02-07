//app\api\uploads\[upload_id]\files\route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { parseExcel } from '@/lib/excel/parse'
import { validateColumns } from '@/lib/validation/validate'
import { uploadFileToStorage } from '@/lib/storage/upload'
import { EntityType } from '@/lib/validation/schema'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ upload_id: string }> }
) {
  const supabase = await createSupabaseServer()

  try {
    /* ======================================================
       1️⃣ RESOLVE PARAMS
       ====================================================== */
    const { upload_id } = await context.params
    const formData = await req.formData()

    const entity = formData.get('entity_type') as EntityType | null
    const file = formData.get('file') as File | null

    if (!entity || !file) {
      return NextResponse.json(
        { error: 'entity_type and file are required' },
        { status: 400 }
      )
    }

    /* ======================================================
       2️⃣ READ FILE BUFFER
       ====================================================== */
    const buffer = Buffer.from(await file.arrayBuffer())

    /* ======================================================
       3️⃣ PARSE EXCEL
       ====================================================== */
    const { headers, rowCount } = parseExcel(buffer)

    if (!headers || headers.length === 0) {
      return NextResponse.json(
        { error: 'Excel file has no headers' },
        { status: 400 }
      )
    }

    /* ======================================================
       4️⃣ VALIDATE COLUMNS
       ====================================================== */
    const validation = validateColumns(entity, headers)

    if (validation.status === 'FAILED') {
      // ❗ Record failure in DB
      await supabase
        .schema('snapshot')
        .from('upload_files')
        .upsert({
          upload_id,
          entity_type: entity,
          file_path: 'INVALID',
          row_count: 0,
          status: 'FAILED',
          error_message: `Missing required columns: ${validation.missing?.join(', ')}`,
        })

      return NextResponse.json(
        {
          entity,
          status: 'FAILED',
          error: `Missing required columns: ${validation.missing?.join(', ')}`,
        },
        { status: 400 }
      )
    }

    /* ======================================================
       5️⃣ UPLOAD FILE TO STORAGE
       ====================================================== */
    const filePath = await uploadFileToStorage(
      upload_id,
      entity,
      buffer,
      file.name
    )

    /* ======================================================
       6️⃣ INSERT / UPDATE DATABASE (🔥 MISSING STEP)
       ====================================================== */
    await supabase
      .schema('snapshot')
      .from('upload_files')
      .upsert({
        upload_id,
        entity_type: entity,
        file_path: filePath,
        row_count: rowCount,
        status: 'VALIDATED',
        error_message: null,
      })

    /* ======================================================
       ✅ SUCCESS
       ====================================================== */
    return NextResponse.json({
      upload_id,
      entity,
      status: 'VALIDATED',
      rows: rowCount,
      unknown_columns: validation.unknown ?? [],
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Unexpected error' },
      { status: 500 }
    )
  }
}
