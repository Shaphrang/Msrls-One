"use client";

import "./ChartConfig";
import { Doughnut } from "react-chartjs-2";

export default function ApprovalDonutChart({
  approved,
  pending,
}: {
  approved: number;
  pending: number;
}) {
  const data = {
    labels: ["Approved", "Pending"],
    datasets: [
      {
        data: [approved, pending],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="h-72">
      <Doughnut data={data} options={{ cutout: "70%" }} />
    </div>
  );
}
