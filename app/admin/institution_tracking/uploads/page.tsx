//app\admin\institution_tracking\uploads\page.tsx

"use client";

import { useState } from "react";
import UploadCard from "@/components/institution_tracking/UploadCard";
import UploadHistory from "@/components/institution_tracking/UploadHistory";

export default function InstitutionTrackingUploadPage() {
  const [activeTab, setActiveTab] = useState<"shg" | "vo" | "clf">("shg");

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Institution Tracking – Data Upload
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload daily Excel sheets for SHG, VO, and CLF.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {["shg", "vo", "clf"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === type
                ? "bg-slate-900 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <UploadCard institution={activeTab} />

      <UploadHistory institution={activeTab} />
    </div>
  );
}
