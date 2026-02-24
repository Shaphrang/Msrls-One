"use client";

import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartDataset
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/* ========================= */
/* TYPES */
/* ========================= */

interface TrendPoint {
  date: string;
  value: number;
}

interface BlockTrend {
  block_id: string;
  block_name: string;
  trend: TrendPoint[];
}

interface DistrictGrowth {
  district_id: string;
  district_name: string;
  blocks: BlockTrend[];
}

interface Props {
  data: DistrictGrowth[];
  mode: "shg" | "member";
  setMode: (mode: "shg" | "member") => void;
}

/* ========================= */
/* MAIN COMPONENT */
/* ========================= */

export default function BlockGrowthSection({
  data,
  mode,
  setMode
}: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Operational Growth Speed (Last 15 Days)
        </h2>

        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setMode("shg")}
            className={`px-4 py-1 text-sm rounded-md transition ${
              mode === "shg"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-600"
            }`}
          >
            SHG
          </button>

          <button
            onClick={() => setMode("member")}
            className={`px-4 py-1 text-sm rounded-md transition ${
              mode === "member"
                ? "bg-white shadow text-indigo-600"
                : "text-slate-600"
            }`}
          >
            Member
          </button>
        </div>
      </div>

      {/* DISTRICT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((district) => (
          <DistrictGrowthCard
            key={district.district_id}
            district={district}
          />
        ))}
      </div>

    </div>
  );
}

/* ========================= */
/* DISTRICT CARD */
/* ========================= */

const DistrictGrowthCard = React.memo(function DistrictGrowthCard({
  district
}: {
  district: DistrictGrowth;
}) {

  const { chartData, chartOptions, totalGrowth } = useMemo(() => {

    const dates =
      district.blocks[0]?.trend.map((t) => t.date) ?? [];

    // ✅ 15-Day Total Growth Calculation
    const totalGrowth = district.blocks.reduce((sum, block) => {
      return (
        sum +
        block.trend.reduce((s, t) => s + (t.value || 0), 0)
      );
    }, 0);

    // ✅ Explicitly typed datasets (fixes borderDash error)
    const datasets: ChartDataset<"line">[] =
      district.blocks.map((block, index) => {
        const hue = (index * 47) % 360;

        return {
          label: block.block_name,
          data: block.trend.map((t) => t.value),
          borderColor: `hsl(${hue}, 70%, 45%)`,
          backgroundColor: `hsl(${hue}, 70%, 45%)`,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        };
      });

    // ✅ Zero baseline reference line
    datasets.push({
      label: "Baseline",
      data: dates.map(() => 0),
      borderColor: "rgba(0,0,0,0.25)",
      borderDash: [5, 5],
      pointRadius: 0,
      borderWidth: 1
    });

    const chartData = {
      labels: dates,
      datasets
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false
        }
      },
      interaction: {
        mode: "index",
        intersect: false
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      }
    };

    return { chartData, chartOptions, totalGrowth };

  }, [district]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">

      {/* District Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {district.district_name}
        </h3>

        <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          15-Day Total: {totalGrowth.toLocaleString()}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
});
