import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor_name: string;
  prerequisites: string[];
  category_id: string | null;
  categories?: { name: string; slug: string } | null;
  level: string;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  thumbnail_url: string | null;
  status: string;
  enrolled_count: number;
  rating: number;
  rating_count: number;
};

const isMissingRelationError = (message: string) =>
  message.includes('relation "public.courses" does not exist') ||
  message.includes('relation "public.categories" does not exist') ||
  message.includes('relation "courses" does not exist') ||
  message.includes('relation "categories" does not exist') ||
  message.includes("schema cache") ||
  message.includes("Could not find the table");

export const getCategories = async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name");

  if (error) {
    if (isMissingRelationError(error.message)) return [] as CategoryRow[];
    throw new Error(error.message);
  }

  return (data ?? []) as CategoryRow[];
};

export const getPublishedCourses = async (opts?: { q?: string; category?: string }) => {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("courses")
    .select(
      "id,slug,title,description,instructor_name,prerequisites,category_id,level,duration_minutes,price_cents,currency,thumbnail_url,status,enrolled_count,rating,rating_count,categories(name,slug)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (opts?.q) query = query.ilike("title", `%${opts.q}%`);
  if (opts?.category) query = query.eq("category_id", opts.category);

  const { data, error } = await query;

  if (error) {
    if (isMissingRelationError(error.message)) return [] as CourseRow[];
    throw new Error(error.message);
  }

  return (data ?? []) as CourseRow[];
};

export const getCourseById = async (id: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id,slug,title")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error.message)) return null;
    throw new Error(error.message);
  }

  return data as { id: string; slug: string; title: string } | null;
};

export const getCourseBySlug = async (slug: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id,slug,title,description,instructor_name,prerequisites,category_id,level,duration_minutes,price_cents,currency,thumbnail_url,status,enrolled_count,rating,rating_count,categories(name,slug)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    if (isMissingRelationError(error.message)) return null;
    throw new Error(error.message);
  }

  return (data ?? null) as CourseRow | null;
};
