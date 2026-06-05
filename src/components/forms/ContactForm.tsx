import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Tell us a bit more").max(2000),
});

type Errs = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function ContactForm() {
  const [data, setData] = useState({ name: "", email: "", subject: "", message: "" });
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
      const fieldErrs: Errs = {};
      parsed.error.issues.forEach((i) => (fieldErrs[i.path[0] as keyof Errs] = i.message));
      setErrs(fieldErrs);
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any).from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send — please try again.");
      return;
    }
    setDone(true);
    toast.success("Message sent — we'll be in touch ✨");
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-cream rounded-3xl p-10"
          >
            <span className="animate-bounce-check inline-flex w-14 h-14 rounded-full bg-pink-blush items-center justify-center mb-4">
              <Check className="w-6 h-6 text-charcoal" />
            </span>
            <h3 className="font-display text-3xl">Message received</h3>
            <p className="text-mid-gray mt-2">We'll get back to you within one business day. ✨</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="space-y-4">
            <Field label="Name" error={errs.name}>
              <input
                value={data.name}
                onChange={(e) => field("name", e.target.value)}
                className={inputCls(!!errs.name)}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errs.email}>
              <input
                type="email"
                value={data.email}
                onChange={(e) => field("email", e.target.value)}
                className={inputCls(!!errs.email)}
                placeholder="your@email.com"
              />
            </Field>
            <Field label="Subject (optional)" error={errs.subject}>
              <input
                value={data.subject}
                onChange={(e) => field("subject", e.target.value)}
                className={inputCls(!!errs.subject)}
                placeholder="What's this about?"
              />
            </Field>
            <Field label="Message" error={errs.message}>
              <textarea
                rows={5}
                value={data.message}
                onChange={(e) => field("message", e.target.value)}
                className={inputCls(!!errs.message)}
                placeholder="Tell us what's on your mind…"
              />
            </Field>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(err: boolean) {
  return `w-full rounded-2xl bg-white border px-5 py-3.5 outline-none transition ${
    err ? "border-destructive" : "border-border focus:border-pink-deep"
  }`;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-charcoal/80 mb-1.5 font-body">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive mt-1">{error}</span>}
    </label>
  );
}
