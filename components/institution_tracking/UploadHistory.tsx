//components\institution_tracking\UploadHistory.tsx
"use client";

import { useEffect, useState } from "react";

export default function UploadHistory({
  institution,
}: {
  institution: "shg" | "vo" | "clf";
}) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `/api/institution_tracking/upload-history?type=${institution}`
    )
      .then((res) => res.json())
      .then((data) => setLogs(data || []));
  }, [institution]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-medium text-slate-900 mb-6">
        Recent Uploads
      </h3>

      {logs.length === 0 ? (
        <div className="text-sm text-slate-500">
          No uploads found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 text-slate-600">
                <th className="pb-2">Date</th>
                <th>Status</th>
                <th>Rows</th>
                <th>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3">{log.data_date}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.rows_processed}</td>
                  <td>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
