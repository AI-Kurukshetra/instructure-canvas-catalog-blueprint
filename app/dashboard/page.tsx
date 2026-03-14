import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { courses, lessonsForCourse } from "@/lib/mock-data";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  const enrolled = courses.slice(0, 3).map((course, idx) => {
    const progressPct = [68, 24, 100][idx] ?? 0;
    const lessonList = lessonsForCourse(course.id);
    const nextLesson = lessonList.find((l) => l.order === Math.max(1, Math.ceil((progressPct / 100) * lessonList.length))) ?? lessonList[0];
    return { course, progressPct, nextLesson };
  });

  return (
    <AppShell
      title="Your dashboard"
      subtitle="Continue learning, track progress, and access completed certificates."
      right={
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
          {user.email ?? "Learner"}
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-white/55">Continue</p>
              <h2 className="mt-2 text-xl font-semibold text-white">In progress</h2>
            </div>
            <Link
              href="/catalog"
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            >
              Browse catalog
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {enrolled.map(({ course, progressPct, nextLesson }) => (
              <div
                key={course.id}
                className="relative overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{ background: course.thumbnailGradient }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-white/65">{course.category}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{course.title}</p>
                      <p className="mt-1 text-sm text-white/70">
                        Next: {nextLesson ? nextLesson.title : "Lesson"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{progressPct}%</p>
                      <p className="mt-1 text-xs text-white/60">Complete</p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-rose-400"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
                    >
                      Course
                    </Link>
                    {nextLesson ? (
                      <Link
                        href={`/lessons/${nextLesson.id}`}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                      >
                        Resume
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">This week</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Keep momentum</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">Time spent</p>
                <p className="mt-1 text-sm text-white/70">2h 10m</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">Lessons completed</p>
                <p className="mt-1 text-sm text-white/70">6</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Quick actions</p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/certificates"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                View certificates
              </Link>
              <Link
                href="/billing"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Billing
              </Link>
              <Link
                href="/profile"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Profile settings
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

