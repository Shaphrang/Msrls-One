//app\api\institution_tracking\public\shg\district\route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

function percent(part: number, total: number) {
  if (!total || total === 0) return 0;
  return Number(((part / total) * 100).toFixed(2));
}

export async function GET() {
  const supabase = createSupabaseServer();

  // 1️⃣ Get latest date
  const { data: latestRow, error: latestError } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (latestError || !latestRow) {
    return NextResponse.json([], { status: 200 });
  }

  const latestDate = latestRow.date;

  // 2️⃣ Get SHG rows
  const { data: shgRows, error: shgError } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("*")
    .eq("date", latestDate);

  if (shgError || !shgRows) {
    return NextResponse.json([], { status: 200 });
  }

  // 3️⃣ Get District master table
  const { data: districtMaster, error: districtError } =
    await supabase
      .schema("institution_tracking")
      .from("districts")
      .select("id, name");

  if (districtError || !districtMaster) {
    return NextResponse.json([], { status: 200 });
  }

  // Create district lookup map
  const districtNameMap: Record<string, string> = {};
  districtMaster.forEach((d) => {
    districtNameMap[d.id] = d.name;
  });

  // 4️⃣ Group by district_id
  const districtMap: Record<string, any> = {};

  shgRows.forEach((row) => {
    const districtId = row.district_id;
    const districtName = districtNameMap[districtId];

    if (!districtMap[districtId]) {
      districtMap[districtId] = {
        id: districtId,
        name: districtName,
        migrated_shgs: 0,
        approved_migrated_shgs: 0,
        total_shgs: 0,
        approved_total_shgs: 0,
        total_members: 0,
      };
    }

    districtMap[districtId].migrated_shgs += row.migrated_shgs;
    districtMap[districtId].approved_migrated_shgs +=
      row.first_time_approved_migrated_shgs;

    districtMap[districtId].total_shgs += row.total_shgs;
    districtMap[districtId].approved_total_shgs +=
      row.first_time_approved_total_shgs;

    districtMap[districtId].total_members += row.total_members;
  });

  // 5️⃣ Final formatting
  const result = Object.values(districtMap).map((d: any) => ({
    ...d,
    migrated_approval_percent: percent(
      d.approved_migrated_shgs,
      d.migrated_shgs
    ),
    migrated_pending:
      d.migrated_shgs - d.approved_migrated_shgs,
    total_pending:
      d.total_shgs - d.approved_total_shgs,
  }));

  return NextResponse.json(result);
}
