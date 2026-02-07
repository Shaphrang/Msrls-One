// app/upload/[upload_id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type EntityKey = 'CLF' | 'VO' | 'SHG' | 'MEMBER'

const ENTITIES: { key: EntityKey; label: string }[] = [
  { key: 'CLF', label: 'CLF Details Report' },
  { key: 'VO', label: 'VO Details Report' },
  { key: 'SHG', label: 'SHG Details Report' },
  { key: 'MEMBER', label: 'Member Details Report' },
]

type SummaryResponse = {
  upload_id: string
  snapshot_date: string
  upload_status: string
  ready: boolean
  missing: EntityKey[]
  errors: { entity: EntityKey; error: string | null }[]
  files: Partial<
    Record<
      EntityKey,
      { rows: number | null; status: string; error: string | null }
    >
  >
}

export default function UploadSessionPage() {
  const { upload_id } = useParams<{ upload_id: string }>()
  const uploadId = upload_id

  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loadingEntity, setLoadingEntity] = useState<EntityKey | null>(null)
  const [ingesting, setIngesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadSummary() {
    try {
      const res = await fetch(`/api/uploads/${uploadId}/summary`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to load summary')

      setSummary(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  async function uploadFile(entity: EntityKey, file: File) {
    setLoadingEntity(entity)
    setError(null)

    const formData = new FormData()
    formData.append('entity_type', entity)
    formData.append('file', file)

    try {
      const res = await fetch(
        `/api/uploads/${uploadId}/files`,
        { method: 'POST', body: formData }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      await loadSummary()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingEntity(null)
    }
  }

  async function runIngestion() {
    if (!summary?.ready) return

    setIngesting(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch(
        `/api/uploads/${uploadId}/ingest`,
        { method: 'POST' }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessage('✅ Ingestion completed successfully')
      await loadSummary()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIngesting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">Upload Session</h1>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6 space-y-4">
        {ENTITIES.map(entity => {
          const file = summary?.files?.[entity.key]

          return (
            <div
              key={entity.key}
              className="flex justify-between border p-4 rounded bg-white"
            >
              <div>
                <p className="font-medium">{entity.label}</p>
                <p className="text-sm text-slate-600">
                  {file
                    ? `${file.status}${
                        file.rows ? ` (${file.rows} rows)` : ''
                      }`
                    : 'Not uploaded'}
                </p>
              </div>

              <input
                type="file"
                accept=".xlsx"
                disabled={
                  loadingEntity === entity.key || ingesting
                }
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) uploadFile(entity.key, f)
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={runIngestion}
          disabled={!summary?.ready || ingesting}
          className="px-4 py-2 bg-green-700 text-white rounded disabled:bg-slate-300"
        >
          {ingesting ? 'Processing…' : 'Run Ingestion'}
        </button>

        {message && (
          <p className="mt-3 text-sm text-green-700">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
