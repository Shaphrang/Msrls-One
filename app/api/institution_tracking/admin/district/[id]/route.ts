//app\api\institution_tracking\admin\district\[id]\route.ts
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

  const { id: districtId } = await context.params;

  /* 1️⃣ District Master */
  const { data: district } = await supabase
    .schema("institution_tracking")
    .from("districts")
    .select("id, name")
    .eq("id", districtId)
    .single();

  if (!district) {
    return NextResponse.json(
      { error: "District not found" },
      { status: 404 }
    );
  }

  /* 2️⃣ Target Data (sisd_shgs - block wise) */
  const { data: targetRows } = await supabase
    .schema("institution_tracking")
    .from("sisd_shgs")
    .select("block_id, total_shgs, total_members")
    .eq("district_id", districtId);

  /* 3️⃣ Latest Date */
  const { data: latestRow } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) {
    return NextResponse.json({
      district,
      blocks: [],
    });
  }

  const latestDate = latestRow.date;

  /* 4️⃣ Approved Data (block wise) */
  const { data: dailyRows } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select(
      `
      block_id,
      first_time_approved_total_shgs,
      first_time_approved_total_members
      `
    )
    .eq("district_id", districtId)
    .eq("date", latestDate);

  /* 5️⃣ Block Master */
  const { data: blockMaster } = await supabase
    .schema("institution_tracking")
    .from("blocks")
    .select("id, name")
    .eq("district_id", districtId);

  const blockMap: Record<string, any> = {};

  blockMaster?.forEach((b) => {
    blockMap[b.id] = {
      id: b.id,
      name: b.name,
      target_shgs: 0,
      target_members: 0,
      approved_shgs: 0,
      approved_members: 0,
    };
  });

  /* 6️⃣ Add Target Data */
  targetRows?.forEach((row) => {
    if (!blockMap[row.block_id]) return;

    blockMap[row.block_id].target_shgs += row.total_shgs;
    blockMap[row.block_id].target_members += row.total_members;
  });

  /* 7️⃣ Add Approved Data */
  dailyRows?.forEach((row) => {
    if (!blockMap[row.block_id]) return;

    blockMap[row.block_id].approved_shgs += Number(
      row.first_time_approved_total_shgs
    );

    blockMap[row.block_id].approved_members += Number(
      row.first_time_approved_total_members
    );
  });

  /* 8️⃣ Final Formatting */
  const blocks = Object.values(blockMap).map((b: any) => ({
    ...b,
    pending_shgs: b.target_shgs - b.approved_shgs,
    pending_members: b.target_members - b.approved_members,
    approval_percent_shgs: percent(
      b.approved_shgs,
      b.target_shgs
    ),
    approval_percent_members: percent(
      b.approved_members,
      b.target_members
    ),
  }));

  return NextResponse.json({
    district,
    blocks,
  });
}
