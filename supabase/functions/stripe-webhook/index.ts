// @ts-nocheck — Deno Edge Function (runs on Supabase, not in the Vite app)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL")!;

async function sendEmail(to: string, subject: string, html: string, from: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const isDeposit = session.metadata?.type === "appointment_deposit";

    if (isDeposit) {
      // Booking deposit paid — confirm the appointment.
      await supabase
        .from("appointments")
        .update({ deposit_paid: true, status: "confirmed" })
        .eq("stripe_session_id", session.id);
    } else {
      // Product order paid.
      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          shipping_address: session.shipping_details ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id);

      const orderNo = orderId?.slice(-8).toUpperCase();
      const amount = (session.amount_total! / 100).toFixed(2);

      await sendEmail(
        session.customer_details?.email!,
        `Order Confirmed — GLOWGIRL ✨ #${orderNo}`,
        `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdf6f0;">
          <h1 style="font-size: 32px; color: #2a2a2a; letter-spacing: 0.2em; margin-bottom: 4px;">GLOWGIRL</h1>
          <p style="color: #c9a970; font-style: italic; margin-top: 0;">Order Confirmed</p>
          <h2 style="color: #2a2a2a;">Thank you, ${session.customer_details?.name}! ✨</h2>
          <p style="color: #6b6b6b;">Your order has been confirmed and we're getting it ready for you.</p>
          <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0; color: #2a2a2a;"><strong>Order #:</strong> ${orderNo}</p>
            <p style="margin: 8px 0 0; color: #2a2a2a;"><strong>Total:</strong> $${amount}</p>
          </div>
          <p style="color: #6b6b6b;">For personalized items, please allow 5–7 business days for production.</p>
          <p style="color: #6b6b6b;">Questions? Reply to this email or call <a href="tel:+17046129113" style="color: #c9a970;">(704) 612-9113</a>.</p>
          <p style="color: #fac7d7; font-size: 20px; font-style: italic;">Keep glowing ✨</p>
        </div>`,
        "GLOWGIRL <contact@glowgirl.us>",
      );

      await sendEmail(
        OWNER_EMAIL,
        `💰 New Order — $${amount} from ${session.customer_details?.name}`,
        `<h2>New Order Received!</h2>
          <p><strong>Customer:</strong> ${session.customer_details?.name}</p>
          <p><strong>Email:</strong> ${session.customer_details?.email}</p>
          <p><strong>Total:</strong> $${amount}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><a href="https://dashboard.stripe.com/payments/${session.payment_intent}">View in Stripe Dashboard</a></p>`,
        "GLOWGIRL Website <noreply@glowgirl.us>",
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
