"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPICard({
  title,
  value,
  trend,
  direction,
  color,
}: {
  title: string;
  value: number | string;
  trend?: string;
  direction?: "up" | "down";
  color: "blue" | "green" | "red" | "amber";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {typeof value === "number"
              ? value.toLocaleString()
              : value}
          </p>

          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                direction === "up"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {direction === "up" ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {trend}
            </div>
          )}
        </div>

        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          ●
        </div>

      </div>
    </div>
  );
}
