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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { items, customerEmail, customerName } = await req.json();

    if (!items?.length || !customerEmail || !customerName) {
      throw new Error("Missing items or customer details");
    }

    // Validate prices server-side — NEVER trust the client.
    const productIds = items.map((i: any) => i.productId);
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name, base_price")
      .in("id", productIds);
    if (prodErr) throw prodErr;

    // Also validate variant modifiers from the DB.
    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, label, price_modifier, product_id");

    const lineItems = items.map((item: any) => {
      const product = products?.find((p: any) => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      let modifier = 0;
      if (item.variantLabel) {
        const v = variants?.find(
          (vv: any) => vv.product_id === product.id && vv.label === item.variantLabel,
        );
        modifier = v ? Number(v.price_modifier) : 0;
      }
      const unitAmount = Math.round((Number(product.base_price) + modifier) * 100);
      const descParts = [item.variantLabel, item.customizationText && `"${item.customizationText}"`]
        .filter(Boolean)
        .join(" · ");
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: descParts || undefined,
            metadata: {
              product_id: product.id,
              variant: item.variantLabel || "",
              customization: item.customizationText || "",
            },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const total = lineItems.reduce(
      (s: number, li: any) => s + (li.price_data.unit_amount * li.quantity) / 100,
      0,
    );

    // Create a pending order BEFORE the Stripe session.
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_email: customerEmail,
        customer_name: customerName,
        status: "pending",
        subtotal: total,
        total,
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    // Persist order items.
    await supabase.from("order_items").insert(
      items.map((item: any) => {
        const product = products?.find((p: any) => p.id === item.productId);
        let modifier = 0;
        if (item.variantLabel) {
          const v = variants?.find(
            (vv: any) => vv.product_id === item.productId && vv.label === item.variantLabel,
          );
          modifier = v ? Number(v.price_modifier) : 0;
        }
        return {
          order_id: order.id,
          product_id: item.productId,
          product_name: product?.name ?? "Item",
          variant_label: item.variantLabel ?? null,
          quantity: item.quantity,
          unit_price: Number(product?.base_price ?? 0) + modifier,
          customization_text: item.customizationText ?? null,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${Deno.env.get("SITE_URL")}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get("SITE_URL")}/cart`,
      metadata: { order_id: order.id },
      shipping_address_collection: { allowed_countries: ["US"] },
      billing_address_collection: "required",
      allow_promotion_codes: true,
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url, orderId: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
