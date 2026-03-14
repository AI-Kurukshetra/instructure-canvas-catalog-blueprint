import Link from "next/link";

import AppShell from "@/components/app/app-shell";
import { sampleCertificates } from "@/lib/mock-data";

export const metadata = {
  title: "Verify certificate",
};

export default function VerifyCertificatePage({ params }: { params: { uid: string } }) {
  const cert = sampleCertificates.find((c) => c.uid === params.uid) ?? null;

  return (
    <AppShell
      title="Certificate verification"
      subtitle="Confirm a course completion using a certificate identifier."
      right={
        <Link
          href="/"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Home
        </Link>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-7">
          <p className="text-xs font-semibold tracking-wide text-white/55">Verification result</p>
          <div className="mt-4 rounded-2xl bg-gradient-to-b from-white/7 to-white/4 p-6 ring-1 ring-white/12">
            {cert ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Valid certificate</p>
                    <p className="mt-1 text-sm text-white/70">
                      This completion record matches our issued certificates.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/20">
                    Verified
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold tracking-wide text-white/55">Learner</p>
                    <p className="mt-1 text-sm font-semibold text-white">{cert.learnerName}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold tracking-wide text-white/55">Course</p>
                    <p className="mt-1 text-sm font-semibold text-white">{cert.courseTitle}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold tracking-wide text-white/55">Issued</p>
                    <p className="mt-1 text-sm text-white/75">
                      {new Date(cert.issuedAtIso).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold tracking-wide text-white/55">Certificate ID</p>
                    <p className="mt-1 text-sm font-semibold text-white">{cert.uid}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">No match found</p>
                    <p className="mt-1 text-sm text-white/70">
                      This ID is not recognized. Check the link and try again.
                    </p>
                  </div>
                  <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-100 ring-1 ring-red-500/25">
                    Unverified
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">About verification</p>
            <h2 className="mt-2 text-lg font-semibold text-white">What this page confirms</h2>
            <p className="mt-3 text-sm text-white/70">
              Verification confirms that the certificate identifier was issued by this platform and
              matches a completion record.
            </p>
            <div className="mt-4 space-y-2 text-sm text-white/65">
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-sky-300/80" />
                <p>Course title and learner name</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-sky-300/80" />
                <p>Issue date and certificate ID</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Next step</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Learn more</h2>
            <p className="mt-3 text-sm text-white/70">
              Explore the catalog or sign in to view your learner dashboard.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/catalog"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                Browse catalog
              </Link>
              <Link
                href="/login"
                className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Sign in
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

