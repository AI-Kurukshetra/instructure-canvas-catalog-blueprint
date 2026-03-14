import { redirect } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");

  const invoices = [
    { id: "inv_001", date: "Mar 10, 2026", amount: "$59.00", status: "Paid" },
    { id: "inv_002", date: "Feb 10, 2026", amount: "$12.00", status: "Paid" },
  ];

  return (
    <AppShell
      title="Billing"
      subtitle="Manage payments, invoices, and subscription status."
      right={
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
          Stripe (test)
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-5">
          <p className="text-xs font-semibold tracking-wide text-white/55">Plan</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Subscription</h2>
          <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Monthly access</p>
                <p className="mt-1 text-sm text-white/70">Renews on Apr 10, 2026</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/20">
                Active
              </span>
            </div>
            <p className="mt-3 text-xs text-white/55">
              Placeholder UI. Stripe Checkout + customer portal integrate in the payments module.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_70px_rgba(56,189,248,.14)] transition hover:brightness-110"
            >
              Manage subscription
            </button>
            <button
              type="button"
              className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 transition hover:bg-white/15"
            >
              Update payment method
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:col-span-7">
          <p className="text-xs font-semibold tracking-wide text-white/55">History</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Invoices</h2>

          <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs font-semibold tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/3">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="text-white/80">
                    <td className="px-4 py-3 font-semibold text-white">{inv.id}</td>
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3">{inv.amount}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">Refund policy</p>
            <p className="mt-2 text-sm text-white/70">
              Refunds are available within 30 days of purchase. Admins can process refunds from the
              payments view.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

