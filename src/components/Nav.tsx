import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Instagram, Facebook, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, LINKS, ROUTES } from "@/lib/site";
import { useCart } from "@/context/CartContext";
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
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
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `story-link ${isActive ? "text-pink-deep" : ""}`}
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link to={ROUTES.book} className="btn-secondary">
            Book Now
          </Link>
          <Link to={ROUTES.shopAll} className="btn-primary">
            Shop
          </Link>
          <CartButton count={count} />
        </div>
        <div className="lg:hidden flex items-center gap-1">
          <CartButton count={count} />
          <button
            aria-label="Open menu"
            className="p-2 -mr-2 text-charcoal"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cream flex flex-col overflow-y-auto"
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
              <Link to={ROUTES.book} onClick={() => setOpen(false)} className="btn-primary w-full">
                Book Permanent Jewelry
              </Link>
              <Link to={ROUTES.shopAll} onClick={() => setOpen(false)} className="btn-secondary w-full">
                Shop Jewelry
              </Link>
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

function CartButton({ count }: { count: number }) {
  return (
    <Link to={ROUTES.cart} className="relative p-2.5 text-charcoal" aria-label="Cart">
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-deep px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}