import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  return (
    <AppShell
      title="Profile"
      subtitle="Update your learner profile and preferences."
      right={
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
          {user.email ?? "Learner"}
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-7">
          <p className="text-xs font-semibold tracking-wide text-white/55">Account</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Basics</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Full name</label>
              <input
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/20 focus:ring-4 focus:ring-sky-500/15"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Email</label>
              <input
                value={user.email ?? ""}
                readOnly
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 outline-none"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-white/90">Avatar</label>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
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
                    opacity="0.7"
                  />
                </svg>
              </div>
              <button
                type="button"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Upload
              </button>
              <button
                type="button"
                className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              >
                Remove
              </button>
            </div>
            <p className="text-xs text-white/55">PNG or JPG up to 2MB.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110"
            >
              Save changes
            </button>
            <button
              type="button"
              className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            >
              Reset password
            </button>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Preferences</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Notifications</h3>

            <div className="mt-5 space-y-3">
              {[
                { title: "Course updates", desc: "Announcements and schedule changes." },
                { title: "Receipts", desc: "Payments and billing confirmations." },
                { title: "Completion", desc: "Certificate and completion status." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 h-6 w-11 rounded-full bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                    aria-label={`Toggle ${item.title}`}
                  >
                    <span className="block h-5 w-5 translate-x-1 rounded-full bg-white/70" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="text-xs font-semibold tracking-wide text-white/55">Privacy</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Data controls</h3>
            <p className="mt-3 text-sm text-white/70">
              Request export or deletion of your data (GDPR-ready). This is a placeholder for the
              MVP settings UI.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
              >
                Export data
              </button>
              <button
                type="button"
                className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100 ring-1 ring-red-500/25 transition hover:bg-red-500/20"
              >
                Delete account
              </button>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

