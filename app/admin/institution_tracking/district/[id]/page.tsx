"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DistrictBlockPage() {
  const { id } = useParams();
  const router = useRouter();

  const [district, setDistrict] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/institution_tracking/admin/district/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDistrict(data.district);
        setBlocks(data.blocks);
      });
  }, [id]);

  if (!district) return null;

  /* ============================= */
  /* KPI CALCULATION */
  /* ============================= */

  const totals = blocks.reduce(
    (acc: any, b: any) => {
      acc.target_shgs += b.target_shgs;
      acc.approved_shgs += b.approved_shgs;
      acc.pending_shgs += b.pending_shgs;

      acc.target_members += b.target_members;
      acc.approved_members += b.approved_members;
      acc.pending_members += b.pending_members;

      return acc;
    },
    {
      target_shgs: 0,
      approved_shgs: 0,
      pending_shgs: 0,
      target_members: 0,
      approved_members: 0,
      pending_members: 0,
    }
  );

  const shgPercent =
    totals.target_shgs > 0
      ? ((totals.approved_shgs / totals.target_shgs) * 100).toFixed(2)
      : 0;

  const memberPercent =
    totals.target_members > 0
      ? ((totals.approved_members / totals.target_members) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* ================= HEADER ================= */}

      <div className="relative border-b border-slate-300 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-rose-100 via-indigo-50 to-emerald-100 opacity-70"></div>

        <div className="relative px-6 lg:px-10 py-8 flex items-center justify-between flex-wrap gap-6">

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push("/admin/institution_tracking")
              }
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              ← Back
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {district.name} – Block Performance
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Detailed block-level approval analytics
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-medium border border-emerald-300 shadow-sm">
            ● Live
          </div>

        </div>
      </div>

      <div className="p-6 lg:p-10 space-y-10">

        {/* ================= KPI SECTION ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <KpiCard
            title="Target SHGs"
            value={totals.target_shgs}
            percent={100}
            subtitle="District Target"
            gradient="from-rose-600 to-red-700"
          />

          <KpiCard
            title="Approved SHGs"
            value={totals.approved_shgs}
            percent={Number(shgPercent)}
            subtitle={`${shgPercent}% Approval`}
            gradient="from-emerald-600 to-green-700"
          />

          <KpiCard
            title="Target Members"
            value={totals.target_members}
            percent={100}
            subtitle="District Target"
            gradient="from-indigo-600 to-blue-700"
          />

          <KpiCard
            title="Approved Members"
            value={totals.approved_members}
            percent={Number(memberPercent)}
            subtitle={`${memberPercent}% Approval`}
            gradient="from-purple-600 to-indigo-700"
          />

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">

          {/* Header */}
          <div className="relative border-b border-slate-300 overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-indigo-50 to-emerald-50"></div>

            <div className="relative px-6 py-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Block-wise Performance
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Approval breakdown across all blocks
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>

                <tr className="bg-white border-b-2 border-slate-300">

                  <th className="px-6 py-4 text-left font-semibold text-slate-700">
                    Block
                  </th>

                  <th
                    colSpan={4}
                    className="bg-gradient-to-r from-rose-100 to-red-100 border-x border-slate-200 text-center font-semibold text-rose-700"
                  >
                    SHGs
                  </th>

                  <th
                    colSpan={4}
                    className="bg-gradient-to-r from-emerald-100 to-green-100 border-l border-slate-200 text-center font-semibold text-emerald-700"
                  >
                    Members
                  </th>

                </tr>

                <tr className="bg-slate-100 border-b border-slate-300 uppercase text-xs text-slate-600">

                  <th className="px-6 py-3 text-left"></th>

                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Approved</th>
                  <th className="px-4 py-3 text-center">Pending</th>
                  <th className="px-4 py-3 text-center">% </th>

                  <th className="px-4 py-3 text-center border-l border-slate-300">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center">Approved</th>
                  <th className="px-4 py-3 text-center">Pending</th>
                  <th className="px-4 py-3 text-center">% </th>

                </tr>

              </thead>

              <tbody>
                {blocks.map((b: any, i: number) => (
                  <tr
                    key={i}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {b.name}
                    </td>

                    <td className="px-4 py-3 text-center text-slate-700">{b.target_shgs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{b.approved_shgs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-amber-600 font-semibold">{b.pending_shgs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <ApprovalBadge value={b.approval_percent_shgs} />
                    </td>

                    <td className="px-4 py-3 text-center border-l border-slate-300 text-slate-700">{b.target_members.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{b.approved_members.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-amber-600 font-semibold">{b.pending_members.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <ApprovalBadge value={b.approval_percent_members} />
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

/* ================= KPI CARD ================= */

function KpiCard({ title, value, subtitle, percent, gradient }: any) {
  return (
    <div className={`relative rounded-2xl p-6 text-white bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300`}>

      <div className="text-xs uppercase opacity-80 font-medium">
        {title}
      </div>

      <div className="text-3xl font-bold mt-3">
        {value.toLocaleString()}
      </div>

      <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs mt-3 opacity-90">
        {subtitle}
      </div>
    </div>
  );
}

/* ================= BADGE ================= */

function ApprovalBadge({ value }: any) {
  const style =
    value >= 85
      ? "bg-emerald-100 text-emerald-800"
      : value >= 70
      ? "bg-indigo-100 text-indigo-800"
      : "bg-rose-100 text-rose-800";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {value}%
    </span>
  );
}
