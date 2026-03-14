import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { seedCatalog } from "@/app/admin/seed/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin • Seed",
};

export default async function AdminSeedPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const role =
    (user.app_metadata as Record<string, unknown> | null)?.role ??
    (user.user_metadata as Record<string, unknown> | null)?.role;
  if (role !== "admin") redirect("/admin");

  return (
    <AppShell
      title="Seed data"
      subtitle="Populate the catalog with realistic demo categories and published courses."
      right={
        <Link
          href="/admin"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Admin
        </Link>
      }
    >
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
        <p className="text-sm font-semibold text-white">Seed the catalog</p>
        <p className="mt-2 text-sm text-white/70">
          This will upsert 5 categories and 8 published courses. Safe to run multiple times.
        </p>

        <form action={seedCatalog} className="mt-5">
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110"
          >
            Seed database
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-xs font-semibold tracking-wide text-white/55">Prerequisite</p>
          <p className="mt-2 text-sm text-white/70">
            Run the Supabase migrations first so `categories` and `courses` tables exist.
          </p>
          <p className="mt-3 text-sm text-white/70">
            SQL files:{" "}
            <span className="font-semibold text-white">
              supabase/migrations/20260314_000001_catalog_courses.sql
            </span>{" "}
            and{" "}
            <span className="font-semibold text-white">
              supabase/migrations/20260314_000002_admin_role_policy.sql
            </span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}

