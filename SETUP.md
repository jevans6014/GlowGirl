# GLOWGIRL — Owner Setup Guide

The website code is complete. To turn on the shop, checkout, booking deposits, and
email notifications, complete these one-time setup steps. None of these can be
automated — they require your own accounts and secret keys.

## 1. Database (required for shop + bookings)
1. Open the **Supabase Dashboard → SQL Editor**.
2. Paste and run `supabase/migrations/0001_shop_booking.sql`.
   - Creates `products`, `product_variants`, `orders`, `order_items`, `appointments` + RLS + seed products.
3. **Run `scraper/populate_db.sql`** to replace sample products with real scraped product data and images.
4. (After step 5 below) run `supabase/migrations/0002_email_triggers.sql`, replacing
   `<PROJECT_REF>` and `<ANON_KEY>` first.

## 2. Stripe (required for payments)
1. Create a Stripe account → **Developers → API keys**.
2. Copy the **Publishable key** into `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```
3. Keep the **Secret key** for step 4 (never put it in `.env`).

## 3. Resend (required for emails)
1. Create a Resend account, verify the `glowgirl.us` domain.
2. Get an API key (`re_xxx`).

## 4. Edge Function secrets
Run (replace values):
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx   # from step 6
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set OWNER_EMAIL=contact@glowgirl.us
supabase secrets set SITE_URL=https://glowgirl.com
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxx      # Settings → API
```

## 5. Deploy the Edge Functions
```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-appointment-deposit
supabase functions deploy stripe-webhook
supabase functions deploy send-contact-notification
supabase functions deploy send-event-notification
supabase functions deploy send-newsletter-welcome
```
(`supabase/config.toml` already disables JWT verification on the webhook + email functions.)

## 6. Stripe webhook
1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`
3. Listen for event: `checkout.session.completed`
4. Copy the signing secret (`whsec_...`) → set it via `supabase secrets set STRIPE_WEBHOOK_SECRET=...` and re-deploy the webhook function.

## 7. Owner login (admin dashboard)
1. Supabase Dashboard → **Authentication → Users → Add user**.
2. Create a user with your email + password.
3. Visit `/admin` and sign in.

## 8. Gift cards (optional)
The gift-card flow expects a product row. Insert one and update
`GIFT_CARD_PRODUCT_ID` in `src/routes/shop/GiftCards.tsx` with its UUID
(or wire it to a Stripe price). Until then, gift cards still add to cart but
checkout validates against real product IDs.

---

## What's already done in code
- Shop (`/shop`, category pages, product detail `/shop/:slug`)
- Cart (`/cart`) with sessionStorage persistence
- Checkout (`/checkout`) → Stripe hosted checkout → `/order-success`
- Booking (`/book`) 4-step flow with event deposits
- Admin dashboard (`/admin`): overview, orders, appointments, inquiries, subscribers
- All internal links (shop/book/ebook) now point in-site (no more glowgirl.us / Square)
- **26 product images scraped from glowgirl.us** and saved to `public/images/` (glowgirl_001.png through glowgirl_050.png)
- Real product data extracted and ready to populate via `scraper/populate_db.sql`

## Security notes
- The browser only ever sees the **publishable** Stripe key and the **anon** Supabase key.
- All prices are re-validated **server-side** in `create-checkout-session` — the client cannot set its own prices.
- Orders are created server-side; the client cannot mark an order `paid` (only the Stripe webhook, using the service role, can).
- RLS: public can read products and create orders/appointments; only authenticated owners can read orders/appointments.
