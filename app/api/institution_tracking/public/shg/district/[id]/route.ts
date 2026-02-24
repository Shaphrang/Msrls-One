//app\api\institution_tracking\public\shg\district\[id]\route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

function percent(part: number, total: number) {
  if (!total || total === 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServer();

  // ✅ Await params (important in Next.js 15)
  const { id: districtId } = await context.params;

  // Get latest date
  const { data: latestRow } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return NextResponse.json({ blocks: [] });
  }

  const latestDate = latestRow.date;

  // Get rows for this district
  const { data: rows } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("*")
    .eq("date", latestDate)
    .eq("district_id", districtId);

  if (!rows || rows.length === 0) {
    return NextResponse.json({ blocks: [] });
  }

  // Fetch block master
  const { data: blockMaster } = await supabase
    .schema("institution_tracking")
    .from("blocks")
    .select("id, name");

  const blockNameMap: Record<string, string> = {};
  blockMaster?.forEach((b) => {
    blockNameMap[b.id] = b.name;
  });

  const blocks = rows.map((row) => ({
    id: row.block_id,
    name: blockNameMap[row.block_id],
    migrated_shgs: row.migrated_shgs,
    approved_migrated_shgs:
      row.first_time_approved_migrated_shgs,
    migrated_approval_percent: percent(
      row.first_time_approved_migrated_shgs,
      row.migrated_shgs
    ),
    migrated_pending:
      row.migrated_shgs -
      row.first_time_approved_migrated_shgs,
  }));

  return NextResponse.json({ blocks });
}
