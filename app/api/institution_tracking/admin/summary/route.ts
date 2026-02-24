//app\api\institution_tracking\admin\summary\route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

function percent(part: number, total: number) {
  if (!total || total === 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export async function GET() {
  const supabase = createSupabaseServer();

  // 1️⃣ TARGET DATA (sisd_shgs)
  const { data: targetRows } = await supabase
    .schema("institution_tracking")
    .from("sisd_shgs")
    .select("total_shgs, total_members");

  if (!targetRows) {
    return NextResponse.json({ error: "No target data" }, { status: 404 });
  }

  const targetTotals = targetRows.reduce(
    (acc, row) => {
      acc.target_shgs += row.total_shgs;
      acc.target_members += row.total_members;
      return acc;
    },
    { target_shgs: 0, target_members: 0 }
  );

  // 2️⃣ Get latest date from shg_daily
  const { data: latestRow } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return NextResponse.json({ error: "No shg_daily data" }, { status: 404 });
  }

  const latestDate = latestRow.date;

  // 3️⃣ Approved totals from shg_daily
  const { data: dailyRows } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select(
      "first_time_approved_total_shgs, first_time_approved_total_members"
    )
    .eq("date", latestDate);

  const approvedTotals = dailyRows?.reduce(
    (acc, row) => {
      acc.approved_shgs += Number(row.first_time_approved_total_shgs);
      acc.approved_members += Number(row.first_time_approved_total_members);
      return acc;
    },
    { approved_shgs: 0, approved_members: 0 }
  ) || { approved_shgs: 0, approved_members: 0 };

  return NextResponse.json({
    latestDate,

    target_shgs: targetTotals.target_shgs,
    target_members: targetTotals.target_members,

    approved_shgs: approvedTotals.approved_shgs,
    approved_members: approvedTotals.approved_members,

    pending_shgs:
      targetTotals.target_shgs - approvedTotals.approved_shgs,
    pending_members:
      targetTotals.target_members - approvedTotals.approved_members,

    approval_percent_shgs: percent(
      approvedTotals.approved_shgs,
      targetTotals.target_shgs
    ),

    approval_percent_members: percent(
      approvedTotals.approved_members,
      targetTotals.target_members
    ),
  });
}
