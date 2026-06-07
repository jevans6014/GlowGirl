import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { NAV, ROUTES } from "@/lib/site";
import { useCart } from "@/context/CartContext";
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  
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
        </div>
      </div>
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