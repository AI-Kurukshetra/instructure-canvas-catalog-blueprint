import { NextResponse } from "next/server";

import {
  getLessonById,
  getLessonProgress,
  isEnrolled,
} from "@/lib/lessons/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", data: null }, { status: 401 });
  }

  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found", data: null }, { status: 404 });
  }

  const enrolled = await isEnrolled(user.id, lesson.course_id);
  if (!lesson.is_preview && !enrolled) {
    return NextResponse.json({ error: "Forbidden", data: null }, { status: 403 });
  }

  const progress = await getLessonProgress(user.id, lessonId);
  return NextResponse.json({
    data: progress
      ? {
          lastPositionSeconds: progress.last_position_seconds,
          completedAt: progress.completed_at,
        }
      : { lastPositionSeconds: 0, completedAt: null },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", data: null }, { status: 401 });
  }

  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found", data: null }, { status: 404 });
  }

  const enrolled = await isEnrolled(user.id, lesson.course_id);
  if (!lesson.is_preview && !enrolled) {
    return NextResponse.json({ error: "Forbidden", data: null }, { status: 403 });
  }

  let body: { lastPositionSeconds?: number; completed?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // ignore
  }

  const lastPositionSeconds = Math.max(0, Number(body.lastPositionSeconds ?? 0) | 0);
  const completed = Boolean(body.completed);

  const existing = await getLessonProgress(user.id, lessonId);
  const completedAt = completed
    ? new Date().toISOString()
    : (existing?.completed_at ?? null);

  const { data, error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        last_position_seconds: lastPositionSeconds,
        completed_at: completedAt,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,lesson_id",
        ignoreDuplicates: false,
      },
    )
    .select("id,last_position_seconds,completed_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, data: null },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      lastPositionSeconds: data?.last_position_seconds ?? lastPositionSeconds,
      completedAt: data?.completed_at ?? (completed ? new Date().toISOString() : null),
    },
  });
}
