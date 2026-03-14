import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleCertificates } from "@/lib/mock-data";

export const metadata = {
  title: "Certificates",
};

export default async function CertificatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  return (
    <AppShell
      title="Certificates"
      subtitle="Download, verify, and share proof of completion."
      right={
        <Link
          href="/dashboard"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Back to dashboard
        </Link>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-8">
          <p className="text-xs font-semibold tracking-wide text-white/55">Your certificates</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Completed</h2>

          <div className="mt-5 space-y-3">
            {sampleCertificates.map((cert) => (
              <div
                key={cert.uid}
                className="rounded-2xl bg-gradient-to-b from-white/7 to-white/4 p-5 ring-1 ring-white/12"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-white/60">Certificate</p>
                    <p className="mt-1 text-lg font-semibold text-white">{cert.courseTitle}</p>
                    <p className="mt-1 text-sm text-white/70">
                      Issued to <span className="font-semibold text-white">{cert.learnerName}</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/12">
                    {cert.uid}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                  >
                    Download PDF
                  </button>
                  <Link
                    href={`/verify/${encodeURIComponent(cert.uid)}`}
                    className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
                  >
                    Verify link
                  </Link>
                  <button
                    type="button"
                    className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Verification</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Public proof</h3>
            <p className="mt-3 text-sm text-white/70">
              Each certificate includes a unique identifier and a public verification URL.
            </p>
            <div className="mt-4 space-y-2 text-sm text-white/65">
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-300/80" />
                <p>Shareable link for profiles and resumes</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-300/80" />
                <p>Verification page confirms learner and course</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Tip</p>
            <h3 className="mt-2 text-lg font-semibold text-white">LinkedIn ready</h3>
            <p className="mt-3 text-sm text-white/70">
              Add certificate links to your LinkedIn profile. This module will include structured
              metadata in the PDF in the certificate feature.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

