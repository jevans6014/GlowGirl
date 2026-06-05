import { Link } from "react-router-dom";
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
          <FInt to={LINKS.shopChains}>Chain Collection</FInt>
          <FInt to={LINKS.shopCharms}>Charm Collection</FInt>
          <FInt to={LINKS.shopGold}>Gold Nameplate</FInt>
          <FInt to={LINKS.shopSilver}>Silver Nameplate</FInt>
          <FInt to={LINKS.shopGoldEarrings}>Gold Earrings</FInt>
          <FInt to={LINKS.shopSilverEarrings}>Silver Earrings</FInt>
        </FooterCol>
        <FooterCol title="Experience">
          <FInt to="/permanent-jewelry">Permanent Jewelry</FInt>
          <FInt to={LINKS.bookAppointment}>Book Appointment</FInt>
          <FInt to="/events">Private Events</FInt>
          <FInt to="/cafe">Glowgirl Café</FInt>
        </FooterCol>
        <FooterCol title="Community & Info">
          <FInt to="/jewelry-made-boss">Jewelry Made Boss</FInt>
          <FInt to={LINKS.ebook}>eBook</FInt>
          <FExt href={LINKS.facebookGroup}>Facebook Group</FExt>
          <FInt to="/about">About</FInt>
          <FInt to="/contact">Contact</FInt>
          <FInt to={LINKS.shippingReturns}>Shipping & Returns</FInt>
          <FInt to={LINKS.jewelryCare}>Jewelry Care</FInt>
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