import { NextResponse } from "next/server";

import { getCourseBySlug } from "@/lib/catalog/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", data: null }, { status: 401 });
  }

  const course = await getCourseBySlug(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found", data: null }, { status: 404 });
  }

  const { error } = await supabase
    .from("enrollments")
    .upsert(
      { user_id: user.id, course_id: course.id },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );

  if (error) {
    return NextResponse.json(
      { error: error.message, data: null },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: { enrolled: true } }, { status: 200 });
}
