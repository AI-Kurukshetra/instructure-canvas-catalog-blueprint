import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin • Users",
};

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const users = [
    { id: "usr_001", email: "sam@example.com", status: "Active", role: "learner" },
    { id: "usr_002", email: "alex@example.com", status: "Active", role: "learner" },
    { id: "usr_003", email: "devadmin@example.com", status: "Active", role: "admin" },
  ];

  return (
    <AppShell
      title="Users"
      subtitle="View, deactivate, and manage learner accounts."
      right={
        <Link
          href="/admin"
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Admin
        </Link>
      }
    >
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/55">User ops</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Manage users</h2>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
          >
            Export CSV
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs font-semibold tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/3">
              {users.map((u) => (
                <tr key={u.id} className="text-white/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{u.email}</p>
                    <p className="mt-1 text-xs text-white/60">{u.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{u.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-100 ring-1 ring-red-500/25 transition hover:bg-red-500/20"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

