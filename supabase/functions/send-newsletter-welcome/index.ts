// @ts-nocheck — Deno Edge Function (runs on Supabase, not in the Vite app)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string, from: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) console.error("Resend error:", await res.text());
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const r = body.record ?? body;
    const { email } = r;

    await sendEmail(
      email,
      "Welcome to the glow ✨ — GLOWGIRL",
      `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdf6f0;">
        <h1 style="letter-spacing: 0.2em; color: #2a2a2a;">GLOWGIRL</h1>
        <h2 style="color: #2a2a2a;">You're on the list! 💕</h2>
        <p style="color: #6b6b6b;">Welcome to the Glowgirl family. You'll be first to know about new drops, events, and exclusive offers.</p>
        <p style="color: #6b6b6b;">Come glow with us Thursday–Sunday, 11am–7pm at 222 West Blvd, Charlotte.</p>
        <a href="https://glowgirl.com/shop" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#fac7d7;color:#2a2a2a;border-radius:999px;text-decoration:none;">Shop the Collections</a>
        <p style="color: #fac7d7; font-size: 20px; font-style: italic; margin-top: 24px;">Keep glowing ✨</p>
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
