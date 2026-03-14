import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px 500px at 18% 22%, rgba(56,189,248,.20), transparent 60%), radial-gradient(700px 420px at 85% 60%, rgba(244,63,94,.16), transparent 62%), radial-gradient(620px 480px at 52% 92%, rgba(34,197,94,.12), transparent 60%)",
        }}
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="group inline-flex items-center gap-3">
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
              <path
                d="M3 16l9 5 9-5"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.35"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide text-white">SkillDeck</span>
            <span className="block text-xs text-white/60">Professional learning</span>
          </span>
        </Link>

        <Link
          href="/"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Back to home
        </Link>
      </header>

      <main className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-6 lg:grid-cols-2 lg:items-center">
        <section className="lg:pr-6">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Build skills that actually matter.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
            SkillDeck transforms training into measurable progress, verified credentials, and
            real professional growth.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm font-semibold">Learn for your role</p>
              <p className="mt-1 text-sm text-white/70">Skill-based catalogs mapped to real jobs.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm font-semibold">Proof of progress</p>
              <p className="mt-1 text-sm text-white/70">Track learning and earn trusted certificates.</p>
            </div>
          </div>

          <p className="mt-8 text-xs text-white/55">
            Tip: Use Google sign-in to speed up access for new learners.
          </p>
        </section>

        <section className="lg:pl-6">{children}</section>
      </main>
    </div>
  );
}
