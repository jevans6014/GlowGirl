import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  event_type: z.string().trim().max(80).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(50).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type Errs = Partial<Record<keyof z.infer<typeof schema>, string>>;

const initial = { name: "", email: "", phone: "", event_type: "Bachelorette", event_date: "", guests: "" as string | number, message: "" };

export function EventInquiryForm() {
  const [data, setData] = useState(initial);
  const [errs, setErrs] = useState<Errs>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function field<K extends keyof typeof data>(k: K, v: string) {
    setData((d) => ({ ...d, [k]: v }));
    setErrs((e) => ({ ...e, [k]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fe: Errs = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as keyof Errs] = i.message));
      setErrs(fe);
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any).from("event_inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      event_type: parsed.data.event_type || null,
      event_date: parsed.data.event_date || null,
      guests: parsed.data.guests ?? null,
      message: parsed.data.message || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send inquiry — please try again.");
      return;
    }
    setDone(true);
    toast.success("Inquiry sent — we'll be in touch ✨");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-cream rounded-3xl p-10"
          >
            <span className="animate-bounce-check inline-flex w-14 h-14 rounded-full bg-pink-blush items-center justify-center mb-4">
              <Check className="w-6 h-6 text-charcoal" />
            </span>
            <h3 className="font-display text-3xl">Inquiry received</h3>
            <p className="text-mid-gray mt-2">We'll respond within one business day with availability + pricing.</p>
          </motion.div>
        ) : (
          <motion.form key="f" onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <F label="Name" e={errs.name}>
                <input value={data.name} onChange={(e) => field("name", e.target.value)} className={cls(!!errs.name)} />
              </F>
              <F label="Email" e={errs.email}>
                <input type="email" value={data.email} onChange={(e) => field("email", e.target.value)} className={cls(!!errs.email)} />
              </F>
              <F label="Phone" e={errs.phone}>
                <input value={data.phone} onChange={(e) => field("phone", e.target.value)} className={cls(!!errs.phone)} />
              </F>
              <F label="Event Type" e={errs.event_type}>
                <select value={data.event_type} onChange={(e) => field("event_type", e.target.value)} className={cls(!!errs.event_type)}>
                  <option>Bachelorette</option>
                  <option>Birthday</option>
                  <option>Bridal Shower</option>
                  <option>Brand / Corporate</option>
                  <option>Girls' Night</option>
                  <option>Other</option>
                </select>
              </F>
              <F label="Event Date" e={errs.event_date}>
                <input type="date" value={data.event_date} onChange={(e) => field("event_date", e.target.value)} className={cls(!!errs.event_date)} />
              </F>
              <F label="Guests (up to 14)" e={errs.guests}>
                <input type="number" min={1} max={50} value={data.guests} onChange={(e) => field("guests", e.target.value)} className={cls(!!errs.guests)} />
              </F>
            </div>
            <F label="Tell us about your event" e={errs.message}>
              <textarea rows={4} value={data.message} onChange={(e) => field("message", e.target.value)} className={cls(!!errs.message)} />
            </F>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Inquiry"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function cls(err: boolean) {
  return `w-full rounded-2xl bg-white border px-5 py-3.5 outline-none transition ${
    err ? "border-destructive" : "border-border focus:border-pink-deep"
  }`;
}
function F({ label, e, children }: { label: string; e?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-charcoal/80 mb-1.5">{label}</span>
      {children}
      {e && <span className="block text-xs text-destructive mt-1">{e}</span>}
    </label>
  );
}
