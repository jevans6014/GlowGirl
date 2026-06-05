import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Sparkles } from "@/components/Sparkles";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { ROUTES } from "@/lib/site";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "paid" | "pending">("loading");
  const [orderNo, setOrderNo] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    if (!sessionId) {
      setStatus("pending");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setOrderNo(data.id.slice(-8).toUpperCase());
        setStatus(data.status === "paid" ? "paid" : "pending");
      } else {
        setStatus("pending");
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <section className="relative hero-gradient overflow-hidden py-24 sm:py-32">
      <Sparkles count={20} />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        {status === "loading" ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-deep" />
        ) : (
          <>
            <span className="animate-bounce-check mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-pink-blush">
              <Check className="h-9 w-9 text-charcoal" />
            </span>
            <h1 className="mt-6 font-display text-5xl text-balance sm:text-6xl">Thank you ✨</h1>
            {orderNo && (
              <p className="mt-3 text-lg text-charcoal">
                Order <span className="font-medium">#{orderNo}</span>
              </p>
            )}
            <p className="mx-auto mt-4 max-w-md text-mid-gray">
              {status === "paid"
                ? "Your payment was received and a confirmation email is on its way. For personalized items, allow 5–7 business days."
                : "We're confirming your payment. You'll receive an email confirmation shortly."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={ROUTES.shopAll} className="btn-primary">Continue Shopping</Link>
              <Link to={ROUTES.book} className="btn-secondary">Book Permanent Jewelry</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
