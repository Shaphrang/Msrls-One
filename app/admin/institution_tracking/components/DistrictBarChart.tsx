"use client";

import "./ChartConfig";
import { Bar } from "react-chartjs-2";

export default function DistrictBarChart({ districts }: any) {
  const top = districts
    ?.sort((a: any, b: any) => b.total - a.total)
    .slice(0, 5);

  const data = {
    labels: top?.map((d: any) => d.name),
    datasets: [
      {
        label: "Total Institutions",
        data: top?.map((d: any) => d.total),
        backgroundColor: "#0ea5e9",
      },
    ],
  };

  return (
    <div className="h-72">
      <Bar data={data} options={{ indexAxis: "y" }} />
    </div>
  );
}
