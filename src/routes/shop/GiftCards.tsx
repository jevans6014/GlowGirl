import { useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/site";

const AMOUNTS = [25, 50, 100, 150, 200];

const schema = z.object({
  amount: z.number().min(10).max(1000),
  recipient: z.string().trim().min(1, "Recipient name required").max(120),
  message: z.string().trim().max(300).optional().or(z.literal("")),
});

// A gift card is treated as a product line item. The owner should add a
// 'gift-card' product row in Supabase; we add it to the cart for checkout.
const GIFT_CARD_PRODUCT_ID = "gift-card"; // TODO: replace with real product UUID from DB

export default function GiftCards() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function addToCart() {
    const finalAmount = custom ? Number(custom) : amount;
    const parsed = schema.safeParse({ amount: finalAmount, recipient, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    addItem({
      productId: GIFT_CARD_PRODUCT_ID,
      name: `Gift Card — $${finalAmount}`,
      slug: "gift-cards",
      unitPrice: finalAmount,
      quantity: 1,
      customizationText: `To ${recipient}${message ? `: ${message}` : ""}`,
      gradient: "from-gold via-gold-light to-pink-blush",
    });
    toast.success("Gift card added to cart ✨");
    setLoading(false);
    navigate(ROUTES.cart);
  }

  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-pale">
            <Gift className="h-6 w-6 text-gold" />
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Gift Cards</h1>
          <p className="mt-3 text-mid-gray">Give the gift of glow. Delivered by email to your recipient.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="text-sm font-medium text-charcoal/80">Choose an amount</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustom(""); }}
                className={`rounded-full border px-5 py-2.5 transition ${amount === a && !custom ? "border-pink-deep bg-pink-pale" : "border-border hover:border-pink-blush"}`}
              >
                ${a}
              </button>
            ))}
            <input
              type="number"
              min={10}
              max={1000}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Custom"
              className="w-28 rounded-full border border-border bg-white px-4 py-2.5 outline-none focus:border-pink-deep"
            />
          </div>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm text-charcoal/80">Recipient name</span>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 outline-none focus:border-pink-deep" placeholder="Who's it for?" />
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm text-charcoal/80">Message (optional)</span>
            <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 outline-none focus:border-pink-deep" placeholder="Add a sweet note…" />
          </label>

          <button onClick={addToCart} disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Gift Card to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
}
