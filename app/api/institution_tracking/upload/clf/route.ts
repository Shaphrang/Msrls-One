import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createSupabaseServer } from "@/lib/supabase/server";
import { validateHeaders, validateRowBasics, toNumber } from "@/lib/institution_tracking/validators";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const date = formData.get("date") as string;

  if (!file || !date) {
    return NextResponse.json(
      { error: "File and date required" },
      { status: 400 }
    );
  }

  try {
    // Read Excel
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    // Validate Headers
    validateHeaders(rows, [
      "district",
      "block",
      "migrated_clfs",
      "migrated_mapped_vos",
      "new_clfs",
      "new_mapped_vos",
      "total_clfs",
      "total_mapped_vos",
      "first_time_approved_migrated_clfs",
      "first_time_approved_migrated_mapped_vos",
      "first_time_approved_new_clfs",
      "first_time_approved_new_mapped_vos",
      "first_time_approved_total_clfs",
      "first_time_approved_total_mapped_vos",
    ]);

    // Fetch Districts & Blocks
    const { data: districts, error: districtError } = await supabase
      .schema("institution_tracking")
      .from("districts")
      .select("id,name");

    if (districtError) throw districtError;

    const { data: blocks, error: blockError } = await supabase
      .schema("institution_tracking")
      .from("blocks")
      .select("id,name");

    if (blockError) throw blockError;

    const districtMap = new Map(
      districts?.map((d) => [d.name.trim(), d.id])
    );

    const blockMap = new Map(
      blocks?.map((b) => [b.name.trim(), b.id])
    );

    // Build Payload
    const payload = rows.map((row) => {
      validateRowBasics(row);

      const districtId = districtMap.get(row.district?.trim());
      const blockId = blockMap.get(row.block?.trim());

      if (!districtId || !blockId) {
        throw new Error(
          `Invalid district/block: ${row.district} - ${row.block}`
        );
      }

      return {
        date,
        district_id: districtId,
        block_id: blockId,

        migrated_clfs: toNumber(row.migrated_clfs),
        migrated_mapped_vos: toNumber(row.migrated_mapped_vos),
        new_clfs: toNumber(row.new_clfs),
        new_mapped_vos: toNumber(row.new_mapped_vos),
        total_clfs: toNumber(row.total_clfs),
        total_mapped_vos: toNumber(row.total_mapped_vos),

        first_time_approved_migrated_clfs: toNumber(
          row.first_time_approved_migrated_clfs
        ),
        first_time_approved_migrated_mapped_vos: toNumber(
          row.first_time_approved_migrated_mapped_vos
        ),
        first_time_approved_new_clfs: toNumber(
          row.first_time_approved_new_clfs
        ),
        first_time_approved_new_mapped_vos: toNumber(
          row.first_time_approved_new_mapped_vos
        ),
        first_time_approved_total_clfs: toNumber(
          row.first_time_approved_total_clfs
        ),
        first_time_approved_total_mapped_vos: toNumber(
          row.first_time_approved_total_mapped_vos
        ),
      };
    });

    // UPSERT
    const { error: upsertError } = await supabase
      .schema("institution_tracking")
      .from("clf_daily")
      .upsert(payload, { onConflict: "date,block_id" });

    if (upsertError) throw upsertError;

    // Log Success
    await supabase
      .schema("institution_tracking")
      .from("upload_logs")
      .insert({
        file_type: "clf",
        data_date: date,
        rows_processed: payload.length,
        status: "success",
      });

    return NextResponse.json({
      message: "CLF upload successful",
    });

  } catch (err: any) {
    // Log Failure
    await supabase
      .schema("institution_tracking")
      .from("upload_logs")
      .insert({
        file_type: "clf",
        data_date: date,
        rows_processed: 0,
        status: "failed",
        error_message: err.message,
      });

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
