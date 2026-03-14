"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const requireAdmin = async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  const role =
    (data.user.app_metadata as Record<string, unknown> | null)?.role ??
    (data.user.user_metadata as Record<string, unknown> | null)?.role;
  if (role !== "admin") throw new Error("Admin role required.");

  return supabase;
};

export const seedCatalog = async () => {
  const supabase = await requireAdmin();

  const categories = [
    { name: "Tech skills" },
    { name: "Finance" },
    { name: "Healthcare" },
    { name: "Leadership" },
    { name: "Compliance" },
  ].map((c) => ({ ...c, slug: slugify(c.name) }));

  const { data: insertedCats, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select("id,slug");

  if (catError) throw new Error(catError.message);

  const catId = new Map((insertedCats ?? []).map((c) => [c.slug, c.id] as const));

  const courses = [
    {
      title: "TypeScript for Busy Professionals",
      category: "tech-skills",
      level: "Beginner",
      duration_minutes: 270,
      price_cents: 5900,
      instructor_name: "A. Patel",
      prerequisites: ["Basic JavaScript"],
      description:
        "Write safer JavaScript with TypeScript fundamentals, practical patterns, and a refactor-driven workflow you can ship immediately.",
    },
    {
      title: "Modern React Patterns: Hooks to Architecture",
      category: "tech-skills",
      level: "Intermediate",
      duration_minutes: 320,
      price_cents: 7900,
      instructor_name: "K. Shah",
      prerequisites: ["React basics", "JavaScript fundamentals"],
      description:
        "Build resilient UI systems with composition patterns, state boundaries, and performance-minded React techniques.",
    },
    {
      title: "Cash Flow and Forecasting for Operators",
      category: "finance",
      level: "Intermediate",
      duration_minutes: 210,
      price_cents: 7900,
      instructor_name: "M. Rivera",
      prerequisites: ["Basic accounting"],
      description:
        "Understand cash flow, build forecasts, and make decisions with simple, repeatable models that survive real-world complexity.",
    },
    {
      title: "Excel Modeling: From Spreadsheets to Decisions",
      category: "finance",
      level: "Beginner",
      duration_minutes: 180,
      price_cents: 4900,
      instructor_name: "R. Singh",
      prerequisites: ["Comfort with Excel"],
      description:
        "Create clean models, avoid common spreadsheet traps, and communicate assumptions with confidence.",
    },
    {
      title: "Healthcare Documentation and Privacy Essentials",
      category: "healthcare",
      level: "Beginner",
      duration_minutes: 165,
      price_cents: 4900,
      instructor_name: "S. Nguyen",
      prerequisites: [],
      description:
        "Learn practical privacy and documentation workflows, and understand what audits look for in healthcare environments.",
    },
    {
      title: "Leadership: Feedback, Clarity, and Trust",
      category: "leadership",
      level: "Advanced",
      duration_minutes: 200,
      price_cents: 9900,
      instructor_name: "J. Kim",
      prerequisites: ["People management experience"],
      description:
        "Run effective 1:1s, give feedback that lands, set expectations, and build trust through systems over heroics.",
    },
    {
      title: "Compliance 101: Policies, Proof, and Practice",
      category: "compliance",
      level: "Beginner",
      duration_minutes: 150,
      price_cents: 5900,
      instructor_name: "D. Morgan",
      prerequisites: [],
      description:
        "Understand the basics of compliance programs: policies, evidence, risk, and how teams stay audit-ready.",
    },
    {
      title: "GDPR for Product Teams",
      category: "compliance",
      level: "Intermediate",
      duration_minutes: 190,
      price_cents: 7900,
      instructor_name: "L. Chen",
      prerequisites: ["Basic product development"],
      description:
        "Translate GDPR concepts into product requirements, consent flows, data retention, and user rights workflows.",
    },
  ].map((c) => ({
    slug: slugify(c.title),
    title: c.title,
    description: c.description,
    instructor_name: c.instructor_name,
    prerequisites: c.prerequisites,
    category_id: catId.get(c.category) ?? null,
    level: c.level,
    duration_minutes: c.duration_minutes,
    price_cents: c.price_cents,
    currency: "USD",
    status: "published",
    enrolled_count: Math.floor(200 + Math.random() * 4000),
    rating: 4.4 + Math.random() * 0.5,
    rating_count: Math.floor(40 + Math.random() * 450),
  }));

  const { data: insertedCourses, error: courseError } = await supabase
    .from("courses")
    .upsert(courses, { onConflict: "slug" })
    .select("id,slug");

  if (courseError) throw new Error(courseError.message);

  const VIDEO_URLS = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ];

  const lessonTemplates: Record<string, { title: string; durationSeconds: number; isPreview: boolean }[]> = {
    "typescript-for-busy-professionals": [
      { title: "Setup and project structure", durationSeconds: 1080, isPreview: true },
      { title: "Types you actually use", durationSeconds: 1440, isPreview: false },
      { title: "Narrowing and inference", durationSeconds: 1680, isPreview: false },
    ],
    "modern-react-patterns-hooks-to-architecture": [
      { title: "Hooks deep dive", durationSeconds: 1200, isPreview: true },
      { title: "Composition patterns", durationSeconds: 1500, isPreview: false },
    ],
    "cash-flow-and-forecasting-for-operators": [
      { title: "Cash flow basics", durationSeconds: 900, isPreview: true },
      { title: "Forecasting models", durationSeconds: 1200, isPreview: false },
    ],
    "excel-modeling-from-spreadsheets-to-decisions": [
      { title: "Model structure", durationSeconds: 960, isPreview: true },
    ],
  };

  if (insertedCourses?.length) {
    const lessons: { course_id: string; title: string; video_url: string; duration: number; order: number; is_preview: boolean }[] = [];
    for (const c of insertedCourses) {
      const tpl = lessonTemplates[c.slug] ?? [
        { title: "Introduction", durationSeconds: 600, isPreview: true },
      ];
      tpl.forEach((t, i) => {
        lessons.push({
          course_id: c.id,
          title: t.title,
          video_url: VIDEO_URLS[i % VIDEO_URLS.length] ?? VIDEO_URLS[0],
          duration: t.durationSeconds,
          order: i + 1,
          is_preview: t.isPreview,
        });
      });
    }

    const { error: lessonError } = await supabase.from("lessons").insert(lessons);
    if (lessonError && !lessonError.message.includes("duplicate")) {
      throw new Error(lessonError.message);
    }
  }

  redirect("/catalog");
};

