import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin",
};

export default async function AdminHomePage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  const role =
    (user.app_metadata as Record<string, unknown> | null)?.role ??
    (user.user_metadata as Record<string, unknown> | null)?.role;

  if (role !== "admin") {
    return (
      <AppShell title="Admin" subtitle="You do not have access to this area.">
        <div className="rounded-2xl bg-red-500/10 p-6 ring-1 ring-red-500/20">
          <p className="text-sm font-semibold text-red-100">Access denied</p>
          <p className="mt-2 text-sm text-red-100/80">
            This area requires an admin role. Set an admin role in Supabase user metadata to
            continue.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const items = [
    { title: "Courses", desc: "Upload, edit, publish", href: "/admin/courses" },
    { title: "Users", desc: "View and deactivate learners", href: "/admin/users" },
    { title: "Payments", desc: "Transactions and refunds", href: "/admin/payments" },
    { title: "Analytics", desc: "Enrollment and revenue", href: "/admin/analytics" },
    { title: "Seed data", desc: "Populate demo catalog", href: "/admin/seed" },
  ];

  return (
    <AppShell title="Admin" subtitle="Manage courses, users, payments, and analytics.">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((i) => (
          <Link
            key={i.title}
            href={i.href}
            className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/7 hover:ring-white/15"
          >
            <p className="text-sm font-semibold text-white">{i.title}</p>
            <p className="mt-2 text-sm text-white/70">{i.desc}</p>
            <p className="mt-4 text-xs font-semibold text-white/75">Open</p>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
