import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { initiateCheckout } from "@/hooks/useCheckout";
import { ROUTES } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
});

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ name?: string; email?: string }>({});

  if (items.length === 0) {
    return (
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h1 className="font-display text-4xl">Nothing to check out</h1>
          <Link to={ROUTES.shopAll} className="btn-primary mt-6 inline-block">Shop the Collections</Link>
        </div>
      </section>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email });
    if (!parsed.success) {
      const fe: { name?: string; email?: string } = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as "name" | "email"] = i.message));
      setErr(fe);
      return;
    }
    setLoading(true);
    try {
      await initiateCheckout(items, parsed.data.email, parsed.data.name);
      // Redirects to Stripe on success.
    } catch (e) {
      setLoading(false);
      toast.error(
        "Checkout isn't available yet. The Stripe Edge Function must be deployed and keys set.",
      );
      console.error(e);
    }
  }

  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <form onSubmit={submit} className="rounded-3xl bg-white p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-2xl">Contact Info</h2>
            <p className="mt-1 text-sm text-mid-gray">
              We'll email your receipt here. Payment & shipping details are collected securely on the next step.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-charcoal/80">Full name</span>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr((s) => ({ ...s, name: undefined })); }}
                  className={`w-full rounded-2xl border bg-white px-5 py-3.5 outline-none ${err.name ? "border-destructive" : "border-border focus:border-pink-deep"}`}
                  placeholder="Your name"
                />
                {err.name && <span className="mt-1 block text-xs text-destructive">{err.name}</span>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-charcoal/80">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr((s) => ({ ...s, email: undefined })); }}
                  className={`w-full rounded-2xl border bg-white px-5 py-3.5 outline-none ${err.email ? "border-destructive" : "border-border focus:border-pink-deep"}`}
                  placeholder="your@email.com"
                />
                {err.email && <span className="mt-1 block text-xs text-destructive">{err.email}</span>}
              </label>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Lock className="mr-2 h-4 w-4" /> Pay with Stripe</>)}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mid-gray">
              <Lock className="h-3 w-3" /> Secure payment powered by Stripe
            </p>
          </form>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-2xl">Your Order</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.slug + (item.variantLabel ?? "") + (item.customizationText ?? "")} className="flex justify-between gap-3 text-sm">
                  <span className="text-mid-gray">
                    {item.quantity}× {item.name}
                    {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                  </span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-xl">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
