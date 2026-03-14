"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const requireAdmin = async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  const role =
    (data.user.app_metadata as Record<string, unknown> | null)?.role ??
    (data.user.user_metadata as Record<string, unknown> | null)?.role;

  if (role !== "admin") {
    throw new Error("Admin role required.");
  }

  return supabase;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const upsertCategorySchema = z.object({
  name: z.string().min(2),
});

export const upsertCategory = async (formData: FormData) => {
  const parsed = upsertCategorySchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await requireAdmin();
  const slug = slugify(parsed.data.name);

  const { error } = await supabase.from("categories").upsert({ name: parsed.data.name, slug }, { onConflict: "slug" });
  if (error) throw new Error(error.message);

  redirect("/admin/courses");
};

const createCourseSchema = z.object({
  title: z.string().min(3),
  category_id: z.string().uuid().nullable().optional(),
  price_usd: z.coerce.number().min(0).max(100000),
});

export const createCourse = async (formData: FormData) => {
  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    category_id: formData.get("category_id") ? String(formData.get("category_id")) : null,
    price_usd: formData.get("price_usd"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await requireAdmin();
  const slug = slugify(parsed.data.title);
  const priceCents = Math.round(parsed.data.price_usd * 100);

  const { data, error } = await supabase
    .from("courses")
    .insert({
      slug,
      title: parsed.data.title,
      description: "Add a course description to help learners decide.",
      instructor_name: "Staff",
      prerequisites: [],
      category_id: parsed.data.category_id ?? null,
      level: "Beginner",
      duration_minutes: 0,
      price_cents: priceCents,
      currency: "USD",
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  redirect(`/admin/courses/${data.id}`);
};

const updateCourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  instructor_name: z.string().min(2),
  prerequisites: z.string().optional(),
  category_id: z.string().uuid().nullable().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration_minutes: z.coerce.number().min(0).max(100000),
  price_usd: z.coerce.number().min(0).max(100000),
  status: z.enum(["draft", "published"]),
});

export const updateCourse = async (formData: FormData) => {
  const parsed = updateCourseSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    instructor_name: formData.get("instructor_name"),
    prerequisites: formData.get("prerequisites") ? String(formData.get("prerequisites")) : "",
    category_id: formData.get("category_id") ? String(formData.get("category_id")) : null,
    level: formData.get("level"),
    duration_minutes: formData.get("duration_minutes"),
    price_usd: formData.get("price_usd"),
    status: formData.get("status"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await requireAdmin();
  const prerequisites = parsed.data.prerequisites
    ? parsed.data.prerequisites
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const { error } = await supabase.from("courses").update({
    title: parsed.data.title,
    slug: slugify(parsed.data.slug),
    description: parsed.data.description,
    instructor_name: parsed.data.instructor_name,
    prerequisites,
    category_id: parsed.data.category_id ?? null,
    level: parsed.data.level,
    duration_minutes: parsed.data.duration_minutes,
    price_cents: Math.round(parsed.data.price_usd * 100),
    status: parsed.data.status,
  }).eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  redirect(`/admin/courses/${parsed.data.id}`);
};

export const togglePublish = async (courseId: string, nextStatus: "draft" | "published") => {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("courses").update({ status: nextStatus }).eq("id", courseId);
  if (error) throw new Error(error.message);
  redirect("/admin/courses");
};

