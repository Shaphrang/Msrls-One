//app\api\institution_tracking\upload-history\route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServer();
  const type = req.nextUrl.searchParams.get("type");

  const { data } = await supabase
    .from("institution_tracking.upload_logs")
    .select("*")
    .eq("file_type", type)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json(data);
}
