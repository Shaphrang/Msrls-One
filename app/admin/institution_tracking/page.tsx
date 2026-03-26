//app\admin\institution_tracking\page.tsx
  "use client";

  import { useEffect, useState } from "react";
  import { Target, CheckCircle2, Users } from "lucide-react";

  import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


  export default function AdminInstitutionDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [districts, setDistricts] = useState<any[]>([]);

    useEffect(() => {
      fetch("/api/institution_tracking/admin/summary")
        .then((res) => res.json())
        .then(setSummary);

      fetch("/api/institution_tracking/admin/district")
        .then((res) => res.json())
        .then(setDistricts);
    }, []);

    if (!summary) return null;

    return (
      <div className="min-h-screen bg-slate-50">

        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                District Performance Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Target vs Approval Monitoring for SHGs & Members
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-emerald-700">
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-10">

          {/* KPI SECTION */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-5">
              Key Performance Indicators
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <KpiCard
                gradient="from-red-500 to-red-600"
                icon={<Target size={16} />}
                label="Target SHGs"
                value={summary.target_shgs}
                percent={100}
                footer="Annual target"
              />

              <KpiCard
                gradient="from-emerald-500 to-green-600"
                icon={<CheckCircle2 size={16} />}
                label="Approved SHGs"
                value={summary.approved_shgs}
                percent={summary.approval_percent_shgs}
                footer={`${summary.approval_percent_shgs}% approval`}
              />

              <KpiCard
                gradient="from-blue-500 to-indigo-600"
                icon={<Users size={16} />}
                label="Target Members"
                value={summary.target_members}
                percent={100}
                footer="Annual target"
              />

              <KpiCard
                gradient="from-teal-500 to-emerald-600"
                icon={<CheckCircle2 size={16} />}
                label="Approved Members"
                value={summary.approved_members}
                percent={summary.approval_percent_members}
                footer={`${summary.approval_percent_members}% approval`}
              />

            </div>
          </div>

          <ApprovalPieSection summary={summary} />

          {/* DISTRICT TABLE */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Header Section */}
          <div className="relative overflow-hidden border-b border-slate-300">

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-indigo-50 to-emerald-50"></div>

            <div className="relative px-6 py-6">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                District-wise Performance
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Comparative approval analytics across all districts
              </p>
            </div>
          </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">

                <thead>

                  {/* Main Header */}
                  <tr className="bg-white border-b-2 border-slate-200">
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 text-xs tracking-wide">
                      District
                    </th>

                    <th
                      colSpan={4}
                      className="bg-red-50 border-b-2 border-red-300 text-center font-semibold text-red-700 py-3 text-xs"
                    >
                      SELF HELP GROUPS
                    </th>

                    <th
                      colSpan={4}
                      className="bg-green-50 border-b-2 border-green-300 text-center font-semibold text-green-700 py-3 text-xs"
                    >
                      MEMBERS
                    </th>
                  </tr>

                  {/* Column Header */}
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">

                    <th className="px-6 py-2 text-left font-semibold"></th>

                    <th className="px-4 py-2 text-center">Total</th>
                    <th className="px-4 py-2 text-center">Approved</th>
                    <th className="px-4 py-2 text-center">Pending</th>
                    <th className="px-4 py-2 text-center">% </th>

                    <th className="px-4 py-2 text-center border-l border-slate-200">
                      Total
                    </th>
                    <th className="px-4 py-2 text-center">Approved</th>
                    <th className="px-4 py-2 text-center">Pending</th>
                    <th className="px-4 py-2 text-center">% </th>

                  </tr>

                </thead>

                <tbody>

                  {districts.map((d, i) => (
                    <tr
                      key={i}
                      onClick={() =>
                        (window.location.href = `/admin/institution_tracking/district/${d.id}`)
                      }
                      className="border-b border-slate-200 hover:bg-slate-100 cursor-pointer transition"
                    >


                      <td className="px-6 py-3 font-medium text-slate-900">
                        {d.name}
                      </td>

                      <td className="px-4 py-2 text-center text-slate-700">
                        {d.target_shgs.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center text-emerald-600 font-medium">
                        {d.approved_shgs.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center text-amber-600 font-medium">
                        {d.pending_shgs.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <ApprovalBadge value={d.approval_percent_shgs} />
                      </td>

                      <td className="px-4 py-2 text-center border-l border-slate-200 text-slate-700">
                        {d.target_members.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center text-emerald-600 font-medium">
                        {d.approved_members.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center text-amber-600 font-medium">
                        {d.pending_members.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <ApprovalBadge value={d.approval_percent_members} />
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

  /* KPI CARD */

  function KpiCard({ gradient, icon, label, value, percent, footer }: any) {
    return (
      <div className={`rounded-lg p-5 text-white bg-gradient-to-r ${gradient} shadow-md`}>
        <div className="flex items-center gap-2 text-xs uppercase font-medium opacity-90">
          {icon}
          {label}
        </div>

        <div className="text-2xl font-bold mt-3">
          {value.toLocaleString()}
        </div>

        <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="text-[11px] mt-3 opacity-90">
          {footer}
        </div>
      </div>
    );
  }

  function ApprovalPieSection({ summary }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

      <div className="text-center mb-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Approval Distribution Overview
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Comparative approval vs pending ratio for SHGs and Members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">

        <PieCard
          title="SHG Approval"
          approved={summary.approved_shgs}
          pending={summary.pending_shgs}
          percent={summary.approval_percent_shgs}
          colors={["#10b981", "#fecaca"]}
        />

        <PieCard
          title="Member Approval"
          approved={summary.approved_members}
          pending={summary.pending_members}
          percent={summary.approval_percent_members}
          colors={["#6366f1", "#fde68a"]}
        />

      </div>

    </div>
  );
}
function PieCard({
  title,
  approved,
  pending,
  percent,
  colors
}: any) {

  const data = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        data: [approved, pending],
        backgroundColor: colors,
        borderWidth: 0,
        cutout: "70%"
      }
    ]
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center">

      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        {title}
      </h3>

      <div className="relative w-60 h-60">

        <Doughnut data={data} options={options} />

        {/* Center Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {percent}%
            </div>
            <div className="text-xs text-slate-500">
              Approved
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 text-sm text-slate-600 text-center">
        <span className="text-emerald-600 font-semibold">
          {approved.toLocaleString()}
        </span>{" "}
        approved out of{" "}
        <span className="font-semibold">
          {(approved + pending).toLocaleString()}
        </span>
      </div>

    </div>
  );
}


  /* APPROVAL BADGE */

  function ApprovalBadge({ value }: any) {
    const style =
      value >= 75
        ? "bg-green-100 text-green-800"
        : value >= 65
        ? "bg-blue-100 text-blue-800"
        : "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${style}`}>
        {value}%
      </span>
    );
  }
