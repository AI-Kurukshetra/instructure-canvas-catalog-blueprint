import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { EnrollButton } from "@/components/courses/enroll-button";
import { lessonsForCourse, findCourse as fallbackFindCourse } from "@/lib/mock-data";
import { getCourseBySlug } from "@/lib/catalog/data";
import {
  getLessonsByCourseId,
  isEnrolled,
} from "@/lib/lessons/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const courseRow = await getCourseBySlug(courseId);
  const fallback = fallbackFindCourse(courseId);

  const course = courseRow
    ? {
        id: courseRow.id,
        title: courseRow.title,
        description: courseRow.description,
        category: courseRow.categories?.name ?? "Course",
        level: courseRow.level,
        durationHours: Math.round((courseRow.duration_minutes / 60) * 10) / 10,
        priceUsd: Math.round(courseRow.price_cents / 100),
        rating: Number(courseRow.rating ?? 0),
        ratingCount: courseRow.rating_count ?? 0,
        enrolledCount: courseRow.enrolled_count ?? 0,
        instructorName: courseRow.instructor_name,
        prerequisites: courseRow.prerequisites ?? [],
        thumbnailGradient:
          "radial-gradient(800px 320px at 20% 20%, rgba(56,189,248,.28), transparent 60%), radial-gradient(800px 320px at 90% 80%, rgba(244,63,94,.18), transparent 60%)",
      }
    : fallback;

  if (!course) return notFound();

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const enrolled = courseRow ? await isEnrolled(user?.id ?? null, courseRow.id) : false;

  let lessonList: { id: string; title: string; order: number; durationMinutes: number; isPreview: boolean }[];
  if (courseRow) {
    const dbLessons = await getLessonsByCourseId(courseRow.id);
    lessonList = dbLessons.map((l) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      durationMinutes: Math.ceil(l.duration / 60),
      isPreview: l.is_preview,
    }));
  } else {
    lessonList = fallback ? lessonsForCourse(fallback.id) : [];
  }
  const previewLesson = lessonList.find((l) => l.isPreview) ?? lessonList[0] ?? null;

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";

  return (
    <AppShell
      title={course.title}
      subtitle={`${course.category} • ${course.level} • ${course.durationHours}h • ${course.rating.toFixed(
        1,
      )} (${course.ratingCount})`}
      right={
        <div className="flex items-center gap-2">
          <Link
            href="/catalog"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Back to catalog
          </Link>
          {!user ? (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              Sign in
            </Link>
          ) : (
            <EnrollButton
              courseSlug={courseId}
              isEnrolled={enrolled}
              isAuthenticated
              origin={origin}
            />
          )}
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/7 to-white/4 p-6 ring-1 ring-white/12 backdrop-blur lg:col-span-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-90"
            style={{ background: course.thumbnailGradient }}
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-wide text-white/65">Overview</p>
            <p className="mt-3 text-sm text-white/75">{course.description}</p>

            {course.prerequisites.length ? (
              <div className="mt-6">
                <p className="text-xs font-semibold tracking-wide text-white/65">Prerequisites</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {course.prerequisites.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={previewLesson ? `/lessons/${previewLesson.id}` : "/catalog"}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                {previewLesson ? "Preview lesson" : "Browse catalog"}
              </Link>
              <EnrollButton
                courseSlug={courseId}
                isEnrolled={enrolled}
                isAuthenticated={!!user}
                origin={origin}
              />
            </div>
          </div>
        </div>

        <aside className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-4">
          <p className="text-xs font-semibold tracking-wide text-white/55">Course details</p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <span>Price</span>
              <span className="font-semibold text-white">${course.priceUsd}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Instructor</span>
              <span className="text-white/85">{course.instructorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Enrolled</span>
              <span className="text-white/85">{course.enrolledCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">What you will get</p>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-300/80" />
                <p>Progress tracking across sessions</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-300/80" />
                <p>Certificate on completion</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-300/80" />
                <p>Mobile-friendly experience</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/55">Syllabus</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Lessons</h2>
          </div>
          <p className="text-sm text-white/60">{lessonList.length} lessons</p>
        </div>

        {lessonList.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {lessonList.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="group rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/7 hover:ring-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {lesson.order}. {lesson.title}
                    </p>
                    <p className="mt-1 text-sm text-white/65">{lesson.durationMinutes} min</p>
                  </div>
                  {lesson.isPreview ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                      Preview
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55 ring-1 ring-white/10">
                      Locked
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold text-white/75 group-hover:text-white">
                  Open lesson
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">Lessons not configured yet</p>
            <p className="mt-2 text-sm text-white/70">
              This MVP screen is wired for course listings. Lessons will come from the Lessons
              module when the `lessons` table is integrated.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
