"use client";

import { Target, CheckCircle2, Users, TrendingUp } from "lucide-react";

export default function KpiSection({ summary }: any) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900 mb-5">
        Key Performance Indicators
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <KpiCard
          gradient="from-rose-700 to-red-800"
          icon={<Target size={16} />}
          label="Total SHGs"
          value={summary.total_shgs}
          percent={100}
        />

        <KpiCard
          gradient="from-emerald-600 to-green-700"
          icon={<CheckCircle2 size={16} />}
          label="Approved SHGs"
          value={summary.approved_shgs}
          percent={summary.approval_percent_shgs}
        />

        <KpiCard
          gradient="from-blue-600 to-indigo-700"
          icon={<Users size={16} />}
          label="Total Members"
          value={summary.total_members}
          percent={100}
        />

        <KpiCard
          gradient="from-purple-700 to-indigo-800"
          icon={<TrendingUp size={16} />}
          label="Approved Members"
          value={summary.approved_members}
          percent={summary.approval_percent_members}
        />

      </div>
    </div>
  );
}

function KpiCard({ gradient, icon, label, value, percent }: any) {
  return (
    <div className={`rounded-lg p-5 text-white bg-gradient-to-r ${gradient}`}>
      <div className="flex items-center gap-2 text-xs uppercase opacity-90">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold mt-3">
        {value?.toLocaleString()}
      </div>
      <div className="mt-3 h-2 bg-white/30 rounded-full">
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
