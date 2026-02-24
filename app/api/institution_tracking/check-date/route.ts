//app\api\institution_tracking\check-date\route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServer();
  const type = req.nextUrl.searchParams.get("type");
  const date = req.nextUrl.searchParams.get("date");

  if (!type || !date) {
    return NextResponse.json({ exists: false });
  }

  const { data } = await supabase
    .from(`institution_tracking.${type}_daily`)
    .select("id")
    .eq("date", date)
    .limit(1);

  return NextResponse.json({
    exists: data && data.length > 0,
  });
}
