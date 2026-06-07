import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { LINKS } from "@/lib/site";
const ALL = [
  { name: "Chain Collection", meta: "8 styles from $40", href: LINKS.shopChains, image: "/images/glowgirl_004.jpg" },
  { name: "Charm Collection", meta: "6 charms from $20", href: LINKS.shopCharms, image: "/images/glowgirl_020.png" },
  { name: "Gold Nameplate", meta: "Personalized from $85", href: LINKS.shopGold, image: "/images/glowgirl_032.png" },
  { name: "Silver Nameplate", meta: "Custom from $85", href: LINKS.shopSilver, image: "/images/glowgirl_034.png" },
  { name: "Gold Earrings", meta: "3 styles from $35", href: LINKS.shopGoldEarrings, image: "/images/glowgirl_040.png" },
  { name: "Silver Earrings", meta: "3 styles from $35", href: LINKS.shopSilverEarrings, image: "/images/glowgirl_044.png" },
];
export default function CollectionsPage() {
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
              <Link to={c.href} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition">
                <img 
                  src={c.image} 
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="text-sm text-white/85 mt-1">{c.meta}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link to={LINKS.shopAll} className="btn-primary">Shop Everything</Link>
        </div>
      </section>
    </>
  );
}