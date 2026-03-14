import type { ReactNode } from "react";
import Link from "next/link";

import { signOut } from "@/app/(auth)/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type AppShellProps = {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
};

export default async function AppShell({ title, subtitle, right, children }: AppShellProps) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px 520px at 12% 18%, rgba(56,189,248,.18), transparent 60%), radial-gradient(760px 460px at 88% 55%, rgba(244,63,94,.14), transparent 62%), radial-gradient(620px 520px at 55% 92%, rgba(34,197,94,.10), transparent 60%)",
        }}
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-3">
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
            <p className="text-sm font-semibold tracking-wide text-white">SkillDeck</p>
            <p className="text-xs text-white/60">Professional learning</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/catalog"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Catalog
          </Link>
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
          <Link
            href="/profile"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {right}
          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-6 pb-16">
        {(title || subtitle) && (
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {title ? (
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {title}
                </h1>
              ) : null}
              {subtitle ? <p className="mt-2 text-sm text-white/70">{subtitle}</p> : null}
            </div>
          </div>
        )}

        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-neutral-950/70 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5 px-2 py-2">
          {[
            { href: "/", label: "Home", icon: "home" as const },
            { href: "/catalog", label: "Catalog", icon: "grid" as const },
            { href: "/dashboard", label: "Learn", icon: "play" as const },
            { href: "/certificates", label: "Proof", icon: "badge" as const },
            { href: "/profile", label: "Profile", icon: "user" as const },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                {item.icon === "home" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3 11l9-7 9 7v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.85"
                    />
                    <path
                      d="M9 22V12h6v10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.65"
                    />
                  </svg>
                ) : null}
                {item.icon === "grid" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.8"
                    />
                  </svg>
                ) : null}
                {item.icon === "play" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M15 12l-6 4V8l6 4z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <path
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.55"
                    />
                  </svg>
                ) : null}
                {item.icon === "badge" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3a6 6 0 016 6c0 3.314-2.686 6-6 6s-6-2.686-6-6a6 6 0 016-6z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.75"
                    />
                    <path
                      d="M9.5 14.5L8 22l4-2 4 2-1.5-7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.65"
                    />
                  </svg>
                ) : null}
                {item.icon === "user" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.85"
                    />
                    <path
                      d="M20 21a8 8 0 10-16 0"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.65"
                    />
                  </svg>
                ) : null}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
