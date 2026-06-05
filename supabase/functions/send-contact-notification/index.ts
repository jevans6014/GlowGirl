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
    // Supports both direct invoke ({ record }) and DB webhook ({ record })
    const body = await req.json();
    const r = body.record ?? body;
    const { name, email, subject, message } = r;

    // Notify the owner
    await sendEmail(
      OWNER_EMAIL,
      `💌 New Contact Message from ${name}`,
      `<h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${(message ?? "").replace(/\n/g, "<br>")}</p>`,
      "GLOWGIRL Website <noreply@glowgirl.us>",
      email,
    );

    // Auto-reply to the customer
    await sendEmail(
      email,
      "We got your message ✨ — GLOWGIRL",
      `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdf6f0;">
        <h1 style="letter-spacing: 0.2em; color: #2a2a2a;">GLOWGIRL</h1>
        <h2 style="color: #2a2a2a;">Thanks for reaching out, ${name}! 💕</h2>
        <p style="color: #6b6b6b;">We received your message and will get back to you within one business day.</p>
        <p style="color: #6b6b6b;">In the meantime, come glow with us Thursday–Sunday, 11am–7pm at 222 West Blvd, Charlotte.</p>
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
