SUPABASE_PUBLISHABLE_KEY="sb_publishable__edSjQ5X7vpMmE_XyMO2hw_ueVATNKn"
SUPABASE_URL="https://cvwprzwrfzpbykseqhnb.supabase.co"
VITE_SUPABASE_PROJECT_ID="cvwprzwrfzpbykseqhnb"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable__edSjQ5X7vpMmE_XyMO2hw_ueVATNKn"
VITE_SUPABASE_URL="https://cvwprzwrfzpbykseqhnb.supabase.co"

Created
GLOWGIRL_PLAN.md
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

Created
AnnouncementBar.tsx
export function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-cream text-[12px] sm:text-xs tracking-wide py-2 px-4 text-center font-body">
      <span className="opacity-90">
        ✨ Walk-ins welcome · Open Thu–Sun 11am–7pm · 222 West Blvd, Charlotte NC
      </span>
    </div>
  );
}

Created
Footer.tsx
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { LINKS, SITE } from "@/lib/site";
export function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90 pt-20 pb-8 font-body">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:gap-16 lg:grid-cols-5">
        <div className="lg:col-span-2 max-w-sm">
          <div className="font-display text-2xl tracking-[0.32em] text-cream">GLOWGIRL</div>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Luxury, personalized, and permanent jewelry for the girls who glow. Designed in
            the Queen City since 2018.
          </p>
          <div className="flex gap-4 mt-6 text-cream/80">
            <a href={LINKS.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-pink-blush transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={LINKS.facebookBrand} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-pink-blush transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={LINKS.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="hover:text-pink-blush transition">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        <FooterCol title="Shop">
          <FExt href={LINKS.shopChains}>Chain Collection</FExt>
          <FExt href={LINKS.shopCharms}>Charm Collection</FExt>
          <FExt href={LINKS.shopGold}>Gold Nameplate</FExt>
          <FExt href={LINKS.shopSilver}>Silver Nameplate</FExt>
          <FExt href={LINKS.shopGoldEarrings}>Gold Earrings</FExt>
          <FExt href={LINKS.shopSilverEarrings}>Silver Earrings</FExt>
        </FooterCol>
        <FooterCol title="Experience">
          <FInt to="/permanent-jewelry">Permanent Jewelry</FInt>
          <FExt href={LINKS.bookAppointment}>Book Appointment</FExt>
          <FInt to="/events">Private Events</FInt>
          <FInt to="/cafe">Glowgirl Café</FInt>
        </FooterCol>
        <FooterCol title="Community & Info">
          <FInt to="/jewelry-made-boss">Jewelry Made Boss</FInt>
          <FExt href={LINKS.ebook}>eBook</FExt>
          <FExt href={LINKS.facebookGroup}>Facebook Group</FExt>
          <FInt to="/about">About</FInt>
          <FInt to="/contact">Contact</FInt>
          <FExt href={LINKS.shippingReturns}>Shipping & Returns</FExt>
          <FExt href={LINKS.jewelryCare}>Jewelry Care</FExt>
        </FooterCol>
      </div>
      <div className="mt-16 pt-6 border-t border-cream/10 mx-auto max-w-7xl px-6 text-xs text-cream/55 flex flex-col md:flex-row justify-between gap-2">
        <span>© 2026 GLOWGIRL. All rights reserved.</span>
        <span>{SITE.address} · {SITE.email}</span>
      </div>
    </footer>
  );
}
function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-base tracking-widest text-pink-blush mb-4 uppercase">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
function FExt({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-pink-blush transition story-link">
        {children}
      </a>
    </li>
  );
}
function FInt({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-cream/70 hover:text-pink-blush transition story-link">
        {children}
      </Link>
    </li>
  );
}

Created
Marquee.tsx
const ITEMS = [
  "PERMANENT JEWELRY",
  "CUSTOM CHAINS",
  "250+ CHARMS",
  "ENGRAVED JEWELRY",
  "GLOWGIRL CAFÉ",
  "PRIVATE EVENTS",
  "WALK-INS WELCOME",
  "GOLD",
  "SILVER",
  "ROSE GOLD",
];
export function Marquee() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-pink-blush text-white overflow-hidden py-5 border-y border-pink-deep/20">
      <div className="flex animate-marquee whitespace-nowrap font-display italic text-2xl sm:text-3xl">
        {loop.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            {item}
            <span className="text-pink-pale">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

Created
Nav.tsx
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, LINKS } from "@/lib/site";
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "frost border-b border-border/70" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl sm:text-[28px] tracking-[0.32em] text-charcoal">
          GLOWGIRL
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-charcoal font-body">
          {NAV.map((item) =>
            "external" in item && item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="story-link"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="story-link"
                activeProps={{ className: "story-link text-pink-deep" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <a href={LINKS.bookAppointment} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Book Now
          </a>
          <a href={LINKS.shopAll} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Shop
          </a>
        </div>
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 -mr-2 text-charcoal"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-pink-pale flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16">
              <span className="font-display text-xl tracking-[0.32em]">GLOWGIRL</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 -mr-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-7 font-display text-3xl text-charcoal">
              {NAV.map((item) =>
                "external" in item && item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.to} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ),
              )}
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </nav>
            <div className="px-6 pb-10 flex flex-col gap-3">
              <a
                href={LINKS.bookAppointment}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Book Permanent Jewelry
              </a>
              <a
                href={LINKS.shopAll}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                Shop Jewelry
              </a>
              <div className="flex justify-center gap-5 pt-4 text-charcoal">
                <a href={LINKS.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={LINKS.facebookBrand} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

Created
Reveal.tsx
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: delay * 0.08,
      }}
    >
      {children}
    </motion.div>
  );
}

Created
Sparkles.tsx
import { useMemo } from "react";
// Floating golden orbs / sparkle dots for hero background
export function Sparkles({ count = 18 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        duration: 14 + Math.random() * 18,
        delay: -Math.random() * 20,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="animate-float absolute rounded-full bg-gold"
          style={{
            left: `${d.left}%`,
            bottom: "-20px",
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            boxShadow: "0 0 10px rgba(201, 169, 112, 0.7)",
          }}
        />
      ))}
    </div>
  );
}

Created
ContactForm.tsx
import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Tell us a bit more").max(2000),
});
type Errs = Partial<Record<keyof z.infer<typeof schema>, string>>;
export function ContactForm() {
  const [data, setData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errs, setErrs] = useState<Errs>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  function field<K extends keyof typeof data>(k: K, v: string) {
    setData((d) => ({ ...d, [k]: v }));
    setErrs((e) => ({ ...e, [k]: undefined }));
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrs: Errs = {};
      parsed.error.issues.forEach((i) => (fieldErrs[i.path[0] as keyof Errs] = i.message));
      setErrs(fieldErrs);
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any).from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send — please try again.");
      return;
    }
    setDone(true);
    toast.success("Message sent — we'll be in touch ✨");
  }
  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-cream rounded-3xl p-10"
          >
            <span className="animate-bounce-check inline-flex w-14 h-14 rounded-full bg-pink-blush items-center justify-center mb-4">
              <Check className="w-6 h-6 text-charcoal" />
            </span>
            <h3 className="font-display text-3xl">Message received</h3>
            <p className="text-mid-gray mt-2">We'll get back to you within one business day. ✨</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="space-y-4">
            <Field label="Name" error={errs.name}>
              <input
                value={data.name}
                onChange={(e) => field("name", e.target.value)}
                className={inputCls(!!errs.name)}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errs.email}>
              <input
                type="email"
                value={data.email}
                onChange={(e) => field("email", e.target.value)}
                className={inputCls(!!errs.email)}
                placeholder="your@email.com"
              />
            </Field>
            <Field label="Subject (optional)" error={errs.subject}>
              <input
                value={data.subject}
                onChange={(e) => field("subject", e.target.value)}
                className={inputCls(!!errs.subject)}
                placeholder="What's this about?"
              />
            </Field>
            <Field label="Message" error={errs.message}>
              <textarea
                rows={5}
                value={data.message}
                onChange={(e) => field("message", e.target.value)}
                className={inputCls(!!errs.message)}
                placeholder="Tell us what's on your mind…"
              />
            </Field>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
function inputCls(err: boolean) {
  return `w-full rounded-2xl bg-white border px-5 py-3.5 outline-none transition ${
    err ? "border-destructive" : "border-border focus:border-pink-deep"
  }`;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-charcoal/80 mb-1.5 font-body">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive mt-1">{error}</span>}
    </label>
  );
}

Created
EventInquiryForm.tsx
import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  event_type: z.string().trim().max(80).optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(50).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});
type Errs = Partial<Record<keyof z.infer<typeof schema>, string>>;
const initial = { name: "", email: "", phone: "", event_type: "Bachelorette", event_date: "", guests: "" as string | number, message: "" };
export function EventInquiryForm() {
  const [data, setData] = useState(initial);
  const [errs, setErrs] = useState<Errs>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  function field<K extends keyof typeof data>(k: K, v: string) {
    setData((d) => ({ ...d, [k]: v }));
    setErrs((e) => ({ ...e, [k]: undefined }));
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fe: Errs = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as keyof Errs] = i.message));
      setErrs(fe);
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any).from("event_inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      event_type: parsed.data.event_type || null,
      event_date: parsed.data.event_date || null,
      guests: parsed.data.guests ?? null,
      message: parsed.data.message || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send inquiry — please try again.");
      return;
    }
    setDone(true);
    toast.success("Inquiry sent — we'll be in touch ✨");
  }
  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-cream rounded-3xl p-10"
          >
            <span className="animate-bounce-check inline-flex w-14 h-14 rounded-full bg-pink-blush items-center justify-center mb-4">
              <Check className="w-6 h-6 text-charcoal" />
            </span>
            <h3 className="font-display text-3xl">Inquiry received</h3>
            <p className="text-mid-gray mt-2">We'll respond within one business day with availability + pricing.</p>
          </motion.div>
        ) : (
          <motion.form key="f" onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <F label="Name" e={errs.name}>
                <input value={data.name} onChange={(e) => field("name", e.target.value)} className={cls(!!errs.name)} />
              </F>
              <F label="Email" e={errs.email}>
                <input type="email" value={data.email} onChange={(e) => field("email", e.target.value)} className={cls(!!errs.email)} />
              </F>
              <F label="Phone" e={errs.phone}>
                <input value={data.phone} onChange={(e) => field("phone", e.target.value)} className={cls(!!errs.phone)} />
              </F>
              <F label="Event Type" e={errs.event_type}>
                <select value={data.event_type} onChange={(e) => field("event_type", e.target.value)} className={cls(!!errs.event_type)}>
                  <option>Bachelorette</option>
                  <option>Birthday</option>
                  <option>Bridal Shower</option>
                  <option>Brand / Corporate</option>
                  <option>Girls' Night</option>
                  <option>Other</option>
                </select>
              </F>
              <F label="Event Date" e={errs.event_date}>
                <input type="date" value={data.event_date} onChange={(e) => field("event_date", e.target.value)} className={cls(!!errs.event_date)} />
              </F>
              <F label="Guests (up to 14)" e={errs.guests}>
                <input type="number" min={1} max={50} value={data.guests} onChange={(e) => field("guests", e.target.value)} className={cls(!!errs.guests)} />
              </F>
            </div>
            <F label="Tell us about your event" e={errs.message}>
              <textarea rows={4} value={data.message} onChange={(e) => field("message", e.target.value)} className={cls(!!errs.message)} />
            </F>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Inquiry"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
function cls(err: boolean) {
  return `w-full rounded-2xl bg-white border px-5 py-3.5 outline-none transition ${
    err ? "border-destructive" : "border-border focus:border-pink-deep"
  }`;
}
function F({ label, e, children }: { label: string; e?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-charcoal/80 mb-1.5">{label}</span>
      {children}
      {e && <span className="block text-xs text-destructive mt-1">{e}</span>}
    </label>
  );
}

Created
NewsletterForm.tsx
import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });
export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setLoading(true);
    const { error: dbError } = await (supabase as any)
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email });
    setLoading(false);
    if (dbError && !/duplicate|unique/i.test(dbError.message)) {
      toast.error("Couldn't save your email — please try again.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're glowing with us now! 🎀");
  }
  const inputCls =
    variant === "dark"
      ? "bg-white text-charcoal placeholder:text-mid-gray"
      : "bg-white text-charcoal placeholder:text-mid-gray border-charcoal/15";
  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 bg-white text-charcoal rounded-full py-4 px-6 font-body"
          >
            <span className="animate-bounce-check inline-flex w-8 h-8 rounded-full bg-pink-blush items-center justify-center">
              <Check className="w-4 h-4" />
            </span>
            You're glowing with us now! 🎀
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="your@email.com"
              aria-label="Email address"
              className={`flex-1 rounded-full px-6 py-4 outline-none border ${
                error ? "border-destructive" : "border-transparent"
              } ${inputCls}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
              style={{ backgroundColor: variant === "dark" ? "#fff" : undefined }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join the Glow"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-2 text-sm text-destructive text-center">{error}</p>}
    </form>
  );
}

Created
sections.tsx
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChevronDown, Coffee, Link as LinkIcon, Sparkles as SparklesIcon,
  MapPin, Clock, Phone, Mail, Star, Camera, Instagram, Droplet, Scissors, Heart, ShieldCheck,
} from "lucide-react";
import { Sparkles } from "@/components/Sparkles";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { LINKS, SITE } from "@/lib/site";
/* ============ 2. HERO ============ */
export function Hero() {
  return (
    <section className="relative hero-gradient overflow-hidden">
      <Sparkles count={22} />
      <div className="relative mx-auto max-w-7xl px-6 pt-16 sm:pt-24 lg:pt-32 pb-24 lg:pb-40 min-h-[calc(100vh-7rem)] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block text-xs sm:text-sm tracking-[0.32em] text-gold uppercase mb-6">
            Since 2018 · Charlotte, NC
          </span>
          <h1 className="font-display font-light text-[42px] leading-[1.05] sm:text-6xl lg:text-[88px] text-charcoal text-balance">
            Charlotte's Girliest
            <br />
            <span className="italic text-pink-deep">Jewelry Experience</span> <span className="text-gold">✨</span>
          </h1>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-mid-gray max-w-xl mx-auto leading-relaxed">
            Permanent jewelry, handcrafted chains & charms, and a café made for girls who glow — in the heart of Charlotte's South End.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a href={LINKS.bookAppointment} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
              Book Permanent Jewelry
            </a>
            <a href={LINKS.shopChains} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
              Shop Jewelry
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-charcoal/75">
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> 4.9 Google Rating</span>
            <span>🎀 Since 2018</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> South End Charlotte</span>
            <span>✨ Walk-ins Welcome</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-charcoal/40 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
/* ============ 3. MARQUEE STRIP ============ */
export { Marquee };
/* ============ 4. THE EXPERIENCE ============ */
export function Experience() {
  const cards = [
    {
      icon: LinkIcon, accent: "bg-pink-blush",
      title: "Permanent Jewelry",
      body: "Choose from 30+ chain styles and 250+ charms. Custom-welded, clasp-free, yours forever.",
      cta: "Learn More", to: "/permanent-jewelry",
    },
    {
      icon: Coffee, accent: "bg-gold",
      title: "Glowgirl Café",
      body: "Charlotte's girliest café, inside the studio. Lattes, aesthetic vibes, R&B jazz. Open Thu–Sun 11am–3pm.",
      cta: "See the Menu", to: "/cafe",
    },
    {
      icon: SparklesIcon, accent: "bg-pink-blush",
      title: "Private Events",
      body: "Book our studio for up to 14 guests. Bachelorettes, birthdays, and brands welcome.",
      cta: "Book an Event", to: "/events",
    },
  ];
  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-light text-4xl sm:text-5xl text-balance">
              One Studio. <span className="italic text-pink-deep">Two Experiences.</span>
            </h2>
            <p className="mt-4 text-mid-gray">
              Whether you're here for the jewelry or the café — you're about to glow.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i}>
              <div className="group bg-white rounded-3xl p-8 h-full shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition border-t-4" style={{ borderTopColor: i === 1 ? "var(--gold)" : "var(--pink-blush)" }}>
                <div className={`w-12 h-12 rounded-full ${c.accent} flex items-center justify-center mb-5`}>
                  <c.icon className="w-5 h-5 text-charcoal" />
                </div>
                <h3 className="font-display text-2xl mb-2">{c.title}</h3>
                <p className="text-mid-gray text-[15px] leading-relaxed mb-5">{c.body}</p>
                <Link to={c.to} className="story-link text-gold font-medium text-sm">{c.cta} →</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ============ 5. COLLECTIONS ============ */
const COLLECTIONS = [
  { name: "Chain Collection", meta: "29 styles from $40", href: LINKS.shopChains, grad: "from-pink-blush via-pink-pale to-gold-light" },
  { name: "Charm Collection", meta: "53 charms from $20", href: LINKS.shopCharms, grad: "from-gold-light via-cream to-pink-blush" },
  { name: "Gold Nameplate Jewelry", meta: "Personalized from $85", href: LINKS.shopGold, grad: "from-gold via-gold-light to-cream" },
  { name: "Silver Nameplate Jewelry", meta: "Custom from $85", href: LINKS.shopSilver, grad: "from-pink-pale via-white to-gold-light" },
];
export function Collections() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-light text-4xl sm:text-5xl text-balance">Curated Collections</h2>
            <p className="mt-4 text-mid-gray">
              Every piece is tarnish-free, built to shine through showers, swims, and everything in between.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.name} delay={i}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.grad}`} />
                <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-90 transition">
                  <SparklesIcon className="w-10 h-10 text-white/80" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent text-white">
                  <h3 className="font-display text-xl sm:text-2xl leading-tight">{c.name}</h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1">{c.meta}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={LINKS.shopAll} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
}
/* ============ 6. PERMANENT JEWELRY EXPLAINER ============ */
export function Explainer() {
  const features = [
    { icon: ShieldCheck, text: "Stainless steel — tarnish-free" },
    { icon: Droplet, text: "Waterproof — shower & swim safe" },
    { icon: Scissors, text: "Easily removable with scissors" },
    { icon: SparklesIcon, text: "Custom charms & connectors" },
    { icon: Heart, text: "Perfect for milestones & friendships" },
  ];
  return (
    <section className="section-pad bg-pink-pale">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="aspect-[4/5] rounded-3xl overflow-hidden relative bg-gradient-to-br from-pink-blush via-gold-light to-cream shadow-[var(--shadow-soft)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <LinkIcon className="w-24 h-24 text-white/70" strokeWidth={1} />
            </div>
            <Sparkles count={8} />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <span className="text-xs tracking-[0.3em] uppercase text-gold">The Glow Experience</span>
          <h2 className="font-display font-light text-4xl sm:text-5xl mt-3 text-balance">
            What Is <span className="italic">Permanent Jewelry?</span>
          </h2>
          <p className="mt-5 text-mid-gray leading-relaxed">
            Permanent jewelry is clasp-free, custom jewelry welded directly onto you for a seamless, timeless fit.
            No clasps. No tangles. Just pure, uninterrupted glow.
          </p>
          <p className="mt-3 text-mid-gray leading-relaxed">
            Choose your chain from 30+ styles in gold, silver, or rose gold — then personalize it with one of our 250+ charms.
            It stays on until <em>you</em> decide it's time.
          </p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-[15px] text-charcoal">
                <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-gold" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <a href={LINKS.bookAppointment} target="_blank" rel="noopener noreferrer" className="btn-primary mt-9">
            Book the Experience
          </a>
        </Reveal>
      </div>
    </section>
  );
}
/* ============ 7. REVIEWS ============ */
const REVIEWS = [
  { quote: "Beautiful space, great vibes, and I can't wait to host my next event here!", name: "Ashley M.", stars: 5 },
  { quote: "Prices are reasonable and water & wine are complimentary!", name: "Jordan T.", stars: 5 },
  { quote: "The atmosphere was a cute pink setup and they were playing smooth R&B jazz.", name: "Maya K.", stars: 5 },
];
export function Reviews() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-light text-4xl sm:text-5xl text-balance">
              What <span className="italic text-pink-deep">Glowgirls</span> Are Saying
            </h2>
            <div className="mt-5 inline-flex items-center gap-2 bg-cream rounded-full px-5 py-2 text-sm text-charcoal">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <strong>4.9</strong> / 5 · 39 Google Reviews
            </div>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i}>
              <figure className="bg-cream rounded-3xl p-8 h-full">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-display italic text-xl leading-relaxed text-charcoal">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-5 text-sm text-mid-gray">— {r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={LINKS.googleReviews} target="_blank" rel="noopener noreferrer" className="story-link text-gold text-sm">
            Read all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
/* ============ 8. STUDIO INFO ============ */
export function StudioInfo() {
  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        <Reveal>
          <div className="h-full flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Visit Us</span>
            <h2 className="font-display font-light text-4xl sm:text-5xl mt-3">The Studio</h2>
            <ul className="mt-8 space-y-5 text-charcoal">
              <Row icon={MapPin}>{SITE.address}</Row>
              <Row icon={Clock}>{SITE.hours}</Row>
              <Row icon={Phone}><a href={`tel:${SITE.phone}`} className="story-link">{SITE.phone}</a></Row>
              <Row icon={Mail}><a href={`mailto:${SITE.email}`} className="story-link">{SITE.email}</a></Row>
            </ul>
            <p className="mt-8 text-mid-gray text-[15px]">
              Walk-ins welcome · Appointments appreciated.
              Private events: up to 14 guests in-studio or we come to you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={LINKS.bookAppointment} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book Appointment
              </a>
              <Link to="/events" className="btn-secondary">Plan a Private Event</Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="rounded-3xl overflow-hidden h-[420px] lg:h-full shadow-[var(--shadow-card)]">
            <iframe
              title="Glowgirl location map"
              src={SITE.mapsEmbed}
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
function Row({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gold" />
      </span>
      <span className="pt-2">{children}</span>
    </li>
  );
}
/* ============ 9. JEWELRY MADE BOSS ============ */
export function JewelryMadeBoss() {
  return (
    <section className="section-pad bg-charcoal text-cream relative overflow-hidden">
      <Sparkles count={10} />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-gold">For the Bosses</span>
        <h2 className="font-display font-light text-4xl sm:text-6xl mt-4 text-cream text-balance">
          Jewelry Made <span className="italic text-pink-blush">Boss</span> 💼
        </h2>
        <p className="mt-5 text-cream/80 text-lg italic font-display">
          Built for women who turn their passion into profit.
        </p>
        <p className="mt-6 text-cream/70 max-w-2xl mx-auto leading-relaxed">
          Jewelry Made Boss is a community for like-minded jewelry entrepreneurs. We teach women how to make
          quality jewelry and help them become successful jewelry bosses.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={LINKS.ebook} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Get the eBook ($80)
          </a>
          <a href={LINKS.facebookGroup} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Join the Community
          </a>
        </div>
      </div>
    </section>
  );
}
/* ============ 10. INSTAGRAM TEASER ============ */
export function InstagramTeaser() {
  // Replace gradient tiles with actual Instagram embed or Curator.io widget when live
  const tiles = [
    "from-pink-blush to-gold-light", "from-gold-light to-cream", "from-pink-pale to-pink-blush",
    "from-cream to-gold-light", "from-pink-blush to-pink-pale", "from-gold-light to-pink-blush",
  ];
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display font-light text-4xl sm:text-5xl">Follow the Glow ✨</h2>
            <p className="mt-3 text-mid-gray">@glowgirl on Instagram · 11.7K followers</p>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tiles.map((g, i) => (
            <a
              key={i}
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${g} flex items-center justify-center group`}
            >
              <Camera className="w-7 h-7 text-white/70 group-hover:scale-110 transition" />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition" />
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
            <Instagram className="w-4 h-4" /> Follow @glowgirl
          </a>
        </div>
      </div>
    </section>
  );
}
/* ============ 11. NEWSLETTER ============ */
export function Newsletter() {
  return (
    <section className="section-pad bg-pink-blush relative overflow-hidden">
      <Sparkles count={10} />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display font-light text-4xl sm:text-5xl text-charcoal text-balance">
          Stay in Your <span className="italic">Glow</span>
        </h2>
        <p className="mt-4 text-charcoal/75">
          Be the first to know about new chains, charm drops, events, and café specials.
        </p>
        <div className="mt-8">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}

Created
auth-attacher.ts
// This file is automatically generated. Do not edit it directly.
import { createMiddleware } from '@tanstack/react-start'
import { supabase } from './client'
// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
)

Created
auth-middleware.ts
// This file is automatically generated. Do not edit it directly.
import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
      console.error(`[Supabase] ${message}`);
      throw new Error(message);
    }
    
    const request = getRequest();
    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Unauthorized: No authorization header provided');
    }
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }
    const supabase = createClient<Database>(
      SUPABASE_URL!,
      SUPABASE_PUBLISHABLE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error('Unauthorized: Invalid token');
    }
    if (!data.claims.sub) {
      throw new Error('Unauthorized: No user ID found in token');
    }
    return next({
      context: {
        supabase,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  },
);

Created
client.server.ts
// This file is automatically generated. Do not edit it directly.
// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
// For user-authenticated queries (with RLS), use the auth middleware instead.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_SERVICE_ROLE_KEY ? ['SUPABASE_SERVICE_ROLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}
let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;
// Server-side Supabase client with service role - bypasses RLS
// SECURITY: Only use this for trusted server-side operations, never expose to client code
// Import like: import { supabaseAdmin } from "@/integrations/supabase/client.server";
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});

Created
client.ts
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
function createSupabaseClient() {
  // Use import.meta.env for client-side (Vite build-time replacement)
  // Fall back to process.env for SSR (server-side rendering)
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}
let _supabase: ReturnType<typeof createSupabaseClient> | undefined;
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

Created
src/integrations/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      event_inquiries: {
        Row: {
          created_at: string
          email: string
          event_date: string | null
          event_type: string | null
          guests: number | null
          id: string
          message: string | null
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string | null
          event_type?: string | null
          guests?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
export const Constants = {
  public: {
    Enums: {},
  },
} as const

Created
site.ts
// GLOWGIRL — central constants + external links
export const SITE = {
  name: "GLOWGIRL",
  tagline: "Charlotte's girliest permanent jewelry studio & café.",
  description:
    "Permanent jewelry, handcrafted chains & charms, and a café made for girls who glow — in Charlotte's South End.",
  address: "222 West Blvd Ste. S112, Charlotte, NC 28203",
  phone: "(704) 612-9113",
  email: "contact@glowgirl.us",
  hours: "Thursday–Sunday · 11am–7pm (Café closes 3pm)",
  mapsEmbed:
    "https://maps.google.com/maps?q=222+West+Blvd+Ste+S112,+Charlotte,+NC+28203&output=embed",
  ogImage: "/og-image.jpg",
};
export const LINKS = {
  shopChains: "https://glowgirl.us/collections/glowgirl-chain-collection",
  shopCharms: "https://glowgirl.us/collections/glowgirl-charm-collection",
  shopGold: "https://glowgirl.us/collections/gold",
  shopSilver: "https://glowgirl.us/collections/silver",
  shopGoldEarrings: "https://glowgirl.us/collections/earrings",
  shopSilverEarrings: "https://glowgirl.us/collections/silver-earrings",
  shopAll: "https://glowgirl.us/",
  ebook:
    "https://glowgirl.us/collections/jewelry-made-boss/products/becoming-a-jewelry-boss",
  bookAppointment: "https://keepglowinggirl.square.site/",
  facebookGroup: "https://www.facebook.com/groups/jewelrymadeboss",
  facebookBrand: "https://www.facebook.com/glowgirlbrand",
  instagram: "https://www.instagram.com/glowgirl/",
  cafeInstagram: "https://www.instagram.com/glowgirlcafe/",
  twitter: "https://twitter.com/glowgirlbrand",
  jewelryCare: "https://glowgirl.us/pages/jewelry-care",
  shippingReturns: "https://glowgirl.us/pages/shipping-returns",
  googleReviews:
    "https://www.google.com/maps/search/?api=1&query=Glowgirl+Charlotte",
};
type NavItem =
  | { label: string; to: string; external?: false; href?: undefined }
  | { label: string; href: string; external: true; to?: undefined };
export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Permanent Jewelry", to: "/permanent-jewelry" },
  { label: "Shop Jewelry", href: LINKS.shopAll, external: true },
  { label: "Café", to: "/cafe" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
];
export function pageHead({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const fullTitle = `${title} — GLOWGIRL`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}

Created
about.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/about")({
  head: () => pageHead({
    title: "About GLOWGIRL",
    description: "Luxury, personalized, and permanent jewelry for the girls who glow — designed in the Queen City since 2018.",
    path: "/about",
  }),
  component: Page,
});
const VALUES = [
  { t: "Quality", b: "Tarnish-free, waterproof, built to last through every season of your life." },
  { t: "Community", b: "A studio where every girl belongs — and every boss is celebrated." },
  { t: "Self-Expression", b: "30+ chains, 250+ charms — designed so your jewelry tells your story." },
  { t: "Glow", b: "Because feeling beautiful shouldn't be reserved for special occasions." },
];
function Page() {
  return (
    <>
      <section className="hero-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Our Story</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            Designed in the <span className="italic text-pink-deep">Queen City</span>.
          </h1>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-display italic text-2xl sm:text-3xl leading-relaxed text-charcoal text-balance">
              "Luxury, personalized, and permanent jewelry for the girls who glow."
            </p>
            <p className="mt-8 text-mid-gray leading-relaxed">
              Since 2018, our goal has been to design jewelry that revolves around <em>you</em> — and encourages you to glow.
              What started as a love letter to Charlotte's girl-energy has grown into a studio, a café, and a community
              of jewelry bosses building something all their own.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="font-display font-light text-4xl text-center">What we believe</h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i}>
                <div className="bg-white rounded-3xl p-7 h-full border-t-4 border-pink-blush">
                  <h3 className="font-display text-2xl">{v.t}</h3>
                  <p className="mt-2 text-mid-gray">{v.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Created
cafe.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Instagram, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Sparkles } from "@/components/Sparkles";
import { pageHead, LINKS, SITE } from "@/lib/site";
export const Route = createFileRoute("/cafe")({
  head: () => pageHead({
    title: "Glowgirl Café — Charlotte's Girliest Café",
    description: "Handcrafted lattes in Charlotte's most aesthetic café. Inside the Glowgirl studio. Open Thursday–Sunday 11am–3pm.",
    path: "/cafe",
  }),
  component: Page,
});
const MENU = [
  { name: "Signature Lattes", desc: "Vanilla rose, lavender honey, brown sugar oat" },
  { name: "Matcha Bar", desc: "Iced matcha, strawberry matcha, matcha cloud" },
  { name: "Specialty Drinks", desc: "Pink drink, glow tonic, sparkling refreshers" },
  { name: "Pastries & Sweets", desc: "Local bakery + seasonal favorites" },
];
function Page() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden py-24 sm:py-32">
        <Sparkles count={14} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Inside the studio</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            Charlotte's <span className="italic text-pink-deep">Girliest</span> Café 🎀
          </h1>
          <div className="mt-6 flex justify-center gap-5 text-sm text-charcoal/75">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Thu–Sun · 11am–3pm</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> South End</span>
          </div>
          <p className="mt-6 text-lg text-mid-gray max-w-2xl mx-auto leading-relaxed">
            Tucked inside the Glowgirl studio, our café serves handcrafted lattes in the most aesthetically
            pleasing setting in South End. Think pink everything, smooth R&B jazz, and a latte that's almost
            too pretty to drink.
          </p>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-center font-display font-light text-4xl sm:text-5xl">The Menu</h2>
            <p className="text-center text-mid-gray mt-3 text-sm">
              {/* Plug real Square menu in here via iframe or link when live: https://keepglowinggirl.square.site/ */}
              A taste of what's pouring — full menu in-studio.
            </p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MENU.map((m, i) => (
              <Reveal key={m.name} delay={i}>
                <div className="bg-white rounded-3xl p-7 h-full shadow-[var(--shadow-card)]">
                  <Coffee className="w-7 h-7 text-gold mb-4" />
                  <h3 className="font-display text-xl">{m.name}</h3>
                  <p className="mt-2 text-mid-gray text-sm leading-relaxed">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href={LINKS.cafeInstagram} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
              <Instagram className="w-4 h-4" /> Follow @glowgirlcafe
            </a>
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display font-light text-4xl">Visit the Café</h2>
          <p className="mt-3 text-mid-gray">{SITE.address}</p>
          <p className="text-mid-gray">{SITE.hours}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
            Get Directions
          </a>
        </div>
      </section>
    </>
  );
}

Created
collections.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { Sparkles as SparklesIcon } from "lucide-react";
import { pageHead, LINKS } from "@/lib/site";
export const Route = createFileRoute("/collections")({
  head: () => pageHead({
    title: "Collections",
    description: "Browse Glowgirl's curated jewelry collections — chains, charms, gold & silver nameplate. Tarnish-free, waterproof, made to shine.",
    path: "/collections",
  }),
  component: Page,
});
const ALL = [
  { name: "Chain Collection", meta: "29 styles from $40", href: LINKS.shopChains, grad: "from-pink-blush via-pink-pale to-gold-light" },
  { name: "Charm Collection", meta: "53 charms from $20", href: LINKS.shopCharms, grad: "from-gold-light via-cream to-pink-blush" },
  { name: "Gold Nameplate", meta: "Personalized from $85", href: LINKS.shopGold, grad: "from-gold via-gold-light to-cream" },
  { name: "Silver Nameplate", meta: "Custom from $85", href: LINKS.shopSilver, grad: "from-pink-pale via-white to-gold-light" },
  { name: "Gold Earrings", meta: "From $35", href: LINKS.shopGoldEarrings, grad: "from-gold-light via-pink-blush to-pink-pale" },
  { name: "Silver Earrings", meta: "From $35", href: LINKS.shopSilverEarrings, grad: "from-cream via-pink-pale to-gold-light" },
];
function Page() {
  return (
    <>
      <section className="hero-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display font-light text-5xl sm:text-7xl text-balance">Collections</h1>
          <p className="mt-5 text-mid-gray max-w-xl mx-auto">
            Tarnish-free. Waterproof. Built to shine through showers, swims, and everything in between.
          </p>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL.map((c, i) => (
            <Reveal key={c.name} delay={i}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition">
                <div className={`absolute inset-0 bg-gradient-to-br ${c.grad}`} />
                <div className="absolute inset-0 flex items-center justify-center"><SparklesIcon className="w-10 h-10 text-white/80" /></div>
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal/80 to-transparent text-white">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="text-sm text-white/85 mt-1">{c.meta}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a href={LINKS.shopAll} target="_blank" rel="noopener noreferrer" className="btn-primary">Shop Everything</a>
        </div>
      </section>
    </>
  );
}

Created
contact.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageHead, SITE } from "@/lib/site";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
export const Route = createFileRoute("/contact")({
  head: () => pageHead({
    title: "Contact GLOWGIRL",
    description: "Get in touch with Glowgirl — Charlotte's permanent jewelry studio & café. 222 West Blvd, South End Charlotte.",
    path: "/contact",
  }),
  component: Page,
});
function Page() {
  return (
    <>
      <section className="hero-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-display font-light text-5xl sm:text-7xl text-balance">Say hi 💌</h1>
          <p className="mt-5 text-mid-gray">We usually respond within one business day.</p>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-5 text-charcoal">
              <Item icon={MapPin} title="Visit">{SITE.address}</Item>
              <Item icon={Clock} title="Hours">{SITE.hours}</Item>
              <Item icon={Phone} title="Call"><a href={`tel:${SITE.phone}`} className="story-link">{SITE.phone}</a></Item>
              <Item icon={Mail} title="Email"><a href={`mailto:${SITE.email}`} className="story-link">{SITE.email}</a></Item>
            </div>
            <div className="rounded-3xl overflow-hidden mt-8 h-64 shadow-[var(--shadow-card)]">
              <iframe title="Map" src={SITE.mapsEmbed} loading="lazy" className="w-full h-full border-0" />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-3xl mb-6">Send a message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
function Item({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl p-5">
      <span className="w-10 h-10 rounded-full bg-pink-pale flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gold" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-widest text-mid-gray">{title}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

Created
events.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { EventInquiryForm } from "@/components/forms/EventInquiryForm";
import { pageHead, SITE } from "@/lib/site";
export const Route = createFileRoute("/events")({
  head: () => pageHead({
    title: "Private Events & Bachelorettes",
    description: "Book Glowgirl for your bachelorette, birthday, or brand event — up to 14 guests in-studio or we come to you.",
    path: "/events",
  }),
  component: Page,
});
function Page() {
  return (
    <>
      <section className="hero-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Private Events</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            Make your party <span className="italic text-pink-deep">permanent</span>.
          </h1>
          <p className="mt-6 text-mid-gray text-lg max-w-xl mx-auto">
            Up to 14 guests in-studio. Or we bring the glow to you anywhere in the Charlotte area.
          </p>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-3xl mb-2">Tell us about your event</h2>
              <p className="text-mid-gray mb-6 text-sm">
                We'll respond within one business day with availability and pricing.
              </p>
              <EventInquiryForm />
              <p className="text-center text-xs text-mid-gray mt-6">
                Prefer to call? {SITE.phone}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

Created
jewelry-made-boss.tsx
import { createFileRoute } from "@tanstack/react-router";
import { JewelryMadeBoss } from "@/components/home/sections";
import { pageHead, LINKS } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
export const Route = createFileRoute("/jewelry-made-boss")({
  head: () => pageHead({
    title: "Jewelry Made Boss — Community for Jewelry Entrepreneurs",
    description: "A community for women turning their jewelry passion into profit. Get the eBook and join the Jewelry Made Boss community.",
    path: "/jewelry-made-boss",
  }),
  component: Page,
});
function Page() {
  return (
    <>
      <JewelryMadeBoss />
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="bg-white rounded-3xl p-8 h-full">
              <h3 className="font-display text-3xl">The eBook</h3>
              <p className="mt-3 text-mid-gray">
                <em>Becoming a Jewelry Boss</em> — the full playbook from sourcing to selling.
              </p>
              <a href={LINKS.ebook} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">Get It Now — $80</a>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white rounded-3xl p-8 h-full">
              <h3 className="font-display text-3xl">The Community</h3>
              <p className="mt-3 text-mid-gray">
                Join thousands of jewelry entrepreneurs sharing wins, lessons, and resources.
              </p>
              <a href={LINKS.facebookGroup} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6">Join the Facebook Group</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

Created
permanent-jewelry.tsx
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pageHead, LINKS, SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { Sparkles } from "@/components/Sparkles";
import { EventInquiryForm } from "@/components/forms/EventInquiryForm";
export const Route = createFileRoute("/permanent-jewelry")({
  head: () => pageHead({
    title: "Permanent Jewelry in Charlotte",
    description: "Custom-welded, clasp-free permanent jewelry. 30+ chains, 250+ charms. The Keep Glowing Girl Experience in South End Charlotte.",
    path: "/permanent-jewelry",
  }),
  component: Page,
});
const FAQS = [
  { q: "What is permanent jewelry?", a: "Permanent jewelry is clasp-free, custom jewelry welded directly onto you. No clasps, no tangles — just a seamless, timeless fit you wear until you choose to take it off." },
  { q: "Does it hurt?", a: "Not at all. The welder is heatless on your skin — it only fuses the chain. Most clients say they feel nothing." },
  { q: "Can I shower or swim in it?", a: "Yes. Our pieces are tarnish-free stainless steel, gold-filled, and sterling silver options — all waterproof and built for everyday life." },
  { q: "How do I remove it?", a: "Easily — just snip the chain with scissors. Bring it back any time and we'll re-weld it for you." },
  { q: "How long does an appointment take?", a: "Most appointments are 20–40 minutes. Walk-ins are welcome, but appointments guarantee your spot." },
];
function Page() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden py-24 sm:py-32">
        <Sparkles count={16} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Since 2018</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            The <span className="italic text-pink-deep">Keep Glowing Girl</span> Experience
          </h1>
          <p className="mt-6 text-lg text-mid-gray max-w-2xl mx-auto">
            Choose your chain. Pick your charms. We weld it on — and you glow forever.
          </p>
          <a href={LINKS.bookAppointment} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
            Book Your Appointment
          </a>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display font-light text-4xl text-center">Frequently Asked</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => <FAQ key={i} {...f} />)}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Private Events</span>
            <h2 className="font-display font-light text-4xl sm:text-5xl mt-3 text-balance">
              Host up to 14 guests. <span className="italic">Or we come to you.</span>
            </h2>
            <p className="mt-5 text-mid-gray leading-relaxed">
              Bachelorettes, birthdays, brand activations, girls' nights — the studio (or your space)
              becomes a permanent-jewelry experience your guests will never forget.
            </p>
            <ul className="mt-6 space-y-2 text-charcoal text-[15px]">
              <li>· Up to 14 guests in-studio</li>
              <li>· Mobile events anywhere in the Charlotte area</li>
              <li>· Complimentary water & wine</li>
              <li>· Custom party favors available</li>
            </ul>
            <p className="mt-6 text-sm text-mid-gray">
              {SITE.address} · {SITE.phone}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-cream rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-2xl mb-4">Inquire About an Event</h3>
              <EventInquiryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-lg">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-gold">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-mid-gray leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Created
config.toml
project_id = "cvwprzwrfzpbykseqhnb"

Created
20260605014439_de0f9a93-1a83-47c7-83ed-808ac61687cd.sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TABLE public.event_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_type text,
  event_date date,
  guests integer,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.event_inquiries TO anon, authenticated;
GRANT ALL ON public.event_inquiries TO service_role;
ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an event inquiry" ON public.event_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

Modified
bun.lock
        "@radix-ui/react-toggle-group": "^1.1.11",
        "@radix-ui/react-tooltip": "^1.2.8",
        "@supabase/supabase-js": "^2.107.0",
        "@tailwindcss/vite": "^4.2.1",
        "@tanstack/react-query": "^5.83.0",
        "date-fns": "^4.1.0",
        "embla-carousel-react": "^8.6.0",
        "framer-motion": "^12.40.0",
        "input-otp": "^1.4.2",
        "lucide-react": "^0.575.0",
    "@standard-schema/utils": ["@standard-schema/utils@0.3.0", "", {}, "sha512-e7Mew686owMaPJVNNLs55PUvgz371nKgwsc4vxE49zsODpJEnxgxRo2y/OKrqueavXgZNMDVj3DdHFlaSAeU8g=="],
    "@supabase/auth-js": ["@supabase/auth-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/auth-js/-/auth-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-XA7x+WIeIvuC3GTZ2ey67QcBbGw4n+o5B7M+dMm9KT1lL3wX1B52DfEWW00WuPt/LnniJLLIn1WIm9YPtuxzKQ=="],
    "@supabase/functions-js": ["@supabase/functions-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/functions-js/-/functions-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-iMtRUmEj1KOgQd/a3MR4hnBlPnZc62DW8+z8aPpnzbxWkexEZUVL2fSgvvp15gqFg1V55e2yMGqgK+yhSQxp5w=="],
    "@supabase/phoenix": ["@supabase/phoenix@0.4.2", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/phoenix/-/phoenix-0.4.2.tgz", {}, "sha512-YSAGnmDAfuleFCVt3CeurQZAhxRfXWeZIIkwp7NhYzQ1UwW6ePSnzsFAiUm/mbCkfoCf70QQHKW/K6RKh52a4A=="],
    "@supabase/postgrest-js": ["@supabase/postgrest-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/postgrest-js/-/postgrest-js-2.107.0.tgz", { "dependencies": { "tslib": "2.8.1" } }, "sha512-7ARs47/tyIjX7T0Ive20d4NY8zQYXsP5/P07jJWxffSIM2gpnSnGRnL/Fe15GPbdjsW2sTYeckHcyaoKbM6yWQ=="],
    "@supabase/realtime-js": ["@supabase/realtime-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/realtime-js/-/realtime-js-2.107.0.tgz", { "dependencies": { "@supabase/phoenix": "^0.4.2", "tslib": "2.8.1" } }, "sha512-cF2KYdR3JIn9YlWGeluY9S0G+otqTdL6hB8GzpatlEIY6fZudCcyFo6Dc3+X9tjeb+x9XcIyNAk9qhNAknjH1A=="],
    "@supabase/storage-js": ["@supabase/storage-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/storage-js/-/storage-js-2.107.0.tgz", { "dependencies": { "iceberg-js": "^0.8.1", "tslib": "2.8.1" } }, "sha512-/X8OOVwKBn8aVKuHAGOz2yLA0d2OauqhVuy4mNtN+o7wttHOgx1/j+pqOzlsjmhOHrYykF6AJNZhs3gKZzcMUw=="],
    "@supabase/supabase-js": ["@supabase/supabase-js@2.107.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/@supabase/supabase-js/-/supabase-js-2.107.0.tgz", { "dependencies": { "@supabase/auth-js": "2.107.0", "@supabase/functions-js": "2.107.0", "@supabase/postgrest-js": "2.107.0", "@supabase/realtime-js": "2.107.0", "@supabase/storage-js": "2.107.0" } }, "sha512-ChKzdlWVweMUUhr0U79JhMmgm1haS/C5JquaiCDr70JaGARRtjjoY9rkIheXWybXxTSNzRiQs3Sk8IAg1HS3ZA=="],
    "@tabby_ai/hijri-converter": ["@tabby_ai/hijri-converter@1.0.5", "", {}, "sha512-r5bClKrcIusDoo049dSL8CawnHR6mRdDwhlQuIgZRNty68q0x8k3Lf1BtPAMxRf/GgnHBnIO4ujd3+GQdLWzxQ=="],
    "flatted": ["flatted@3.4.2", "", {}, "sha512-PjDse7RzhcPkIJwy5t7KPWQSZ9cAbzQXcafsetQoD7sOJRQlGikNbx7yZp2OotDnJyrDcbyRq3Ttb18iYOqkxA=="],
    "framer-motion": ["framer-motion@12.40.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/framer-motion/-/framer-motion-12.40.0.tgz", { "dependencies": { "motion-dom": "^12.40.0", "motion-utils": "^12.39.0", "tslib": "^2.4.0" }, "peerDependencies": { "@emotion/is-prop-valid": "*", "react": "^18.0.0 || ^19.0.0", "react-dom": "^18.0.0 || ^19.0.0" }, "optionalPeers": ["@emotion/is-prop-valid", "react", "react-dom"] }, "sha512-uaBd3qC1v3KQqBEjwTUd183K6PbS+j0yR9w9VmEOLWA/tnUcSn8Xa3uck7t4dgpDoUss8xQTcj8W2L07lrnLFg=="],
    "fsevents": ["fsevents@2.3.3", "", { "os": "darwin" }, "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw=="],
    "httpxy": ["httpxy@0.5.3", "", {}, "sha512-SMS9V6Sn7VWaS11lYhoAr0ceoaiolTWf4jYdJn0NJhCdKMu9R2H9Fh0LBDWBHQF6HRLI1PmaePYsjanSpE5PEw=="],
    "iceberg-js": ["iceberg-js@0.8.1", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/iceberg-js/-/iceberg-js-0.8.1.tgz", {}, "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA=="],
    "iconv-lite": ["iconv-lite@0.6.3", "", { "dependencies": { "safer-buffer": ">= 2.1.2 < 3.0.0" } }, "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw=="],
    "minimatch": ["minimatch@3.1.5", "", { "dependencies": { "brace-expansion": "^1.1.7" } }, "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w=="],
    "motion-dom": ["motion-dom@12.40.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/motion-dom/-/motion-dom-12.40.0.tgz", { "dependencies": { "motion-utils": "^12.39.0" } }, "sha512-HxU3ZaBwNPVQUBQf1xxgq+7JrPNZvjLVxgbpEZL7RrWJnsxOf0/OM+yrHG9ogLQ31Do/r57Oz2gQWPK+6q62mg=="],
    "motion-utils": ["motion-utils@12.39.0", "https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/motion-utils/-/motion-utils-12.39.0.tgz", {}, "sha512-8nadJAJjTtqRkmRF36FoJTrywK9nnFmnPwnSMyxaOCU7GDjN9RTMJIxx9De8ErM+vpPhMccr/6fo5WciyQLnMQ=="],
    "ms": ["ms@2.1.3", "", {}, "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="],

Modified
package.json
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/supabase-js": "^2.107.0",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.83.0",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.40.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",

Modified
routeTree.gen.ts
import { Route as rootRouteImport } from './routes/__root'
import { Route as PermanentJewelryRouteImport } from './routes/permanent-jewelry'
import { Route as JewelryMadeBossRouteImport } from './routes/jewelry-made-boss'
import { Route as EventsRouteImport } from './routes/events'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as CollectionsRouteImport } from './routes/collections'
import { Route as CafeRouteImport } from './routes/cafe'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
const PermanentJewelryRoute = PermanentJewelryRouteImport.update({
  id: '/permanent-jewelry',
  path: '/permanent-jewelry',
  getParentRoute: () => rootRouteImport,
} as any)
const JewelryMadeBossRoute = JewelryMadeBossRouteImport.update({
  id: '/jewelry-made-boss',
  path: '/jewelry-made-boss',
  getParentRoute: () => rootRouteImport,
} as any)
const EventsRoute = EventsRouteImport.update({
  id: '/events',
  path: '/events',
  getParentRoute: () => rootRouteImport,
} as any)
const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const CollectionsRoute = CollectionsRouteImport.update({
  id: '/collections',
  path: '/collections',
  getParentRoute: () => rootRouteImport,
} as any)
const CafeRoute = CafeRouteImport.update({
  id: '/cafe',
  path: '/cafe',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/cafe': typeof CafeRoute
  '/collections': typeof CollectionsRoute
  '/contact': typeof ContactRoute
  '/events': typeof EventsRoute
  '/jewelry-made-boss': typeof JewelryMadeBossRoute
  '/permanent-jewelry': typeof PermanentJewelryRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/'
  fullPaths:
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  fileRoutesByTo: FileRoutesByTo
  to: '/'
  id: '__root__' | '/'
  to:
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/cafe'
    | '/collections'
    | '/contact'
    | '/events'
    | '/jewelry-made-boss'
    | '/permanent-jewelry'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  CafeRoute: typeof CafeRoute
  CollectionsRoute: typeof CollectionsRoute
  ContactRoute: typeof ContactRoute
  EventsRoute: typeof EventsRoute
  JewelryMadeBossRoute: typeof JewelryMadeBossRoute
  PermanentJewelryRoute: typeof PermanentJewelryRoute
}
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/permanent-jewelry': {
      id: '/permanent-jewelry'
      path: '/permanent-jewelry'
      fullPath: '/permanent-jewelry'
      preLoaderRoute: typeof PermanentJewelryRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/jewelry-made-boss': {
      id: '/jewelry-made-boss'
      path: '/jewelry-made-boss'
      fullPath: '/jewelry-made-boss'
      preLoaderRoute: typeof JewelryMadeBossRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/events': {
      id: '/events'
      path: '/events'
      fullPath: '/events'
      preLoaderRoute: typeof EventsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/collections': {
      id: '/collections'
      path: '/collections'
      fullPath: '/collections'
      preLoaderRoute: typeof CollectionsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/cafe': {
      id: '/cafe'
      path: '/cafe'
      fullPath: '/cafe'
      preLoaderRoute: typeof CafeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  CafeRoute: CafeRoute,
  CollectionsRoute: CollectionsRoute,
  ContactRoute: ContactRoute,
  EventsRoute: EventsRoute,
  JewelryMadeBossRoute: JewelryMadeBossRoute,
  PermanentJewelryRoute: PermanentJewelryRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}

Modified
__root.tsx
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
        <h1 className="font-display text-7xl text-charcoal">404</h1>
        <h2 className="mt-4 font-display text-2xl">This page took the day off.</h2>
        <p className="mt-2 text-sm text-mid-gray">Let's get you back to the glow.</p>
        <Link to="/" className="btn-primary mt-6">Go home</Link>
      </div>
    </div>
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        <h1 className="font-display text-3xl text-charcoal">Something didn't glow.</h1>
        <p className="mt-2 text-sm text-mid-gray">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-secondary">Go home</a>
        </div>
      </div>
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { title: "GLOWGIRL — Charlotte's Girliest Permanent Jewelry & Café" },
      { name: "description", content: "Permanent jewelry, custom chains & charms, and a café made for girls who glow — in Charlotte's South End." },
      { name: "author", content: "GLOWGIRL" },
      { property: "og:site_name", content: "GLOWGIRL" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@glowgirlbrand" },
      { name: "theme-color", content: "#fac7d7" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        name: "GLOWGIRL",
        image: "https://glowgirl.us/cdn/shop/files/logo.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "222 West Blvd Ste S112",
          addressLocality: "Charlotte",
          addressRegion: "NC",
          postalCode: "28203",
          addressCountry: "US",
        },
        telephone: "+1-704-612-9113",
        email: "contact@glowgirl.us",
        url: "https://glowgirl.us",
        priceRange: "$$",
        openingHours: "Th-Su 11:00-19:00",
      }),
    }],
  }),
  shellComponent: RootShell,
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <AnnouncementBar />
      <Nav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );

Modified
src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import {
  Hero, Marquee, Experience, Collections, Explainer,
  Reviews, StudioInfo, JewelryMadeBoss, InstagramTeaser, Newsletter,
} from "@/components/home/sections";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your App" },
      { name: "description", content: "Replace this with a one-sentence description of your app." },
      { property: "og:title", content: "Your App" },
      { property: "og:description", content: "Replace this with a one-sentence description of your app." },
    ],
  head: () => pageHead({
    title: "Charlotte's Girliest Permanent Jewelry & Café",
    description: "Permanent jewelry, custom chains & charms, and a café made for girls who glow — in Charlotte's South End.",
    path: "/",
  }),
  component: Index,
});
// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <img
        data-lovable-blank-page-placeholder="REMOVE_THIS"
        src="https://cdn.gpteng.co/blank-app-v1.svg"
        alt="Your app will live here!"
      />
    </div>
    <>
      <Hero />
      <Marquee />
      <Experience />
      <Collections />
      <Explainer />
      <Reviews />
      <StudioInfo />
      <JewelryMadeBoss />
      <InstagramTeaser />
      <Newsletter />
    </>
  );
}

Modified
start.ts
import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
const errorMiddleware = createMiddleware().server(async ({ next }) => {
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));

Modified
src/styles.css
@custom-variant dark (&:is(.dark *));
/*
 * Design system definition.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 *
 * To add a new semantic color:
 * 1. Add the variable to :root (light value) and .dark (dark value)
 * 2. Register it in @theme inline as --color-<name>: var(--<name>)
 */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap");
/* GLOWGIRL — Luxury feminine design system */
:root {
  --radius: 1rem;
  /* Brand palette */
  --pink-blush: #fac7d7;
  --pink-deep: #e8a0b4;
  --pink-pale: #fde8ef;
  --cream: #fdf6f0;
  --gold: #c9a970;
  --gold-light: #f0ddb8;
  --charcoal: #2a2a2a;
  --mid-gray: #6b6b6b;
  --white: #ffffff;
  /* Semantic shadcn tokens (kept for shadcn components) */
  --background: var(--white);
  --foreground: var(--charcoal);
  --card: var(--white);
  --card-foreground: var(--charcoal);
  --popover: var(--white);
  --popover-foreground: var(--charcoal);
  --primary: var(--pink-blush);
  --primary-foreground: var(--charcoal);
  --secondary: var(--cream);
  --secondary-foreground: var(--charcoal);
  --muted: var(--pink-pale);
  --muted-foreground: var(--mid-gray);
  --accent: var(--gold);
  --accent-foreground: var(--charcoal);
  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: #fff;
  --border: #efe6dc;
  --input: #efe6dc;
  --ring: var(--pink-deep);
  --font-display: "Cormorant Garamond", serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --shadow-soft: 0 10px 40px -20px rgba(232, 160, 180, 0.35);
  --shadow-card: 0 8px 30px -12px rgba(42, 42, 42, 0.12);
}
@theme inline {
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --radius-3xl: calc(var(--radius) + 16px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}
  /* Brand utility colors */
  --color-pink-blush: var(--pink-blush);
  --color-pink-deep: var(--pink-deep);
  --color-pink-pale: var(--pink-pale);
  --color-cream: var(--cream);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-charcoal: var(--charcoal);
  --color-mid-gray: var(--mid-gray);
.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
    border-color: var(--color-border);
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5 {
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--charcoal);
  }
}
/* === Custom utilities === */
@utility font-display { font-family: var(--font-display); }
@utility font-body { font-family: var(--font-body); }
@utility btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  background-color: var(--pink-blush);
  color: var(--charcoal);
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-soft);
}
@utility btn-secondary {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  color: var(--gold);
  border: 1.5px solid var(--gold);
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}
@utility section-pad {
  padding-block: 5rem;
}
/* Hover overrides (utilities don't compose hover well) */
.btn-primary:hover { background-color: var(--pink-deep); transform: translateY(-1px); }
.btn-secondary:hover { background-color: var(--gold); color: var(--white); }
/* Underline grow on hover */
.story-link {
  position: relative;
  display: inline-block;
}
.story-link::after {
  content: "";
  position: absolute;
  left: 50%; bottom: -2px;
  width: 0; height: 1px;
  background-color: currentColor;
  transition: width 0.3s ease, left 0.3s ease;
}
.story-link:hover::after {
  width: 100%; left: 0;
}
/* Marquee */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 38s linear infinite;
}
/* Shimmer / sparkle */
@keyframes shimmer {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
@keyframes float-up {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-120vh) translateX(20px); opacity: 0; }
}
.animate-float { animation: float-up linear infinite; }
@keyframes bounce-check {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.animate-bounce-check { animation: bounce-check 0.5s ease-out; }
/* Hero gradient */
.hero-gradient {
  background:
    radial-gradient(ellipse at 70% 20%, rgba(250, 199, 215, 0.55), transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(240, 221, 184, 0.45), transparent 60%),
    linear-gradient(180deg, var(--pink-pale) 0%, var(--cream) 100%);
}
.frost {
  background-color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.text-balance { text-wrap: balance; }