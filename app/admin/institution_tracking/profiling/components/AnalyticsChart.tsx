"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AnalyticsChart({ districts }: any) {
  const chartData = {
    labels: districts.map((d: any) => d.name),
    datasets: [
      {
        label: "SHG Approval %",
        data: districts.map((d: any) => d.approval_percent_shgs),
        backgroundColor: "#6366f1"
      },
      {
        label: "Member Approval %",
        data: districts.map((d: any) => d.approval_percent_members),
        backgroundColor: "#16a34a"
      }
    ]
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-4">
        District Approval Comparison
      </h2>

      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
