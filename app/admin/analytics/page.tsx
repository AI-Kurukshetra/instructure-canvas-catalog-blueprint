import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin • Analytics",
};

export default async function AdminAnalyticsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const stats = [
    { label: "Enrollments", value: "3,240", accent: "bg-sky-300/80" },
    { label: "Completion rate", value: "62%", accent: "bg-emerald-300/80" },
    { label: "Revenue (30d)", value: "$18,420", accent: "bg-rose-300/80" },
    { label: "Refund rate", value: "1.8%", accent: "bg-amber-300/80" },
  ];

  return (
    <AppShell
      title="Analytics"
      subtitle="Enrollment counts, completion rates, and revenue snapshots."
      right={
        <Link
          href="/admin"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Admin
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-wide text-white/55">{s.label}</p>
              <span className={`h-2 w-2 rounded-full ${s.accent}`} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-7">
          <p className="text-xs font-semibold tracking-wide text-white/55">Trends</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Performance</h2>
          <div className="mt-5 grid place-items-center rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">Chart placeholder</p>
            <p className="mt-1 text-sm text-white/70">
              This module will render analytics charts from real enrollment and payment data.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-5">
          <p className="text-xs font-semibold tracking-wide text-white/55">KPIs</p>
          <h2 className="mt-2 text-xl font-semibold text-white">What to watch</h2>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            {[
              "Search conversion and enrollment funnel drop-off",
              "Time spent learning and course completion rates",
              "Revenue per learner and refund rate",
            ].map((t) => (
              <div key={t} className="flex gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-300/80" />
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

