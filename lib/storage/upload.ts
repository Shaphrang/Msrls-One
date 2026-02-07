//lib\storage\upload.ts
import { createSupabaseServer } from '@/lib/supabase/server'

export async function uploadFileToStorage(
  uploadId: string,
  entity: string,
  file: Buffer,
  filename: string
) {
  const supabase = await createSupabaseServer()

  const path = `${uploadId}/${entity}/${filename}`

  const { error } = await supabase.storage
    .from('uploads')
    .upload(path, file, {
      upsert: true,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  return path
}
