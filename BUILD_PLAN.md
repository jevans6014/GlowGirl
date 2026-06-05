# GLOWGIRL — Full-Stack Build Plan

> **Router note:** Project uses **React Router DOM v7** (not TanStack Router as the prompt assumed).
> Routes are declared in `src/app.tsx`. Data fetching uses **TanStack Query** (compatible with React Router).
> `/shop/:slug` replaces `$slug.tsx`; nested `<Route>` elements replace file-based nesting.

## Status Legend: [ ] todo · [~] in progress · [x] done

## Phase 10 — Dependencies & Providers
- [~] `npm i @tanstack/react-query stripe @stripe/stripe-js`
- [ ] Wrap app in `QueryClientProvider` (in `main.tsx`)
- [ ] Wrap app in `CartProvider`

## Phase 1 — Database (MANUAL: run in Supabase SQL editor)
- [ ] `supabase/migrations/0001_shop_booking.sql` — products, variants, orders, order_items, appointments
- [ ] RLS policies + grants
- [ ] Seed products
- [ ] Regenerate / hand-write `src/integrations/supabase/types.ts`

## Phase 3 — Routing constants
- [ ] `src/lib/site.ts`: add `ROUTES` + `SOCIAL`, remove external shop/book LINKS

## Phase 4 — Shop + Cart
- [ ] `src/hooks/useProducts.ts`
- [ ] `src/context/CartContext.tsx`
- [ ] `src/routes/shop/index.tsx` + category pages + `product.tsx` (:slug)
- [ ] `src/components/shop/ProductCard.tsx`, `CollectionLayout.tsx`
- [ ] `src/routes/cart.tsx`

## Phase 5 — Stripe (CODE here, DEPLOY manual)
- [ ] `supabase/functions/create-checkout-session/index.ts`
- [ ] `supabase/functions/stripe-webhook/index.ts`
- [ ] `src/hooks/useCheckout.ts`
- [ ] `src/routes/checkout.tsx`, `src/routes/order-success.tsx`

## Phase 6 — Booking
- [ ] `src/routes/book.tsx` (4-step stepper: service → date/time → details → confirm/deposit)

## Phase 2 — Email Edge Functions (CODE here, DEPLOY manual)
- [ ] send-contact-notification, send-event-notification, send-newsletter-welcome
- [ ] DB trigger SQL

## Phase 7 — Admin
- [ ] `src/routes/admin/login.tsx` + auth guard
- [ ] overview, orders, appointments, inquiries, subscribers

## Phase 8 — Cleanup
- [ ] Link audit (glowgirl.us / square → internal)
- [ ] Update sections.tsx + Nav, add cart widget
- [ ] Gift cards page

## Phase 9 — Security audit checklist

---

## MANUAL STEPS FOR OWNER (cannot be automated)
1. Run SQL migration in Supabase dashboard
2. Create Stripe account → get `pk_` + `sk_` keys
3. Create Resend account → get `re_` key, verify `glowgirl.us` domain
4. Set Edge Function secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `OWNER_EMAIL`, `SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
5. `supabase functions deploy` each function
6. Register Stripe webhook endpoint → copy `whsec_` into secrets
7. Add DB triggers in dashboard
8. Create owner auth user (contact@glowgirl.us) in Supabase Auth
