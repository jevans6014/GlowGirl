import { Coffee, Instagram, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Sparkles } from "@/components/Sparkles";
import { LINKS, SITE } from "@/lib/site";
const MENU = [
  { name: "Signature Lattes", desc: "Vanilla rose, lavender honey, brown sugar oat" },
  { name: "Matcha Bar", desc: "Iced matcha, strawberry matcha, matcha cloud" },
  { name: "Specialty Drinks", desc: "Pink drink, glow tonic, sparkling refreshers" },
  { name: "Pastries & Sweets", desc: "Local bakery + seasonal favorites" },
];
export default function CafePage() {
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