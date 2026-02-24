//app\api\institution_tracking\public\shg\summary\route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

function percent(part: number, total: number) {
  if (!total || total === 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export async function GET() {
  const supabase = createSupabaseServer();

  // 1️⃣ Get latest date
  const { data: latestRow } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return NextResponse.json({ error: "No data found" }, { status: 404 });
  }

  const latestDate = latestRow.date;

  // 2️⃣ Get all rows for latest date
  const { data: rows } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("*")
    .eq("date", latestDate);

  if (!rows) {
    return NextResponse.json({ error: "No data found" }, { status: 404 });
  }

  // 3️⃣ Aggregate totals
  const totals = rows.reduce(
    (acc, row) => {
      acc.migrated_shgs += row.migrated_shgs;
      acc.migrated_members += row.migrated_members;
      acc.total_shgs += row.total_shgs;
      acc.total_members += row.total_members;

      acc.first_time_approved_migrated_shgs +=
        row.first_time_approved_migrated_shgs;
      acc.first_time_approved_migrated_members +=
        row.first_time_approved_migrated_members;

      acc.first_time_approved_total_shgs +=
        row.first_time_approved_total_shgs;
      acc.first_time_approved_total_members +=
        row.first_time_approved_total_members;

      return acc;
    },
    {
      migrated_shgs: 0,
      migrated_members: 0,
      total_shgs: 0,
      total_members: 0,
      first_time_approved_migrated_shgs: 0,
      first_time_approved_migrated_members: 0,
      first_time_approved_total_shgs: 0,
      first_time_approved_total_members: 0,
    }
  );

  const response = {
    latestDate,

    total_shgs: totals.total_shgs,
    total_members: totals.total_members,

    migrated_shgs: totals.migrated_shgs,
    migrated_members: totals.migrated_members,

    migrated_approval_percent: percent(
      totals.first_time_approved_migrated_shgs,
      totals.migrated_shgs
    ),

    migrated_pending_shgs:
      totals.migrated_shgs -
      totals.first_time_approved_migrated_shgs,

    migrated_pending_members:
      totals.migrated_members -
      totals.first_time_approved_migrated_members,

    total_pending_shgs:
      totals.total_shgs -
      totals.first_time_approved_total_shgs,

    total_pending_members:
      totals.total_members -
      totals.first_time_approved_total_members,
  };

  return NextResponse.json(response);
}
