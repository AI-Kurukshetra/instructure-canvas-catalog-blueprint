import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
  }

  return NextResponse.json({ data: data ?? [] }, { status: 200 });
}

