"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type EnrollButtonProps = {
  courseSlug: string;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  origin: string;
};

export function EnrollButton({
  courseSlug,
  isEnrolled,
  isAuthenticated,
  origin,
}: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <a
        href="/login"
        className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
      >
        Sign in to enroll
      </a>
    );
  }

  if (isEnrolled) {
    return (
      <span className="rounded-2xl bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
        Enrolled
      </span>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${origin}/api/courses/${courseSlug}/enroll`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={loading}
      className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:opacity-70"
    >
      {loading ? "Enrolling…" : "Enroll now"}
    </button>
  );
}
