import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag,
  CalendarDays,
  MessageSquare,
  Mail,
  DollarSign,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Tab = "overview" | "orders" | "appointments" | "inquiries" | "subscribers";

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: "overview", label: "Overview", icon: DollarSign },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "inquiries", label: "Inquiries", icon: MessageSquare },
  { key: "subscribers", label: "Subscribers", icon: Mail },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
              tab === t.key ? "bg-charcoal text-cream" : "bg-white text-mid-gray hover:bg-pink-pale"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </nav>
      {tab === "overview" && <Overview onNav={setTab} />}
      {tab === "orders" && <Orders />}
      {tab === "appointments" && <Appointments />}
      {tab === "inquiries" && <Inquiries />}
      {tab === "subscribers" && <Subscribers />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">{children}</div>;
}
function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-pink-deep" />
    </div>
  );
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ---------------- Overview ---------------- */
function Overview({ onNav }: { onNav: (t: Tab) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [orders, appts, contacts, events, subs] = await Promise.all([
        supabase.from("orders").select("total, status", { count: "exact" }),
        supabase.from("appointments").select("id, status", { count: "exact" }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("event_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);
      const paid = (orders.data ?? []).filter((o: any) => o.status === "paid");
      const revenue = paid.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
      const pendingAppts = (appts.data ?? []).filter((a: any) => a.status === "pending").length;
      return {
        revenue,
        orderCount: orders.count ?? 0,
        paidCount: paid.length,
        apptCount: appts.count ?? 0,
        pendingAppts,
        inquiries: (contacts.count ?? 0) + (events.count ?? 0),
        subscribers: subs.count ?? 0,
      };
    },
  });

  if (isLoading) return <Spinner />;
  const stats = [
    { label: "Revenue (paid)", value: `$${(data?.revenue ?? 0).toFixed(2)}`, tab: "orders" as Tab },
    { label: "Orders", value: `${data?.paidCount}/${data?.orderCount}`, tab: "orders" as Tab },
    { label: "Appointments", value: data?.apptCount ?? 0, tab: "appointments" as Tab },
    { label: "Pending bookings", value: data?.pendingAppts ?? 0, tab: "appointments" as Tab },
    { label: "Inquiries", value: data?.inquiries ?? 0, tab: "inquiries" as Tab },
    { label: "Subscribers", value: data?.subscribers ?? 0, tab: "subscribers" as Tab },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {stats.map((s) => (
        <button key={s.label} onClick={() => onNav(s.tab)} className="text-left">
          <Card>
            <p className="text-sm text-mid-gray">{s.label}</p>
            <p className="mt-2 font-display text-3xl">{s.value}</p>
          </Card>
        </button>
      ))}
    </div>
  );
}

/* ---------------- Orders ---------------- */
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "refunded", "cancelled"];
function Orders() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: string) {
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "overview"] });
  }

  if (isLoading) return <Spinner />;
  if (!data?.length) return <Card><p className="text-mid-gray">No orders yet.</p></Card>;

  return (
    <div className="space-y-4">
      {data.map((o: any) => (
        <Card key={o.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg">#{o.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-mid-gray">{o.customer_name} · {o.customer_email}</p>
              <p className="text-xs text-mid-gray">{fmtDate(o.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl">${Number(o.total ?? 0).toFixed(2)}</p>
              <select
                value={o.status}
                onChange={(e) => setStatus(o.id, e.target.value)}
                className="mt-2 rounded-full border border-border bg-cream px-3 py-1.5 text-xs"
              >
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {o.order_items?.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-mid-gray">
              {o.order_items.map((it: any) => (
                <li key={it.id}>
                  {it.quantity}× {it.product_name}
                  {it.variant_label ? ` · ${it.variant_label}` : ""}
                  {it.customization_text ? ` · "${it.customization_text}"` : ""}
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}

/* ---------------- Appointments ---------------- */
const APPT_STATUSES = ["pending", "confirmed", "cancelled", "completed"];
function Appointments() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: string) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    qc.invalidateQueries({ queryKey: ["admin", "overview"] });
  }

  if (isLoading) return <Spinner />;
  if (!data?.length) return <Card><p className="text-mid-gray">No appointments yet.</p></Card>;

  return (
    <div className="space-y-4">
      {data.map((a: any) => (
        <Card key={a.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg">{a.name}</p>
              <p className="text-sm text-mid-gray">{a.email}{a.phone ? ` · ${a.phone}` : ""}</p>
              <p className="mt-1 text-sm">{a.service} · {fmtDate(a.preferred_date)} {a.preferred_time ?? ""}</p>
              {a.party_size > 1 && <p className="text-xs text-mid-gray">Party of {a.party_size}</p>}
              {a.message && <p className="mt-1 text-sm text-mid-gray">{a.message}</p>}
              {a.deposit_paid && <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Deposit paid</span>}
            </div>
            <select
              value={a.status}
              onChange={(e) => setStatus(a.id, e.target.value)}
              className="rounded-full border border-border bg-cream px-3 py-1.5 text-xs"
            >
              {APPT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- Inquiries ---------------- */
function Inquiries() {
  const { data: contacts, isLoading: l1 } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const { data: events, isLoading: l2 } = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data } = await supabase.from("event_inquiries").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (l1 || l2) return <Spinner />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 font-display text-xl">Contact Messages</h3>
        <div className="space-y-3">
          {(contacts ?? []).map((c: any) => (
            <Card key={c.id}>
              <p className="font-medium">{c.name} <span className="text-sm font-normal text-mid-gray">· {c.email}</span></p>
              {c.subject && <p className="text-sm text-charcoal/80">{c.subject}</p>}
              <p className="mt-1 text-sm text-mid-gray">{c.message}</p>
              <p className="mt-1 text-xs text-mid-gray">{fmtDate(c.created_at)}</p>
            </Card>
          ))}
          {!contacts?.length && <Card><p className="text-mid-gray">No messages.</p></Card>}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-display text-xl">Event Inquiries</h3>
        <div className="space-y-3">
          {(events ?? []).map((e: any) => (
            <Card key={e.id}>
              <p className="font-medium">{e.name} <span className="text-sm font-normal text-mid-gray">· {e.email}</span></p>
              <p className="text-sm text-charcoal/80">{e.event_type ?? "Event"} · {e.guests ?? "?"} guests · {fmtDate(e.event_date)}</p>
              {e.message && <p className="mt-1 text-sm text-mid-gray">{e.message}</p>}
              <p className="mt-1 text-xs text-mid-gray">{fmtDate(e.created_at)}</p>
            </Card>
          ))}
          {!events?.length && <Card><p className="text-mid-gray">No inquiries.</p></Card>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Subscribers ---------------- */
function Subscribers() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  if (isLoading) return <Spinner />;

  function exportCsv() {
    const rows = ["email,subscribed_at", ...(data ?? []).map((s: any) => `${s.email},${s.created_at}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glowgirl-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">{data?.length ?? 0} Subscribers</h3>
        <button onClick={exportCsv} className="btn-secondary text-sm">Export CSV</button>
      </div>
      <ul className="divide-y divide-border">
        {(data ?? []).map((s: any) => (
          <li key={s.id} className="flex justify-between py-2 text-sm">
            <span>{s.email}</span>
            <span className="text-mid-gray">{fmtDate(s.created_at)}</span>
          </li>
        ))}
      </ul>
      {!data?.length && <p className="text-mid-gray">No subscribers yet.</p>}
    </Card>
  );
}
