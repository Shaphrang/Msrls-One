"use client";

export default function DistrictTable({ districts }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">

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
        <table className="w-full text-sm">

          <thead>

            {/* Main Group Header */}
            <tr className="bg-white border-b-2 border-slate-300">

              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                District
              </th>

              <th
                colSpan={4}
                className="bg-gradient-to-r from-rose-100 to-red-100 border-x border-slate-200 text-center font-semibold text-rose-700"
              >
                SELF HELP GROUPS
              </th>

              <th
                colSpan={4}
                className="bg-gradient-to-r from-emerald-100 to-green-100 border-l border-slate-200 text-center font-semibold text-emerald-700"
              >
                MEMBERS
              </th>

            </tr>

            {/* Column Header */}
            <tr className="bg-slate-100 border-b border-slate-300 text-xs uppercase tracking-wide text-slate-600">

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

            {districts.map((d: any, i: number) => (
              <tr
                key={i}
                className="border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >

                <td className="px-6 py-4 font-medium text-slate-900">
                  {d.name}
                </td>

                {/* SHG */}
                <td className="px-4 py-3 text-center text-slate-700">
                  {d.total_shgs.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center text-emerald-600 font-semibold">
                  {d.approved_shgs.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center text-amber-600 font-semibold">
                  {d.pending_shgs.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <ApprovalBadge value={d.approval_percent_shgs} />
                </td>

                {/* Members */}
                <td className="px-4 py-3 text-center border-l border-slate-300 text-slate-700">
                  {d.total_members.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center text-emerald-600 font-semibold">
                  {d.approved_members.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center text-amber-600 font-semibold">
                  {d.pending_members.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <ApprovalBadge value={d.approval_percent_members} />
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

/* ============================ */
/* Approval Badge */
/* ============================ */

function ApprovalBadge({ value }: any) {
  const style =
    value >= 85
      ? "bg-emerald-100 text-emerald-800"
      : value >= 70
      ? "bg-indigo-100 text-indigo-800"
      : "bg-rose-100 text-rose-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}
    >
      {value}%
    </span>
  );
}
