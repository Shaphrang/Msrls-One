//app\api\institution_tracking\admin\district\route.ts
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
    .select("district_id, total_shgs, total_members");

  // 2️⃣ Latest date
  const { data: latestRow } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (!latestRow) return NextResponse.json([]);

  const latestDate = latestRow.date;

  // 3️⃣ Approved data
  const { data: dailyRows } = await supabase
    .schema("institution_tracking")
    .from("shg_daily")
    .select(
      "district_id, first_time_approved_total_shgs, first_time_approved_total_members"
    )
    .eq("date", latestDate);

  // 4️⃣ District master
  const { data: districts } = await supabase
    .schema("institution_tracking")
    .from("districts")
    .select("id, name");

  const districtMap: Record<string, any> = {};

  districts?.forEach((d) => {
    districtMap[d.id] = {
      id: d.id,
      name: d.name,
      target_shgs: 0,
      target_members: 0,
      approved_shgs: 0,
      approved_members: 0,
    };
  });

  targetRows?.forEach((row) => {
    districtMap[row.district_id].target_shgs += row.total_shgs;
    districtMap[row.district_id].target_members += row.total_members;
  });

  dailyRows?.forEach((row) => {
    districtMap[row.district_id].approved_shgs += Number(
      row.first_time_approved_total_shgs
    );
    districtMap[row.district_id].approved_members += Number(
      row.first_time_approved_total_members
    );
  });

  const result = Object.values(districtMap).map((d: any) => ({
    ...d,
    pending_shgs: d.target_shgs - d.approved_shgs,
    pending_members: d.target_members - d.approved_members,
    approval_percent_shgs: percent(d.approved_shgs, d.target_shgs),
    approval_percent_members: percent(
      d.approved_members,
      d.target_members
    ),
  }));

  return NextResponse.json(result);
}
