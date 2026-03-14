import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import AppShell from "@/components/app/app-shell";
import { categories as fallbackCategories, courses as fallbackCourses } from "@/lib/mock-data";

export const metadata = {
  title: "Catalog",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const q = (resolvedSearchParams?.q ?? "").trim();
  const categorySlug = (resolvedSearchParams?.category ?? "").trim();

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";

  const categoryRes = await fetch(`${origin}/api/categories`, { cache: "no-store" });
  const categoryJson = (await categoryRes.json()) as {
    data?: { id: string; name: string; slug: string }[];
    error?: string;
  };
  const categories = categoryJson.error ? [] : categoryJson.data ?? [];

  const courseParams = new URLSearchParams();
  if (q) courseParams.set("q", q);
  if (categorySlug) courseParams.set("category", categorySlug);
  const courseRes = await fetch(`${origin}/api/courses?${courseParams.toString()}`, { cache: "no-store" });
  const courseJson = (await courseRes.json()) as {
    data?: {
      id: string;
      slug: string;
      title: string;
      description: string;
      instructor_name: string;
      level: string;
      duration_minutes: number;
      price_cents: number;
      rating: number;
      rating_count: number;
      enrolled_count: number;
      categories?: { name: string; slug: string } | null;
    }[];
    error?: string;
  };
  const courses = courseJson.error ? [] : courseJson.data ?? [];
  const usingFallback = Boolean(courseJson.error);

  const effectiveCategories = categories.length
    ? categories
    : fallbackCategories.map((c) => ({ id: c, name: c, slug: c.toLowerCase() }));

  const normalizedQuery = q.toLowerCase();
  const fallbackFiltered = fallbackCourses.filter((course) => {
    const matchesCategory = categorySlug ? course.category.toLowerCase() === categorySlug : true;
    const matchesQuery = normalizedQuery
      ? [course.title, course.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      : true;
    return matchesCategory && matchesQuery;
  });

  const effectiveCourses = courses.length
    ? courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.categories?.name ?? "Course",
        level: c.level,
        durationHours: Math.round((c.duration_minutes / 60) * 10) / 10,
        priceUsd: Math.round(c.price_cents / 100),
        rating: Number(c.rating ?? 0),
        ratingCount: c.rating_count ?? 0,
        enrolledCount: c.enrolled_count ?? 0,
        instructorName: c.instructor_name,
        thumbnailGradient:
          "radial-gradient(800px 320px at 20% 20%, rgba(56,189,248,.28), transparent 60%), radial-gradient(800px 320px at 90% 80%, rgba(244,63,94,.18), transparent 60%)",
        slug: c.slug,
      }))
    : (usingFallback ? fallbackFiltered : []).map((c) => ({ ...c, slug: c.id }));

  return (
    <AppShell
      title="Course catalog"
      subtitle="Browse continuing education and professional development courses. Guests can preview; enrollments require sign-in."
    >
      <section className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <label className="text-xs font-semibold tracking-wide text-white/55">Search</label>
            <form
              action={async (formData: FormData) => {
                "use server";
                const query = String(formData.get("q") ?? "").trim();
                const cat = String(formData.get("category") ?? "").trim();
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (cat) params.set("category", cat);
                redirect(`/catalog${params.toString() ? `?${params.toString()}` : ""}`);
              }}
            >
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid w-9 place-items-center text-white/55">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M10.5 18a7.5 7.5 0 117.5-7.5A7.5 7.5 0 0110.5 18z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.9"
                    />
                    <path
                      d="M16.2 16.2L21 21"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search by title or category..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-24 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-2 my-2 inline-flex items-center justify-center rounded-xl bg-white/5 px-3 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  Search
                </button>
              </div>
              <input type="hidden" name="category" value={categorySlug} />
            </form>
            {(q || categorySlug) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                {q ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    Query: <span className="font-semibold text-white">{q}</span>
                  </span>
                ) : null}
                {categorySlug ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    Category: <span className="font-semibold text-white">{categorySlug}</span>
                  </span>
                ) : null}
                <Link
                  href="/catalog"
                  className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  Clear
                </Link>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <label className="text-xs font-semibold tracking-wide text-white/55">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/catalog"
                className={[
                  "rounded-full px-3 py-1.5 text-xs ring-1 transition",
                  categorySlug
                    ? "bg-white/5 text-white/75 ring-white/10 hover:bg-white/10 hover:text-white"
                    : "bg-white/10 text-white ring-white/15",
                ].join(" ")}
              >
                All
              </Link>
              {effectiveCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/catalog?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    category: c.slug,
                  }).toString()}`}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs ring-1 transition",
                    c.slug === categorySlug
                      ? "bg-white/10 text-white ring-white/15"
                      : "bg-white/5 text-white/75 ring-white/10 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {effectiveCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/7 to-white/4 p-4 ring-1 ring-white/12 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(56,189,248,.10)]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-80"
              style={{ background: course.thumbnailGradient }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-white/65">{course.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{course.title}</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/12">
                  ${course.priceUsd}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm text-white/70">{course.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/10">
                  {course.level}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/10">
                  {course.durationHours}h
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/10">
                  {course.rating.toFixed(1)} ({course.ratingCount})
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-white/60">Instructor: {course.instructorName}</p>
                <span className="text-xs font-semibold text-white/85 transition group-hover:text-white">
                  View details
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
