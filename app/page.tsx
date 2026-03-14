import Link from "next/link";

import { signOut } from "@/app/(auth)/actions";
import Reveal from "@/components/landing/reveal";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px 520px at 12% 18%, rgba(56,189,248,.24), transparent 60%), radial-gradient(760px 460px at 88% 55%, rgba(244,63,94,.18), transparent 62%), radial-gradient(620px 520px at 55% 92%, rgba(34,197,94,.12), transparent 60%), radial-gradient(900px 520px at 50% -10%, rgba(168,85,247,.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(60% 45% at 50% 12%, black 35%, transparent 70%)",
        }}
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="inline-flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3l9 5-9 5-9-5 9-5z"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <path
                d="M3 12l9 5 9-5"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.55"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-white">Canvas Catalog</p>
            <p className="text-xs text-white/60">Learner-first MVP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/catalog"
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            >
              Catalog
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/certificates"
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  Certificates
                </Link>
              </>
            ) : null}
          </nav>
          <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10 sm:inline">
            {session ? "Signed in" : "Guest"}
          </span>
          {session ? (
            <form action={signOut}>
              <button className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                Sign out
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-wide text-white/55">PRODUCT OVERVIEW</p>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
            Learner-first MVP for continuing education
          </div>

          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-sky-200 via-white to-rose-200 bg-clip-text text-transparent">
              Professional development, delivered like a product.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
            Continuing education, made simple: discover courses, enroll, learn, and earn proof of
            completion.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {session ? (
              <>
                <Link
                  href="/"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                >
                  Continue learning
                </Link>
                <div className="rounded-2xl bg-white/5 px-5 py-3 text-sm text-white/70 ring-1 ring-white/10">
                  Signed in as{" "}
                  <span className="font-medium text-white">
                    {session.user.email ?? "user"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl bg-white/5 px-6 py-3 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Fast discovery",
                desc: "Search, filters, and previews for guests.",
                icon: (
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
                ),
              },
              {
                title: "Track progress",
                desc: "Completion, time spent, next lesson.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 19V5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M7 16l4-4 3 3 6-7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M20 8V5h-3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                ),
              },
              {
                title: "Proof of work",
                desc: "Certificates with verification support.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 3h10v10a5 5 0 11-10 0V3z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.8"
                    />
                    <path
                      d="M9 7h6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M12 16l1 2 2 .5-1.5 1.5.4 2-1.9-1.1-1.9 1.1.4-2L9 18.5l2-.5 1-2z"
                      fill="currentColor"
                      opacity="0.85"
                    />
                  </svg>
                ),
              },
              {
                title: "Browse",
                desc: "Explore the catalog as a guest.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 6h16M4 12h10M4 18h16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>
                ),
              },
              {
                title: "Enroll",
                desc: "Create an account and purchase or join.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M9 11a4 4 0 100-8 4 4 0 000 8z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.9"
                    />
                    <path
                      d="M19 8v6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <path
                      d="M22 11h-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                ),
              },
              {
                title: "Complete",
                desc: "Finish lessons and earn a certificate.",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl bg-white/7 p-4 ring-1 ring-white/12 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:ring-white/20 hover:shadow-[0_18px_80px_rgba(56,189,248,.12)]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(260px 120px at 20% 0%, rgba(56,189,248,.22), transparent 60%), radial-gradient(260px 120px at 90% 120%, rgba(244,63,94,.18), transparent 60%)",
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/85 ring-1 ring-white/10">
                    {card.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-sm text-white/70">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-white/55">CORE PLATFORM FEATURES</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                The essentials that ship an MVP.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-white/60 sm:block">Built for the learner journey.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-6">
            <Reveal className="md:col-span-4" delayMs={0}>
              <div className="rounded-2xl border-l-4 border-sky-300/90 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold">Catalog and discovery</p>
                <p className="mt-1 text-sm text-white/70">
                  Find the right course fast and commit with confidence.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-snug text-white/65">
                  <li>Listings: categories, prerequisites, pricing</li>
                  <li>Search, filters, and previews</li>
                </ul>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delayMs={80}>
              <div className="rounded-2xl border-l-4 border-emerald-300/90 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold">Accounts and enrollment</p>
                <p className="mt-1 text-sm text-white/70">Secure access and clean enrollments.</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-snug text-white/65">
                  <li>Auth: email/password, Google, sessions, roles</li>
                  <li>Capacity, waitlists, gated access</li>
                </ul>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delayMs={0}>
              <div className="rounded-2xl border-l-4 border-rose-300/90 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold">Learning experience</p>
                <p className="mt-1 text-sm text-white/70">Playback and progress learners trust.</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-snug text-white/65">
                  <li>Video: controls, resume, speed</li>
                  <li>Progress + mobile: completion, time, next</li>
                </ul>
              </div>
            </Reveal>

            <Reveal className="md:col-span-4" delayMs={80}>
              <div className="rounded-2xl border-l-4 border-amber-300/90 bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold">Payments and credentials</p>
                <p className="mt-1 text-sm text-white/70">Paid access plus certificates to share.</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-snug text-white/65">
                  <li>Payments: one-time, subscriptions, refunds</li>
                  <li>Certificates: generate, share, verify</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-12 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 backdrop-blur">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.20]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(80% 80% at 50% 40%, black 45%, transparent 75%)",
            }}
          />
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-white/55">PLATFORM ECOSYSTEM &amp; GROWTH</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Retention, reach, and what comes next.
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-white/60 sm:block">Scale engagement and revenue.</p>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(56,189,248,.10)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-sky-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Engagement features</p>
                  <p className="mt-1 text-sm text-white/70">Keep learners active and accountable.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 8h10M7 12h6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M5 4h14a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.65"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {["Forums", "Q&A", "Reviews", "Ratings", "Quizzes"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(34,197,94,.10)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Discovery and mobile</p>
                  <p className="mt-1 text-sm text-white/70">Reduce friction from search to enroll.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M11 19a8 8 0 118-8 8 8 0 01-8 8z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.85"
                    />
                    <path
                      d="M18 18l3 3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {["Filters", "Sorting", "Previews", "Mobile-first UI"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(244,63,94,.08)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-rose-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Popular learning tracks</p>
                  <p className="mt-1 text-sm text-white/70">Start niche, then expand the catalog.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3l9 5-9 5-9-5 9-5z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.8"
                    />
                    <path
                      d="M3 12l9 5 9-5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.55"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {["Tech", "Healthcare", "Finance", "Compliance", "Leadership"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(251,191,36,.08)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-amber-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Built for roles</p>
                  <p className="mt-1 text-sm text-white/70">Learners now. Instructors next.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M9 11a4 4 0 100-8 4 4 0 000 8z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.85"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {["Learner-first", "Instructor dashboards", "Admin later", "Org management"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(168,85,247,.08)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-violet-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Common questions</p>
                  <p className="mt-1 text-sm text-white/70">Clarity for first-time visitors.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 17h.01"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                    <path
                      d="M10 9a2.5 2.5 0 015 0c0 2-2.5 2-2.5 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M12 3a9 9 0 100 18 9 9 0 000-18z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.6"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <p>
                  <span className="font-medium text-white/90">Guests can browse.</span> Sign in to enroll
                  and track progress.
                </p>
                <p>
                  <span className="font-medium text-white/90">Certificates are verifiable</span> with
                  identifiers and links.
                </p>
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(45,212,191,.08)]">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-teal-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">What to measure</p>
                  <p className="mt-1 text-sm text-white/70">A tight set of outcome metrics.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 19V5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M7 16l4-4 3 3 6-7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {["MAU", "Time spent", "Completion", "Search conversion", "Retention", "Revenue"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="group relative min-h-[190px] rounded-2xl bg-gradient-to-b from-white/7 to-white/3 p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:ring-white/20 hover:shadow-[0_24px_120px_rgba(217,70,239,.08)] sm:col-span-2 lg:col-span-2">
              <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-fuchsia-300/80 via-white/10 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Monetization options</p>
                  <p className="mt-1 text-sm text-white/70">Flexible pricing as you scale.</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 7h10v10H7V7z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.6"
                    />
                    <path
                      d="M9 12h6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M12 9v6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                {[
                  "Course sales",
                  "Subscriptions",
                  "Freemium",
                  "Certification fees",
                  "Corporate licensing",
                  "Sponsored content",
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/80" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
