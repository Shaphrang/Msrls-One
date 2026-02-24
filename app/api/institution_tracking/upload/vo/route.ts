import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createSupabaseServer } from "@/lib/supabase/server";
import { validateHeaders, validateRowBasics, toNumber } from "@/lib/institution_tracking/validators";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer();
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const date = formData.get("date") as string;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    validateHeaders(rows, [
      "district","block",
      "migrated_vos","migrated_mapped_shgs",
      "new_vos","new_mapped_shgs",
      "total_vos","total_mapped_shgs",
      "first_time_approved_migrated_vos",
      "first_time_approved_migrated_mapped_shgs",
      "first_time_approved_new_vos",
      "first_time_approved_new_mapped_shgs",
      "first_time_approved_total_vos",
      "first_time_approved_total_mapped_shgs"
    ]);

    const { data: districts } = await supabase
    .schema("institution_tracking")
    .from("districts")
    .select("id,name");
    const { data: blocks } = await supabase
    .schema("institution_tracking")
    .from("blocks")
    .select("id,name");

    const districtMap = new Map(districts?.map(d => [d.name.trim(), d.id]));
    const blockMap = new Map(blocks?.map(b => [b.name.trim(), b.id]));

    const payload = rows.map(row => ({
      date,
      district_id: districtMap.get(row.district.trim()),
      block_id: blockMap.get(row.block.trim()),

      migrated_vos: toNumber(row.migrated_vos),
      migrated_mapped_shgs: toNumber(row.migrated_mapped_shgs),
      new_vos: toNumber(row.new_vos),
      new_mapped_shgs: toNumber(row.new_mapped_shgs),
      total_vos: toNumber(row.total_vos),
      total_mapped_shgs: toNumber(row.total_mapped_shgs),

      first_time_approved_migrated_vos: toNumber(row.first_time_approved_migrated_vos),
      first_time_approved_migrated_mapped_shgs: toNumber(row.first_time_approved_migrated_mapped_shgs),
      first_time_approved_new_vos: toNumber(row.first_time_approved_new_vos),
      first_time_approved_new_mapped_shgs: toNumber(row.first_time_approved_new_mapped_shgs),
      first_time_approved_total_vos: toNumber(row.first_time_approved_total_vos),
      first_time_approved_total_mapped_shgs: toNumber(row.first_time_approved_total_mapped_shgs),
    }));

    await supabase
      .schema("institution_tracking")
      .from("vo_daily")
      .upsert(payload, { onConflict: "date,block_id" });

    return NextResponse.json({ message: "VO upload successful" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
