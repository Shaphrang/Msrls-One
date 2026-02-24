//app\institution_tracking\dashboard\shg\district\[id]\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PercentageBadge from "@/components/institution_tracking/PercentageBadge";

export default function DistrictDrilldown() {
  const { id } = useParams();
  const [blocks, setBlocks] = useState<any[] | null>(null);
  const [district, setDistrict] = useState<any>(null);

  useEffect(() => {
    fetch(
      `/api/institution_tracking/public/shg/district/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDistrict(data?.district || null);
        setBlocks(data?.blocks || []);
      });
  }, [id]);

  // Aggregate totals for district-level summary
  const totals =
    blocks && blocks.length > 0
      ? blocks.reduce(
          (acc, b) => {
            acc.migrated += b.migrated_shgs;
            acc.approved += b.approved_migrated_shgs;
            acc.pending += b.migrated_pending;
            return acc;
          },
          { migrated: 0, approved: 0, pending: 0 }
        )
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {district?.name || "District"} – Block Performance
          </h1>
          <p className="text-slate-600 mt-2">
            Detailed SHG profiling progress at block level
          </p>
        </div>

        {/* District Summary KPI Row */}
        {totals && (
          <div className="grid sm:grid-cols-3 gap-6">

            <SummaryCard
              label="Total Migrated SHGs"
              value={totals.migrated}
              color="blue"
            />

            <SummaryCard
              label="Total Approved"
              value={totals.approved}
              color="green"
            />

            <SummaryCard
              label="Total Pending"
              value={totals.pending}
              color="red"
            />

          </div>
        )}

        {/* Blocks Table */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">

          <div className="px-8 py-6 border-b bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Block Level Profiling Status
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">Block</th>
                  <th className="px-6 py-4 text-left">Migrated SHGs</th>
                  <th className="px-6 py-4 text-left">Approved</th>
                  <th className="px-6 py-4 text-left">Approval %</th>
                  <th className="px-6 py-4 text-left">Pending</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {blocks && blocks.length > 0 ? (
                  blocks.map((b, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition-all"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {b.name}
                      </td>

                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {b.migrated_shgs.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {b.approved_migrated_shgs.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <PercentageBadge
                          value={b.migrated_approval_percent}
                        />
                      </td>

                      <td className="px-6 py-4 font-semibold text-red-600">
                        {b.migrated_pending.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-400"
                    >
                      No block data available
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* Summary Card */

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "green" | "red";
}) {
  const colorMap: any = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-600">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold ${colorMap[color]}`}
        >
          ●
        </div>

      </div>
    </div>
  );
}
