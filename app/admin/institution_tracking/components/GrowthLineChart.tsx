"use client";

import "./ChartConfig";
import { Line } from "react-chartjs-2";

export default function GrowthLineChart({ data }: any) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Growth",
        data: data?.values || [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="h-72">
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
}
