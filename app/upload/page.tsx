// app/upload/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadLandingPage() {
  const router = useRouter()
  const [snapshotDate, setSnapshotDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createUpload() {
    if (!snapshotDate) {
      setError('Please select a snapshot date')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot_date: snapshotDate }),
      })

      const data = await res.json()

      // ✅ Resume existing upload (EXPECTED behavior)
      if (res.status === 409 && data.upload_id) {
        router.push(`/upload/${data.upload_id}`)
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create upload')
      }

      router.push(`/upload/${data.upload_id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">
        New Snapshot Upload
      </h1>

      <p className="text-slate-600 mt-2">
        Create or resume an upload session for a snapshot date.
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="date"
          value={snapshotDate}
          onChange={e => setSnapshotDate(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          onClick={createUpload}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          {loading ? 'Creating…' : 'Create / Resume Upload'}
        </button>
      </div>
    </div>
  )
}
