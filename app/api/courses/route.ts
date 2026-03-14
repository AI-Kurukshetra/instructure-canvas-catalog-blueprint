import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const selectFields =
  "id,slug,title,description,instructor_name,prerequisites,category_id,level,duration_minutes,price_cents,currency,thumbnail_url,status,enrolled_count,rating,rating_count,categories(name,slug)";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const categorySlug = (url.searchParams.get("category") ?? "").trim();

    const supabase = await createServerSupabaseClient();

    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: cat, error: catError } = await supabase
        .from("categories")
        .select("id")
        .ilike("slug", categorySlug)
        .maybeSingle();
      if (!catError) categoryId = cat?.id ?? null;
    }

    const baseQuery = () =>
      supabase
        .from("courses")
        .select(selectFields)
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (q) {
      const like = `%${q}%`;

      const [titleRes, catRes] = await Promise.all([
        baseQuery().ilike("title", like),
        supabase
          .from("categories")
          .select("id")
          .or(`name.ilike.${like},slug.ilike.${like}`),
      ]);

      if (titleRes.error) {
        return NextResponse.json(
          { error: titleRes.error.message, data: [] },
          { status: 200 },
        );
      }

      const titleIds = new Set((titleRes.data ?? []).map((c: { id: string }) => c.id));
      const matchingCatIds = (catRes.data ?? []).map((c: { id: string }) => c.id);

      const combined = [...(titleRes.data ?? [])];

      if (matchingCatIds.length > 0 && !catRes.error) {
        const { data: catCourses } = await baseQuery().in(
          "category_id",
          matchingCatIds,
        );
        for (const c of catCourses ?? []) {
          if (!titleIds.has(c.id)) {
            titleIds.add(c.id);
            combined.push(c);
          }
        }
      }

      let result = combined;
      if (categoryId) {
        result = combined.filter((c) => c.category_id === categoryId);
      }

      return NextResponse.json({ data: result }, { status: 200 });
    }

    let query = baseQuery();
    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error", data: [] },
      { status: 200 },
    );
  }
}
