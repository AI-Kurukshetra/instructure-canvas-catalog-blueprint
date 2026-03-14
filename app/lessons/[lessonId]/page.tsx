import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { LessonPlayerClient } from "@/components/player/lesson-player-client";
import { getCourseById } from "@/lib/catalog/data";
import { findCourse, findLesson, lessonsForCourse } from "@/lib/mock-data";
import {
  getLessonById,
  getLessonsByCourseId,
  getProgressForCourse,
  isEnrolled,
} from "@/lib/lessons/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const lessonRow = await getLessonById(lessonId);
  let lesson: {
    id: string;
    courseId: string;
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
    isPreview: boolean;
  } | null = null;
  let course: { id: string; slug: string; title: string } | null = null;
  let lessonList: { id: string; title: string; duration: number; order: number; isPreview: boolean; completedAt: string | null }[] = [];
  let initialPositionSeconds = 0;
  let accessToken: string | null = null;

  if (lessonRow) {
    const enrolled = await isEnrolled(user?.id ?? null, lessonRow.course_id);
    if (!lessonRow.is_preview && !enrolled) {
      const c = await getCourseById(lessonRow.course_id);
      return (
        <AppShell
          title="Lesson locked"
          subtitle="Enroll in the course to access this lesson."
          right={
            <Link
              href={c ? `/courses/${c.slug}` : "/catalog"}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              {c ? "Enroll in course" : "Browse catalog"}
            </Link>
          }
        >
          <section className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 text-center">
            <p className="text-white/80">
              Sign in and enroll in <strong>{c?.title ?? "this course"}</strong> to watch this
              lesson.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              Sign in to enroll
            </Link>
          </section>
        </AppShell>
      );
    }

    course = await getCourseById(lessonRow.course_id);
    if (!course) return notFound();

    const lessons = await getLessonsByCourseId(lessonRow.course_id);
    const progressMap = await getProgressForCourse(
      user?.id ?? null,
      lessons.map((l) => l.id),
    );

    lesson = {
      id: lessonRow.id,
      courseId: lessonRow.course_id,
      title: lessonRow.title,
      videoUrl: lessonRow.video_url,
      duration: lessonRow.duration,
      order: lessonRow.order,
      isPreview: lessonRow.is_preview,
    };

    lessonList = lessons.map((l) => {
      const p = progressMap.get(l.id);
      return {
        id: l.id,
        title: l.title,
        duration: l.duration,
        order: l.order,
        isPreview: l.is_preview,
        completedAt: p?.completed_at ?? null,
      };
    });

    const myProgress = progressMap.get(lessonId);
    initialPositionSeconds = myProgress?.last_position_seconds ?? 0;

    const { data: { session } } = await supabase.auth.getSession();
    accessToken = session?.access_token ?? null;
  }

  if (!lesson && !course) {
    const mockLesson = findLesson(lessonId);
    const mockCourse = mockLesson ? findCourse(mockLesson.courseId) : null;

    if (!mockLesson || !mockCourse) return notFound();

    const mockLessons = lessonsForCourse(mockCourse.id);
    course = {
      id: mockCourse.id,
      slug: mockCourse.id,
      title: mockCourse.title,
    };
    lesson = {
      id: mockLesson.id,
      courseId: mockCourse.id,
      title: mockLesson.title,
      videoUrl: "https://archive.org/download/OpenMedCourseM2EN/OpenMedCourse_Intro_EN.mp4",
      duration: mockLesson.durationMinutes * 60,
      order: mockLesson.order,
      isPreview: mockLesson.isPreview,
    };
    lessonList = mockLessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.durationMinutes * 60,
      order: l.order,
      isPreview: l.isPreview,
      completedAt: null,
    }));
  }

  if (!lesson || !course) return notFound();

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";

  return (
    <AppShell
      title={lesson.title}
      subtitle={`${course.title} • Lesson ${lesson.order} of ${lessonList.length}`}
      right={
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Course
          </Link>
          {!user && (
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
            >
              Sign in
            </Link>
          )}
        </div>
      }
    >
      <LessonPlayerClient
        lessonId={lesson.id}
        courseId={course.slug}
        courseTitle={course.title}
        lesson={{
          id: lesson.id,
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
          isPreview: lesson.isPreview,
        }}
        lessonList={lessonList}
        initialPositionSeconds={initialPositionSeconds}
        accessToken={accessToken}
        origin={origin}
      />
    </AppShell>
  );
}
