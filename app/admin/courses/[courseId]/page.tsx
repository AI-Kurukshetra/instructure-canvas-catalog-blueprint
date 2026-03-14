import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { updateCourse } from "@/app/admin/courses/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin • Edit course",
};

export default async function AdminEditCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return notFound();

  const role =
    (auth.user.app_metadata as Record<string, unknown> | null)?.role ??
    (auth.user.user_metadata as Record<string, unknown> | null)?.role;
  if (role !== "admin") return notFound();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      "id,slug,title,description,instructor_name,prerequisites,category_id,level,duration_minutes,price_cents,status",
    )
    .eq("id", params.courseId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!course) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .order("name");

  return (
    <AppShell
      title="Edit course"
      subtitle="Update the listing details, category, prerequisites, and pricing."
      right={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Courses
          </Link>
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
          >
            View public
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-8">
          <p className="text-xs font-semibold tracking-wide text-white/55">Course listing</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{course.title}</h2>

          <form action={updateCourse} className="mt-6 space-y-5">
            <input type="hidden" name="id" value={course.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Title</label>
                <input
                  name="title"
                  defaultValue={course.title}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Slug</label>
                <input
                  name="slug"
                  defaultValue={course.slug}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Description</label>
              <textarea
                name="description"
                defaultValue={course.description}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-rose-500/15"
              />
              <p className="text-xs text-white/55">
                Keep this practical: outcomes, who it is for, and what learners can do afterward.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Instructor name</label>
                <input
                  name="instructor_name"
                  defaultValue={course.instructor_name}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Category</label>
                <select
                  name="category_id"
                  defaultValue={course.category_id ?? ""}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                >
                  <option value="" className="bg-neutral-900">
                    Unassigned
                  </option>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id} className="bg-neutral-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Prerequisites (comma-separated)
              </label>
              <input
                name="prerequisites"
                defaultValue={(course.prerequisites ?? []).join(", ")}
                placeholder="Basic JavaScript, SQL fundamentals"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-emerald-500/15"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-white/90">Level</label>
                <select
                  name="level"
                  defaultValue={course.level}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-neutral-900">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Duration (min)</label>
                <input
                  name="duration_minutes"
                  type="number"
                  defaultValue={course.duration_minutes ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Price (USD)</label>
                <input
                  name="price_usd"
                  type="number"
                  step="0.01"
                  defaultValue={Math.round((course.price_cents ?? 0) / 100 * 100) / 100}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-rose-500/15"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Status</label>
                <select
                  name="status"
                  defaultValue={course.status}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                >
                  <option value="draft" className="bg-neutral-900">
                    draft
                  </option>
                  <option value="published" className="bg-neutral-900">
                    published
                  </option>
                </select>
                <p className="text-xs text-white/55">
                  Only published courses appear in the public catalog.
                </p>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Publishing</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Visibility</h3>
            <p className="mt-3 text-sm text-white/70">
              Courses marked as <span className="font-semibold text-white">published</span> will be visible
              in the public catalog.
            </p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Current status</p>
              <p className="mt-1 text-sm text-white/70">{course.status}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Preview</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Public page</h3>
            <p className="mt-3 text-sm text-white/70">
              Use the public page to verify the listing, copy, and pricing.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/courses/${course.slug}`}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                Open public
              </Link>
              <Link
                href="/catalog"
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                View catalog
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

