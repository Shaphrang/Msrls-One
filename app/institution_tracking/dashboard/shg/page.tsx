//app\institution_tracking\dashboard\shg\page.tsx
"use client";

import Link from "next/link";
import PercentageBadge from "@/components/institution_tracking/PercentageBadge";
import { useEffect, useState } from "react";

export default function SHGDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/institution_tracking/public/shg/summary")
      .then((res) => res.json())
      .then(setSummary);

    fetch("/api/institution_tracking/public/shg/district")
      .then((res) => res.json())
      .then(setDistricts);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">

        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-md p-10 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900">
            SHG Institutional Dashboard
          </h1>
          {summary && (
            <p className="text-slate-600 mt-3 text-lg">
              Latest Data Updated on{" "}
              <span className="font-semibold text-blue-700">
                {summary.latestDate}
              </span>
            </p>
          )}
        </div>

        {/* KPI Cards */}
        {summary && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">

            <KpiCard
              label="Total Migrated SHGs"
              value={summary.total_shgs}
              color="blue"
              icon="🏘️"
            />

            <KpiCard
              label="Total Migrated Members"
              value={summary.total_members}
              color="indigo"
              icon="👥"
            />

            <KpiCard
              label="SHG Pending Profiling"
              value={summary.total_pending_shgs}
              color="red"
              icon="⏳"
            />

            <KpiCard
              label="Member Pending Profiling"
              value={summary.total_pending_members}
              color="orange"
              icon="📊"
            />

            <KpiCard
              label="Migrated Approval %"
              value={`${summary.migrated_approval_percent}%`}
              color="green"
              icon="✅"
            />
          </div>
        )}

        {/* District Table */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">

          <div className="px-8 py-6 border-b bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800">
              District Performance Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Click on a district to view block-level profiling details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">District</th>
                  <th className="px-6 py-4 text-left">Migrated SHGs</th>
                  <th className="px-6 py-4 text-left">Approved</th>
                  <th className="px-6 py-4 text-left">Approval %</th>
                  <th className="px-6 py-4 text-left">Pending</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {districts.map((d, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 transition-all"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link
                        href={`/institution_tracking/dashboard/shg/district/${d.id}`}
                        className="hover:text-blue-600"
                      >
                        {d.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {d.migrated_shgs.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {d.approved_migrated_shgs.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <PercentageBadge
                        value={d.migrated_approval_percent}
                      />
                    </td>

                    <td className="px-6 py-4 font-semibold text-red-600">
                      {d.migrated_pending.toLocaleString()}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

/* KPI Card Component */

function KpiCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: any;
  color: "blue" | "green" | "red" | "orange" | "indigo";
  icon: string;
}) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-600">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {typeof value === "number"
              ? value.toLocaleString()
              : value}
          </p>
        </div>

        <div
          className={`h-12 w-12 flex items-center justify-center rounded-full text-lg ${colorMap[color]}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}
