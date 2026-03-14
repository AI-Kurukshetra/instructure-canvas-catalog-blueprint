import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin • Payments",
};

export default async function AdminPaymentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const payments = [
    { id: "pay_001", user: "sam@example.com", amount: "$59.00", status: "Succeeded", date: "Mar 10, 2026" },
    { id: "pay_002", user: "alex@example.com", amount: "$79.00", status: "Succeeded", date: "Mar 09, 2026" },
    { id: "pay_003", user: "sam@example.com", amount: "$12.00", status: "Succeeded", date: "Feb 10, 2026" },
  ];

  return (
    <AppShell
      title="Payments"
      subtitle="View transactions and process refunds."
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
            <p className="text-xs font-semibold tracking-wide text-white/55">Payments ops</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Transactions</h2>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
          >
            Refund policy
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs font-semibold tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/3">
              {payments.map((p) => (
                <tr key={p.id} className="text-white/80">
                  <td className="px-4 py-3 font-semibold text-white">{p.id}</td>
                  <td className="px-4 py-3">{p.user}</td>
                  <td className="px-4 py-3">{p.amount}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/20">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-xl bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-100 ring-1 ring-red-500/25 transition hover:bg-red-500/20"
                    >
                      Refund
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

