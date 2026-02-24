import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab");

  // Temporary mock data (so frontend works)
  return NextResponse.json({
    summary: {
      total_shgs: 12450,
      approved_shgs: 10230,
      pending_shgs: 2220,
      approval_percent: 82,
      pending_percent: 18,
      saturation_percent: 76,
      top_district_percent: 91,
      block_avg_percent: 73
    },
    districts: [
      { name: "District A", total: 2000, approved: 1700, pending: 300, percent: 85 },
      { name: "District B", total: 1800, approved: 1300, pending: 500, percent: 72 }
    ],
    blocks: [
      { name: "Block X", total: 400, approved: 350, pending: 50, percent: 88 },
      { name: "Block Y", total: 500, approved: 380, pending: 120, percent: 76 }
    ]
  });
}
