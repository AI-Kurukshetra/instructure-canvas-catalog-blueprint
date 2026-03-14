"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { VideoPlayer } from "./video-player";

type LessonItem = {
  id: string;
  title: string;
  duration: number;
  order: number;
  isPreview: boolean;
  completedAt: string | null;
};

type LessonPlayerClientProps = {
  lessonId: string;
  courseId: string;
  courseTitle: string;
  lesson: {
    id: string;
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
    isPreview: boolean;
  };
  lessonList: LessonItem[];
  initialPositionSeconds: number;
  accessToken: string | null;
  origin: string;
};

export function LessonPlayerClient({
  lessonId,
  courseId,
  courseTitle,
  lesson,
  lessonList,
  initialPositionSeconds,
  accessToken,
  origin,
}: LessonPlayerClientProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(lessonList.filter((l) => l.completedAt).map((l) => l.id)),
  );
  const currentIndex = lessonList.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex >= 0 ? lessonList[currentIndex + 1] ?? null : null;

  const saveProgress = useCallback(
    async (positionSeconds: number, completed?: boolean) => {
      if (!accessToken) return;
      await fetch(`${origin}/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          lastPositionSeconds: positionSeconds,
          completed: completed ?? false,
        }),
      });
      if (completed) setCompletedIds((prev) => new Set(prev).add(lessonId));
    },
    [accessToken, lessonId, origin],
  );

  const handleComplete = useCallback(() => {
    saveProgress(Math.floor(lesson.duration * 0.75), true);
  }, [lesson.duration, saveProgress]);

  return (
    <section className="grid gap-4 lg:grid-cols-12">
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur lg:col-span-8">
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
          <VideoPlayer
            src={lesson.videoUrl}
            duration={lesson.duration}
            initialPositionSeconds={initialPositionSeconds}
            onPositionChange={(s) => saveProgress(s, false)}
            onComplete={handleComplete}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              {Math.ceil(lesson.duration / 60)} min
            </span>
            {lesson.isPreview ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/80 ring-1 ring-white/12">
                Preview
              </span>
            ) : (
              <span className="rounded-full bg-white/5 px-3 py-1 text-white/55 ring-1 ring-white/10">
                Enrolled
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {nextLesson ? (
              <Link
                href={`/lessons/${nextLesson.id}`}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Next lesson
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Back to course
              </Link>
            )}
          </div>
        </div>
      </div>

      <aside className="order-first rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur lg:order-none lg:col-span-4">
        <p className="text-xs font-semibold tracking-wide text-white/55">Lessons</p>
        <div className="mt-4 space-y-2">
          {lessonList.map((l) => (
            <Link
              key={l.id}
              href={`/lessons/${l.id}`}
              className={[
                "block rounded-2xl px-4 py-3 ring-1 transition",
                l.id === lessonId
                  ? "bg-white/10 ring-white/15"
                  : "bg-white/5 ring-white/10 hover:bg-white/7 hover:ring-white/15",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white/90">
                  {completedIds.has(l.id) ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    l.order
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {l.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">{Math.ceil(l.duration / 60)} min</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
}
