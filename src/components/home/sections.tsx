import { Link } from "react-router-dom";
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
            <Link to={LINKS.bookAppointment} className="btn-primary w-full sm:w-auto">
              Book Permanent Jewelry
            </Link>
            <Link to={LINKS.shopChains} className="btn-secondary w-full sm:w-auto">
              Shop Jewelry
            </Link>
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              to="/try-on"
              className="story-link inline-flex items-center gap-1.5 text-sm font-medium text-pink-deep"
            >
              <Camera className="w-4 h-4" /> Try jewelry on with your camera ✨
            </Link>
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
  { name: "Chain Collection", meta: "8 styles from $40", href: LINKS.shopChains, image: "/images/glowgirl_004.jpg" },
  { name: "Charm Collection", meta: "6 charms from $20", href: LINKS.shopCharms, image: "/images/glowgirl_020.png" },
  { name: "Gold Nameplate Jewelry", meta: "Personalized from $85", href: LINKS.shopGold, image: "/images/glowgirl_032.png" },
  { name: "Silver Nameplate Jewelry", meta: "Custom from $85", href: LINKS.shopSilver, image: "/images/glowgirl_034.png" },
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
              <Link
                to={c.href}
                className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition"
              >
                <img 
                  src={c.image} 
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-xl sm:text-2xl leading-tight">{c.name}</h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1">{c.meta}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to={LINKS.shopAll} className="btn-secondary">
            View All Collections
          </Link>
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
          <Link to={LINKS.bookAppointment} className="btn-primary mt-9">
            Book the Experience
          </Link>
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
              <Link to={LINKS.bookAppointment} className="btn-primary">
                Book Appointment
              </Link>
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
          <Link to={LINKS.ebook} className="btn-primary">
            Get the eBook ($80)
          </Link>
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
  const instagramImages = [
    "/images/glowgirl_004.jpg",
    "/images/glowgirl_006.jpg",
    "/images/glowgirl_020.png",
    "/images/glowgirl_032.png",
    "/images/glowgirl_040.png",
    "/images/glowgirl_008.jpg",
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
          {instagramImages.map((src, i) => (
            <a
              key={i}
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition"
            >
              <img 
                src={src} 
                alt={`GLOWGIRL Instagram post ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
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

export function Sections() {
  return (
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