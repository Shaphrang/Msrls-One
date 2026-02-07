// app/api/uploads/route.ts
import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const supabase = await createSupabaseServer()
  const { snapshot_date } = await req.json()

  if (!snapshot_date) {
    return NextResponse.json(
      { error: 'snapshot_date is required' },
      { status: 400 }
    )
  }

  // 1️⃣ Check for existing active upload
  const { data: existing, error: lookupError } =
    await supabase
      .schema('snapshot')
      .from('uploads')
      .select('upload_id, status')
      .eq('snapshot_date', snapshot_date)
      .in('status', ['PENDING', 'SUCCESS'])
      .maybeSingle()

  if (lookupError) {
    return NextResponse.json(
      { error: lookupError.message },
      { status: 500 }
    )
  }

  // 2️⃣ Resume existing upload (NOT an error)
  if (existing) {
    return NextResponse.json(
      {
        upload_id: existing.upload_id,
        snapshot_date,
        status: existing.status,
        resumed: true,
      },
      { status: 409 }
    )
  }

  // 3️⃣ Create new upload session
  const upload_id = randomUUID()

  const { error: insertError } = await supabase
    .schema('snapshot')
    .from('uploads')
    .insert({
      upload_id,
      snapshot_date,
      status: 'PENDING',
    })

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    upload_id,
    snapshot_date,
    status: 'PENDING',
    resumed: false,
  })
}
