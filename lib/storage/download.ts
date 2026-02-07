import { createSupabaseServer } from '@/lib/supabase/server'

export async function downloadFileFromStorage(
  uploadId: string,
  entity: string
): Promise<Buffer> {
  const supabase = await createSupabaseServer()

  // We always store exactly one file per entity per upload
  const { data: files, error: listError } =
    await supabase.storage
      .from('uploads')
      .list(`${uploadId}/${entity}`)

  if (listError || !files || files.length === 0) {
    throw new Error(
      `No file found in storage for ${entity}`
    )
  }

  const filePath = `${uploadId}/${entity}/${files[0].name}`

  const { data, error } =
    await supabase.storage
      .from('uploads')
      .download(filePath)

  if (error || !data) {
    throw new Error(
      `Failed to download file for ${entity}`
    )
  }

  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
