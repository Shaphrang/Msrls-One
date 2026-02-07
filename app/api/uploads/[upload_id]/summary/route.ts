//app\api\uploads\[upload_id]\summary\route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const REQUIRED_ENTITIES = ['CLF', 'VO', 'SHG', 'MEMBER'] as const

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ upload_id: string }> }
) {
  const { upload_id } = await context.params
  const supabase = await createSupabaseServer()

  // 1️⃣ Upload session
  const { data: upload, error: uploadError } =
    await supabase
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

  // 2️⃣ File states
  const { data: files, error: filesError } =
    await supabase
      .schema('snapshot')
      .from('upload_files')
      .select('entity_type, row_count, status, error_message')
      .eq('upload_id', upload_id)

  if (filesError) {
    return NextResponse.json(
      { error: filesError.message },
      { status: 500 }
    )
  }

  // 3️⃣ Normalize
  const fileMap: Record<string, any> = {}

  files?.forEach(f => {
    fileMap[f.entity_type] = {
      rows: f.row_count,
      status: f.status,
      error: f.error_message ?? null,
    }
  })

  // 4️⃣ Readiness checks
  const missing = REQUIRED_ENTITIES.filter(
    e => !fileMap[e]
  )

  const errors = Object.entries(fileMap)
    .filter(([, v]) => v.status !== 'VALIDATED')
    .map(([entity, v]) => ({
      entity,
      error: v.error,
    }))

  return NextResponse.json({
    upload_id,
    snapshot_date: upload.snapshot_date,
    upload_status: upload.status,
    ready: missing.length === 0 && errors.length === 0,
    missing,
    errors,
    files: fileMap,
  })
}
