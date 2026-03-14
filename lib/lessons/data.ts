import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LessonRow = {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  duration: number;
  order: number;
  is_preview: boolean;
};

export type LessonProgressRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  last_position_seconds: number;
  completed_at: string | null;
};

const isMissingRelation = (msg: string) =>
  (msg.includes("relation") && msg.includes("does not exist")) ||
  msg.includes("schema cache") ||
  msg.includes("Could not find the table");

export async function getLessonById(lessonId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id,course_id,title,video_url,duration,order,is_preview")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) {
    if (isMissingRelation(error.message)) return null;
    throw new Error(error.message);
  }
  return data as LessonRow | null;
}

export async function getLessonsByCourseId(courseId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id,course_id,title,video_url,duration,order,is_preview")
    .eq("course_id", courseId)
    .order("order");

  if (error) {
    if (isMissingRelation(error.message)) return [];
    throw new Error(error.message);
  }
  return (data ?? []) as LessonRow[];
}

export async function isEnrolled(userId: string | null, courseId: string): Promise<boolean> {
  if (!userId) return false;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    if (isMissingRelation(error.message)) return false;
    throw new Error(error.message);
  }
  return !!data;
}

export async function getLessonProgress(userId: string | null, lessonId: string) {
  if (!userId) return null;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("id,user_id,lesson_id,last_position_seconds,completed_at")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    if (isMissingRelation(error.message)) return null;
    throw new Error(error.message);
  }
  return data as LessonProgressRow | null;
}

export async function getProgressForCourse(userId: string | null, lessonIds: string[]) {
  if (!userId || lessonIds.length === 0) return new Map<string, LessonProgressRow>();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("id,user_id,lesson_id,last_position_seconds,completed_at")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  if (error) {
    if (isMissingRelation(error.message)) return new Map();
    throw new Error(error.message);
  }
  const map = new Map<string, LessonProgressRow>();
  for (const row of data ?? []) {
    map.set(row.lesson_id, row as LessonProgressRow);
  }
  return map;
}
