"use client";

import { useEffect, useState } from "react";

type Institution = "shg" | "vo" | "clf";

export default function PublicInstitutionDashboard() {
  const [institution, setInstitution] = useState<Institution>("shg");
  const [kpis, setKpis] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/institution_tracking/public/kpis?type=${institution}`)
      .then((res) => res.json())
      .then(setKpis);

    fetch(`/api/institution_tracking/public/district?type=${institution}`)
      .then((res) => res.json())
      .then(setDistricts);
  }, [institution]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

      {/* Title */}
      <div>
        <h1 className="text-4xl font-semibold text-slate-900">
          Institution Performance Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Public monitoring of institutional progress.
        </p>
      </div>

      {/* Institution Switch */}
      <div className="flex gap-4">
        {["shg", "vo", "clf"].map((type) => (
          <button
            key={type}
            onClick={() => setInstitution(type as Institution)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              institution === type
                ? "bg-slate-900 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* KPI Section */}
      {kpis && (
        <div className="grid md:grid-cols-3 gap-6">
          {kpis.cards.map((card: any, i: number) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* District Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900 mb-6">
          District Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 text-slate-600">
                <th className="pb-3">District</th>
                <th>Total</th>
                <th>Migrated</th>
                <th>New</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((row, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3">{row.name}</td>
                  <td>{row.total}</td>
                  <td>{row.migrated}</td>
                  <td>{row.new}</td>
                  <td>{row.approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
