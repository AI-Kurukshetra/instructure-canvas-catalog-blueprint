import { NextResponse } from "next/server";

import { getCourseBySlug } from "@/lib/catalog/data";
import {
  getLessonsByCourseId,
  getProgressForCourse,
} from "@/lib/lessons/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await getCourseBySlug(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found", data: null }, { status: 404 });
  }

  const lessons = await getLessonsByCourseId(course.id);
  const lessonIds = lessons.map((l) => l.id);
  const progressMap = await getProgressForCourse(user?.id ?? null, lessonIds);

  const data = lessons.map((l) => {
    const p = progressMap.get(l.id);
    return {
      id: l.id,
      courseId: l.course_id,
      title: l.title,
      videoUrl: l.video_url,
      duration: l.duration,
      order: l.order,
      isPreview: l.is_preview,
      completedAt: p?.completed_at ?? null,
      lastPositionSeconds: p?.last_position_seconds ?? 0,
    };
  });

  return NextResponse.json({ data });
}
