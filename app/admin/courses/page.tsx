import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCourse, upsertCategory } from "@/app/admin/courses/actions";

export const metadata = {
  title: "Admin • Courses",
};

export default async function AdminCoursesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const role =
    (user.app_metadata as Record<string, unknown> | null)?.role ??
    (user.user_metadata as Record<string, unknown> | null)?.role;

  if (role !== "admin") redirect("/admin");

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name");

  const { data: courses } = await supabase
    .from("courses")
    .select("id,title,slug,status,price_cents,currency,category_id,created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell
      title="Courses"
      subtitle="Upload, edit, publish, and unpublish courses."
      right={
        <Link
          href="/admin"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Admin
        </Link>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-4">
          <p className="text-xs font-semibold tracking-wide text-white/55">Create</p>
          <h2 className="mt-2 text-xl font-semibold text-white">New course</h2>
          <form action={createCourse} className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Title</label>
              <input
                name="title"
                placeholder="Course title"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Category</label>
              <select
                name="category_id"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                defaultValue=""
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Price (USD)</label>
              <input
                name="price_usd"
                type="number"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-4 focus:ring-rose-500/15"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110"
            >
              Create course
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-semibold tracking-wide text-white/55">Organize</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Categories</h3>
            <form action={upsertCategory} className="mt-4 flex gap-2">
              <input
                name="name"
                placeholder="Add category (e.g., Tech)"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-emerald-500/15"
              />
              <button
                type="submit"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Add
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {(categories ?? []).slice(0, 12).map((c) => (
                <span
                  key={c.id}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/75 ring-1 ring-white/10"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-white/55">Catalog ops</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Manage courses</h2>
            </div>
            <Link
              href="/catalog"
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            >
              View public catalog
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs font-semibold tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/3">
                {(courses ?? []).map((c) => (
                  <tr key={c.id} className="text-white/80">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{c.title}</p>
                      <p className="mt-1 text-xs text-white/60">{c.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      ${(Math.round((c.price_cents ?? 0) / 100 * 100) / 100).toFixed(2)}{" "}
                      <span className="text-white/50">{c.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {!courses?.length ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-white/60" colSpan={4}>
                      No courses yet. Create one on the left.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
