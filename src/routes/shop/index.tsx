import { Link } from "react-router-dom";
import { Sparkles as SparklesIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { ROUTES } from "@/lib/site";

export default function ShopIndex() {
  return (
    <>
      <section className="hero-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Shop GLOWGIRL</span>
          <h1 className="mt-4 font-display text-5xl text-balance sm:text-7xl">The Collections</h1>
          <p className="mx-auto mt-5 max-w-xl text-mid-gray">
            Tarnish-free. Waterproof. Built to shine through showers, swims, and everything in between.
          </p>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-6 lg:grid-cols-3">
          {SHOP_CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i}>
              <Link
                to={`/shop/${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-soft)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="h-10 w-10 text-white/80" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5 text-white">
                  <h3 className="font-display text-2xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{c.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link to={ROUTES.ebook} className="btn-secondary">Get the eBook</Link>
          <Link to={ROUTES.giftCards} className="btn-secondary">Gift Cards</Link>
          <Link to={ROUTES.book} className="btn-primary">Book Permanent Jewelry</Link>
        </div>
      </section>
    </>
  );
}
