import { NextResponse } from "next/server";

import {
  getLessonById,
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

  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found", data: null }, { status: 404 });
  }

  const enrolled = await isEnrolled(user?.id ?? null, lesson.course_id);
  const canAccess = lesson.is_preview || enrolled;

  if (!canAccess) {
    return NextResponse.json(
      { error: "Enroll in the course to access this lesson", data: null },
      { status: 403 },
    );
  }

  return NextResponse.json({
    data: {
      id: lesson.id,
      courseId: lesson.course_id,
      title: lesson.title,
      videoUrl: lesson.video_url,
      duration: lesson.duration,
      order: lesson.order,
      isPreview: lesson.is_preview,
    },
  });
}
