import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setLoading(true);
    const { error: dbError } = await (supabase as any)
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email });
    setLoading(false);
    if (dbError && !/duplicate|unique/i.test(dbError.message)) {
      toast.error("Couldn't save your email — please try again.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're glowing with us now! 🎀");
  }

  const inputCls =
    variant === "dark"
      ? "bg-white text-charcoal placeholder:text-mid-gray"
      : "bg-white text-charcoal placeholder:text-mid-gray border-charcoal/15";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 bg-white text-charcoal rounded-full py-4 px-6 font-body"
          >
            <span className="animate-bounce-check inline-flex w-8 h-8 rounded-full bg-pink-blush items-center justify-center">
              <Check className="w-4 h-4" />
            </span>
            You're glowing with us now! 🎀
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="your@email.com"
              aria-label="Email address"
              className={`flex-1 rounded-full px-6 py-4 outline-none border ${
                error ? "border-destructive" : "border-transparent"
              } ${inputCls}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
              style={{ backgroundColor: variant === "dark" ? "#fff" : undefined }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join the Glow"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-2 text-sm text-destructive text-center">{error}</p>}
    </form>
  );
}
