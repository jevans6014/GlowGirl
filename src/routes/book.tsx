import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Sparkles as SparklesIcon, MapPin, Check, Loader2, ChevronLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

type ServiceKey = "permanent-jewelry" | "permanent-jewelry-event" | "mobile-event";

const SERVICES: {
  key: ServiceKey;
  dbService: string;
  title: string;
  desc: string;
  icon: typeof LinkIcon;
  deposit: number;
}[] = [
  { key: "permanent-jewelry", dbService: "permanent-jewelry", title: "Solo Appointment", desc: "Pick your chain, add a charm, get welded in 20–40 min. Walk-ins also welcome.", icon: LinkIcon, deposit: 0 },
  { key: "permanent-jewelry-event", dbService: "permanent-jewelry-event", title: "Private Event (Studio)", desc: "Bring your crew. Up to 14 guests. We set the vibe. $50 deposit.", icon: SparklesIcon, deposit: 50 },
  { key: "mobile-event", dbService: "permanent-jewelry-event", title: "Mobile Event", desc: "We come to you anywhere in Charlotte. Perfect for bachelorettes. $100 deposit.", icon: MapPin, deposit: 100 },
];

const TIMES = ["11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM"];

// Next 28 days, Thursday–Sunday only (4,5,6,0)
function availableDates() {
  const out: Date[] = [];
  const d = new Date();
  for (let i = 0; i < 35 && out.length < 16; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    const dow = day.getDay();
    if ([0, 4, 5, 6].includes(dow)) out.push(day);
  }
  return out;
}

const detailsSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Phone required").max(40),
});

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceKey | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", partySize: 2, chain: "", eventType: "Bachelorette", message: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selected = SERVICES.find((s) => s.key === service);
  const isEvent = service === "permanent-jewelry-event" || service === "mobile-event";

  function next() { setStep((s) => Math.min(4, s + 1)); }
  function back() { setStep((s) => Math.max(1, s - 1)); }

  async function submit() {
    const parsed = detailsSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrs(fe);
      setStep(3);
      return;
    }
    setLoading(true);
    const { data: appt, error } = await supabase
      .from("appointments")
      .insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: selected!.dbService,
        preferred_date: date,
        preferred_time: time,
        party_size: isEvent ? form.partySize : 1,
        chain_preference: form.chain || null,
        message: isEvent ? `${form.eventType}${form.message ? " — " + form.message : ""}` : form.message || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      toast.error("Couldn't save your booking — please try again.");
      return;
    }

    // Events require a deposit via Stripe.
    if (isEvent && selected!.deposit > 0) {
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("create-appointment-deposit", {
          body: { appointmentId: appt!.id, service, customerEmail: form.email },
        });
        if (fnErr || !data?.url) throw fnErr || new Error("No URL");
        window.location.href = data.url;
        return;
      } catch (e) {
        setLoading(false);
        toast.message("Booking saved! Deposit payment isn't live yet — we'll follow up to collect it.");
        setDone(true);
        return;
      }
    }

    setLoading(false);
    setDone(true);
    toast.success("Appointment requested ✨");
  }

  if (done) {
    return (
      <section className="hero-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-xl px-6 text-center">
          <span className="animate-bounce-check mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-blush">
            <Check className="h-7 w-7 text-charcoal" />
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl">Booking requested ✨</h1>
          <p className="mt-3 text-mid-gray">
            We'll confirm your {selected?.title.toLowerCase()} for {date} at {time} within one business day.
          </p>
          <Link to="/" className="btn-primary mt-6 inline-block">Back Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Book Your Glow</span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Reserve your appointment</h1>
        </div>

        {/* Stepper */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-between">
          {["Service", "Date & Time", "Details", "Confirm"].map((label, i) => {
            const n = i + 1;
            return (
              <div key={label} className="flex flex-1 flex-col items-center">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${step >= n ? "bg-pink-blush text-charcoal" : "bg-white text-mid-gray"}`}>{n}</span>
                <span className="mt-1 text-[11px] text-mid-gray">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="font-display text-2xl">Choose your experience</h2>
                <div className="mt-5 grid gap-4">
                  {SERVICES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => { setService(s.key); next(); }}
                      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition hover:border-pink-blush ${service === s.key ? "border-pink-deep bg-pink-pale/40" : "border-border"}`}
                    >
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-pale">
                        <s.icon className="h-5 w-5 text-gold" />
                      </span>
                      <span>
                        <span className="block font-display text-xl">{s.title}</span>
                        <span className="mt-1 block text-sm text-mid-gray">{s.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-center text-sm text-mid-gray">
                  Walk-ins always welcome Thu–Sun, 11am–7pm. No appointment needed for solo welds.
                </p>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="font-display text-2xl">Pick a date & time</h2>
                <p className="mt-1 text-sm text-mid-gray">We're open Thursday–Sunday.</p>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {availableDates().map((d) => {
                    const iso = d.toISOString().slice(0, 10);
                    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                    return (
                      <button
                        key={iso}
                        onClick={() => setDate(iso)}
                        className={`rounded-xl border px-2 py-3 text-sm transition ${date === iso ? "border-pink-deep bg-pink-pale text-charcoal" : "border-border hover:border-pink-blush"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {date && (
                  <>
                    <h3 className="mt-6 font-display text-lg">Available times</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TIMES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${time === t ? "border-pink-deep bg-pink-pale" : "border-border hover:border-pink-blush"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <div className="mt-8 flex justify-between">
                  <button onClick={back} className="flex items-center gap-1 text-sm text-mid-gray"><ChevronLeft className="h-4 w-4" /> Back</button>
                  <button onClick={next} disabled={!date || !time} className="btn-primary disabled:opacity-50">Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="font-display text-2xl">Your details</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errs.name}>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp(!!errs.name)} />
                  </Field>
                  <Field label="Email" error={errs.email}>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp(!!errs.email)} />
                  </Field>
                  <Field label="Phone" error={errs.phone}>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp(!!errs.phone)} />
                  </Field>
                  {isEvent ? (
                    <>
                      <Field label="Party size (2–14)">
                        <input type="number" min={2} max={14} value={form.partySize} onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })} className={inp(false)} />
                      </Field>
                      <Field label="Event type">
                        <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className={inp(false)}>
                          <option>Bachelorette</option><option>Birthday</option><option>Bridal Shower</option><option>Brand / Corporate</option><option>Other</option>
                        </select>
                      </Field>
                    </>
                  ) : (
                    <Field label="Chain preference (optional)">
                      <input value={form.chain} onChange={(e) => setForm({ ...form, chain: e.target.value })} className={inp(false)} placeholder="e.g. gold, dainty" />
                    </Field>
                  )}
                </div>
                <Field label="Special requests / message">
                  <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inp(false)} />
                </Field>
                <div className="mt-6 flex justify-between">
                  <button onClick={back} className="flex items-center gap-1 text-sm text-mid-gray"><ChevronLeft className="h-4 w-4" /> Back</button>
                  <button onClick={next} className="btn-primary">Review</button>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="font-display text-2xl">Confirm your booking</h2>
                <dl className="mt-5 space-y-2 rounded-2xl bg-cream p-5 text-sm">
                  <Row k="Service" v={selected?.title ?? ""} />
                  <Row k="Date" v={date ?? ""} />
                  <Row k="Time" v={time ?? ""} />
                  <Row k="Name" v={form.name} />
                  <Row k="Email" v={form.email} />
                  <Row k="Phone" v={form.phone} />
                  {isEvent && <Row k="Party size" v={String(form.partySize)} />}
                  {isEvent && <Row k="Event type" v={form.eventType} />}
                  {selected && selected.deposit > 0 && <Row k="Deposit due" v={`$${selected.deposit}.00`} />}
                </dl>
                {selected && selected.deposit > 0 && (
                  <p className="mt-3 text-sm text-mid-gray">A ${selected.deposit} deposit secures your event date and is applied to your final total.</p>
                )}
                <div className="mt-6 flex justify-between">
                  <button onClick={back} className="flex items-center gap-1 text-sm text-mid-gray"><ChevronLeft className="h-4 w-4" /> Back</button>
                  <button onClick={submit} disabled={loading} className="btn-primary disabled:opacity-70">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : selected && selected.deposit > 0 ? `Pay $${selected.deposit} Deposit` : "Confirm Booking"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-xs text-mid-gray">
          {SITE.address} · {SITE.phone} · 24-hour cancellation notice appreciated.
        </p>
      </div>
    </section>
  );
}

function inp(err: boolean) {
  return `w-full rounded-2xl border bg-white px-4 py-3 outline-none ${err ? "border-destructive" : "border-border focus:border-pink-deep"}`;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="mb-1.5 block text-sm text-charcoal/80">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-mid-gray">{k}</dt>
      <dd className="text-right font-medium text-charcoal">{v}</dd>
    </div>
  );
}
