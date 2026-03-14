"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import type { AuthActionState } from "@/app/(auth)/actions";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthFormProps = {
  heading: string;
  description: string;
  submitLabel: string;
  alternateHref: string;
  alternateLabel: string;
  alternateLinkText: string;
  passwordAutoComplete?: string;
  action: (
    state: void | AuthActionState,
    formData: FormData,
  ) => Promise<void | AuthActionState>;
};

const initialState: AuthActionState = { status: "idle" };

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      <span className="relative z-10">{pending ? "Working..." : label}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px 120px at 20% 0%, rgba(56,189,248,.18), transparent 60%), radial-gradient(260px 120px at 90% 120%, rgba(244,63,94,.14), transparent 60%)",
        }}
      />
    </button>
  );
};

export default function AuthForm({
  heading,
  description,
  submitLabel,
  alternateHref,
  alternateLabel,
  alternateLinkText,
  passwordAutoComplete,
  action,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [oauthPending, setOauthPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const continueWithGoogle = async () => {
    try {
      setOauthPending(true);
      const supabase = getBrowserSupabaseClient();
      const origin = window.location.origin;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
      });
    } finally {
      // Supabase redirects on success; this reset mainly helps if the call fails.
      setOauthPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {state?.status === "error" ? (
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-100 ring-1 ring-red-500/20">
          <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-red-500/20 text-red-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 8v5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 16h.01"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M10.3 4.6l-7.4 12.8A2 2 0 004.6 20h14.8a2 2 0 001.7-2.6L13.7 4.6a2 2 0 00-3.4 0z"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.8"
              />
            </svg>
          </span>
          <p className="text-pretty">{state.message}</p>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/7 to-white/4 p-6 ring-1 ring-white/12 shadow-[0_16px_80px_rgba(0,0,0,.45)] backdrop-blur sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-sky-300/70 via-white/10 to-rose-300/70"
        />

        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/85 ring-1 ring-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3l9 5-9 5-9-5 9-5z"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.85"
              />
              <path
                d="M3 12l9 5 9-5"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.55"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-white">{heading}</h2>
            <p className="mt-1 text-sm text-white/70">{description}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={continueWithGoogle}
            disabled={oauthPending}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(260px 120px at 20% 0%, rgba(56,189,248,.16), transparent 60%), radial-gradient(260px 120px at 90% 120%, rgba(244,63,94,.12), transparent 60%)",
              }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="relative">
              <path
                d="M21.35 11.1H12v2.8h5.35c-.5 2.9-2.95 4.2-5.35 4.2a6 6 0 010-12c1.7 0 3.1.7 4.15 1.8l1.95-1.95A8.8 8.8 0 0012 3.2a8.8 8.8 0 100 17.6c5.1 0 8.5-3.6 8.5-8.6 0-.6-.05-1.05-.15-1.1z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
            <span className="relative">{oauthPending ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/45">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-medium text-white/90">
              Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid w-9 place-items-center text-white/55">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 7l8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  <path
                    d="M4 7h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    opacity="0.6"
                  />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 grid w-9 place-items-center text-white/55">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M8 11V8a4 4 0 018 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  <path
                    d="M7 11h10v9H7v-9z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    opacity="0.7"
                  />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete={passwordAutoComplete ?? "current-password"}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-12 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-rose-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 inline-flex items-center rounded-xl px-3 text-xs font-semibold text-white/70 ring-1 ring-transparent transition hover:bg-white/5 hover:text-white hover:ring-white/10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton label={submitLabel} />
          </div>
        </form>

        <p className="mt-4 text-sm text-white/70">
          {alternateLabel}{" "}
          <Link href={alternateHref} className="font-medium text-white underline underline-offset-4">
            {alternateLinkText}
          </Link>
        </p>

        <p className="mt-6 text-xs text-white/45">Use a test project for development.</p>
      </div>
    </div>
  );
}
