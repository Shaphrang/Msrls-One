//app\api\institution_tracking\upload\shg\route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  validateHeaders,
  validateRowBasics,
  toNumber,
} from "@/lib/institution_tracking/validators";

export async function POST(req: NextRequest) {
  console.log("---- SHG UPLOAD STARTED ----");

  const supabase = createSupabaseServer();

  try {
    // ===============================
    // 1️⃣ Read Form Data
    // ===============================
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const date = formData.get("date") as string;

    console.log("Date received:", date);

    if (!file || !date) {
      console.log("Missing file or date");
      return NextResponse.json(
        { error: "File and date required" },
        { status: 400 }
      );
    }

    console.log("File received:", file.name);
    console.log("File size:", file.size);

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large (max 5MB allowed)");
    }

    // ===============================
    // 2️⃣ Read Excel File
    // ===============================
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    console.log("Sheet detected:", sheetName);

    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log("Total rows parsed:", rows.length);

    // ===============================
    // 3️⃣ Validate Headers
    // ===============================
    validateHeaders(rows, [
      "district",
      "block",
      "migrated_shgs",
      "migrated_members",
      "new_shgs",
      "new_members",
      "total_shgs",
      "total_members",
      "first_time_approved_migrated_shgs",
      "first_time_approved_migrated_members",
      "first_time_approved_new_shgs",
      "first_time_approved_new_members",
      "first_time_approved_total_shgs",
      "first_time_approved_total_members",
    ]);

    console.log("Header validation passed");

    // ===============================
    // 4️⃣ Fetch Districts & Blocks
    // ===============================
    const { data: districts, error: districtError } = await supabase
    .schema("institution_tracking")  
    .from("districts")
      .select("id,name");

    if (districtError) {
      console.error("District fetch error:", districtError);
      throw districtError;
    }

    const { data: blocks, error: blockError } = await supabase
      .schema("institution_tracking")
      .from("blocks")
      .select("id,name");

    if (blockError) {
      console.error("Block fetch error:", blockError);
      throw blockError;
    }

    console.log("Districts loaded:", districts?.length);
    console.log("Blocks loaded:", blocks?.length);

    const districtMap = new Map(
      districts?.map((d) => [d.name.trim(), d.id])
    );

    const blockMap = new Map(
      blocks?.map((b) => [b.name.trim(), b.id])
    );

    // ===============================
    // 5️⃣ Build Payload
    // ===============================
    const payload = rows.map((row, index) => {
      validateRowBasics(row);

      const districtId = districtMap.get(row.district?.trim());
      const blockId = blockMap.get(row.block?.trim());

      if (!districtId || !blockId) {
        throw new Error(
          `Invalid district/block at row ${index + 1}: ${row.district} - ${row.block}`
        );
      }

      return {
        date,
        district_id: districtId,
        block_id: blockId,

        migrated_shgs: toNumber(row.migrated_shgs),
        migrated_members: toNumber(row.migrated_members),
        new_shgs: toNumber(row.new_shgs),
        new_members: toNumber(row.new_members),
        total_shgs: toNumber(row.total_shgs),
        total_members: toNumber(row.total_members),

        first_time_approved_migrated_shgs: toNumber(
          row.first_time_approved_migrated_shgs
        ),
        first_time_approved_migrated_members: toNumber(
          row.first_time_approved_migrated_members
        ),
        first_time_approved_new_shgs: toNumber(
          row.first_time_approved_new_shgs
        ),
        first_time_approved_new_members: toNumber(
          row.first_time_approved_new_members
        ),
        first_time_approved_total_shgs: toNumber(
          row.first_time_approved_total_shgs
        ),
        first_time_approved_total_members: toNumber(
          row.first_time_approved_total_members
        ),
      };
    });

    console.log("Payload prepared:", payload.length);

    // ===============================
    // 6️⃣ UPSERT
    // ===============================
    const { error: upsertError } = await supabase
      .schema("institution_tracking")
      .from("shg_daily")
      .upsert(payload, { onConflict: "date,block_id" });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      throw upsertError;
    }

    console.log("Upsert successful");

    // ===============================
    // 7️⃣ Log Success
    // ===============================
    await supabase
      .schema("institution_tracking")
      .from("upload_logs")
      .insert({
        file_type: "shg",
        data_date: date,
        rows_processed: payload.length,
        status: "success",
      });

    console.log("Upload logged successfully");

    console.log("---- SHG UPLOAD COMPLETED ----");

    return NextResponse.json({
      message: "SHG upload successful",
      rows_processed: payload.length,
    });

  } catch (err: any) {
    console.error("UPLOAD FAILED:", err);

    try {
      await createSupabaseServer()
        .schema("institution_tracking")
        .from("upload_logs")
        .insert({
          file_type: "shg",
          data_date: null,
          rows_processed: 0,
          status: "failed",
          error_message: err.message,
        });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
