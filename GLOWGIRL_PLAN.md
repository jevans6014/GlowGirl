# GLOWGIRL — Build Plan
Luxury lifestyle marketing site for Charlotte's girliest permanent jewelry studio + café.
This is a **marketing/showcase** site — all purchases route to glowgirl.us (Shopify) and keepglowinggirl.square.site (Square).
## Stack
- **Framework:** TanStack Start (React 19 + Vite + TS) — file-based routes in `src/routes/`
- **Styling:** Tailwind v4 via `src/styles.css` with `@theme` tokens (oklch)
- **Animations:** Framer Motion (scroll reveals, hero entrance, hover)
- **Backend:** Lovable Cloud (Supabase) — newsletter, contact, event inquiries
- **Fonts:** Cormorant Garamond (display) + DM Sans (body) via Google Fonts
- **Icons:** lucide-react
> Note: The template uses TanStack Start (Vite under the hood), not plain Vite + React Router. Behavior and conventions are equivalent; route files live in `src/routes/`.
## Design tokens (CSS vars on :root)
- `--pink-blush #fac7d7` (primary), `--pink-deep #e8a0b4`, `--pink-pale #fde8ef`
- `--cream #fdf6f0`, `--gold #c9a970`, `--gold-light #f0ddb8`
- `--charcoal #2a2a2a`, `--mid-gray #6b6b6b`, `--white #ffffff`
- Headings: Cormorant Garamond 300/400, wide tracking
- Buttons: pink fill (primary), gold outline (secondary), rounded-full
## Routes
- `/` Home (12 sections)
- `/permanent-jewelry`
- `/cafe`
- `/collections`
- `/jewelry-made-boss`
- `/about`
- `/events`
- `/contact`
## Home sections
1. Sticky nav + announcement bar
2. Hero (gradient + shimmer particles, 2 CTAs, trust row)
3. Marquee strip (pink)
4. Experience 3-card (Jewelry / Café / Events)
5. Collections grid (4 cards, external Shopify links)
6. Permanent Jewelry explainer (alternating split)
7. Reviews (4.9 / 3 testimonials)
8. Studio info + Google Maps embed
9. Jewelry Made Boss (dark contrast section)
10. Instagram teaser (6 tile grid)
11. Newsletter signup (Supabase)
12. Footer (4 cols + socials)
## Supabase tables
- `newsletter_subscribers (id, email unique, created_at)`
- `contact_messages (id, name, email, subject, message, created_at)`
- `event_inquiries (id, name, email, phone, event_type, event_date, guests, message, created_at)`
All tables: RLS on, public INSERT only (forms are public submissions).
## Build order
1. Cloud + Supabase tables + client
2. Design system in `src/styles.css` + fonts
3. Shared layout: Nav, Footer, AnnouncementBar
4. Home (all 12 sections)
5. Inner pages
6. Forms wired to Supabase with validation + loading + success states
7. Framer Motion polish + shimmer + mobile audit
8. SEO `head()` per route