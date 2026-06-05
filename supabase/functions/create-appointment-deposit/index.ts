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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Deposit amounts (in cents) by service.
const DEPOSITS: Record<string, number> = {
  "permanent-jewelry-event": 5000, // $50 studio event
  "mobile-event": 10000, // $100 mobile event
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { appointmentId, service, customerEmail } = await req.json();
    if (!appointmentId || !customerEmail) throw new Error("Missing appointment details");

    const amount = DEPOSITS[service] ?? 5000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "GLOWGIRL Event Deposit" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get("SITE_URL")}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get("SITE_URL")}/book`,
      metadata: { type: "appointment_deposit", appointment_id: appointmentId },
    });

    await supabase
      .from("appointments")
      .update({ stripe_session_id: session.id })
      .eq("id", appointmentId);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
