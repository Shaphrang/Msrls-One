export function UploadBlock({ entity }: { entity: string }) {
  return (
    <div className="bg-white border rounded-md p-4 space-y-3">
      <h3 className="font-medium text-slate-900">
        {entity} Excel
      </h3>

      <input
        type="file"
        accept=".xlsx"
        disabled
        className="block w-full text-sm"
      />

      <div className="text-sm text-slate-500">
        Status: Not uploaded
      </div>
    </div>
  )
}
