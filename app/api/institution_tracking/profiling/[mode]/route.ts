import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ mode: string }> }
) {
  try {
    const supabase = createSupabaseServer();

    // ✅ IMPORTANT: Await params in Next 14
    const { mode } = await context.params;

    // Validate allowed modes
    if (!["migrated", "new"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid profiling mode" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "rpc_profiling",
      { p_mode: mode }
    );

    if (error) {
      console.error("PROFILING RPC ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? {});

  } catch (err: any) {
    console.error("PROFILING API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
