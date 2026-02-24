import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const profile = searchParams.get("profile") || "migrated";
  const entity = searchParams.get("entity") || "shg";

  const supabase = createSupabaseServer();

  const { data, error } = await supabase.rpc(
    "rpc_district_block_daily_growth",
    {
      p_profile: profile,
      p_entity: entity
    }
  );

  if (error) {
    console.error("BLOCK GROWTH ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}
