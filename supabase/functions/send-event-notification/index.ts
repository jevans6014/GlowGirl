// @ts-nocheck — Deno Edge Function (runs on Supabase, not in the Vite app)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string, from: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, reply_to: replyTo }),
  });
  if (!res.ok) console.error("Resend error:", await res.text());
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const r = body.record ?? body;
    const { name, email, phone, event_type, event_date, guests, message } = r;

    await sendEmail(
      OWNER_EMAIL,
      `🎉 New Event Inquiry — ${event_type ?? "Event"} (${guests ?? "?"} guests)`,
      `<h2>New Private Event Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone ?? "—"}</p>
        <p><strong>Event type:</strong> ${event_type ?? "—"}</p>
        <p><strong>Date:</strong> ${event_date ?? "—"}</p>
        <p><strong>Guests:</strong> ${guests ?? "—"}</p>
        ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>` : ""}`,
      "GLOWGIRL Website <noreply@glowgirl.us>",
      email,
    );

    await sendEmail(
      email,
      "Your GLOWGIRL Event Inquiry ✨",
      `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdf6f0;">
        <h1 style="letter-spacing: 0.2em; color: #2a2a2a;">GLOWGIRL</h1>
        <h2 style="color: #2a2a2a;">Thank you, ${name}! 🎉</h2>
        <p style="color: #6b6b6b;">We're so excited to help you plan your ${event_type ?? "event"}. Our events coordinator will reach out within one business day to lock in details and your date${event_date ? ` (${event_date})` : ""}.</p>
        <p style="color: #6b6b6b;">Private events host up to 14 guests in-studio, or we can come to you anywhere in Charlotte.</p>
        <p style="color: #fac7d7; font-size: 20px; font-style: italic;">Keep glowing ✨</p>
      </div>`,
      "GLOWGIRL <contact@glowgirl.us>",
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
