//components\institution_tracking\UploadCard.tsx
"use client";

import { useState } from "react";

export default function UploadCard({
  institution,
}: {
  institution: "shg" | "vo" | "clf";
}) {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpload = async () => {
    if (!file || !date) {
      setMessage({
        type: "error",
        text: "Please select both file and date.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

        // Check if date already exists
    const checkRes = await fetch(
      `/api/institution_tracking/check-date?type=${institution}&date=${date}`
    );
    const checkData = await checkRes.json();

    if (checkData.exists) {
      const confirmOverwrite = confirm(
        "Data already exists for this date. Do you want to overwrite?"
      );

      if (!confirmOverwrite) {
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date);

    try {
      const res = await fetch(
        `/api/institution_tracking/upload/${institution}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage({
        type: "success",
        text: "Upload completed successfully.",
      });

      setFile(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-medium text-slate-900">
        Upload {institution.toUpperCase()} Data
      </h2>

      <div className="grid md:grid-cols-3 gap-6 items-end">

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">Select Date</label>
          <input
            type="date"
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* File */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-600">Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="border border-slate-300 rounded-lg px-3 py-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <span className="text-xs text-slate-500">
              Selected: {file.name}
            </span>
          )}
        </div>

        {/* Button */}
        <div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm rounded-lg px-4 py-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
