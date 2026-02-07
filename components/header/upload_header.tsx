export function UploadHeader({ uploadId }: { uploadId: string }) {
  return (
    <div className="bg-white border rounded-md p-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Upload Session
      </h2>

      <div className="mt-2 text-sm text-slate-600 space-y-1">
        <div>Upload ID: <span className="font-mono">{uploadId}</span></div>
        <div>Snapshot Date: —</div>
        <div>Status: <span className="font-medium">PENDING</span></div>
      </div>
    </div>
  )
}
