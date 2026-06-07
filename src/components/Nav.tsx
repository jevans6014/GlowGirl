import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { NAV, ROUTES } from "@/lib/site";
import { useCart } from "@/context/CartContext";
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "frost border-b border-border/70" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          to="/"
          aria-label="GLOWGIRL home"
          className="flex flex-col items-center leading-none text-pink-logo"
        >
          <span className="font-script text-[34px] sm:text-[40px] leading-[0.85] -mb-1">
            glow
          </span>
          <span className="font-body text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.5em] pl-[0.5em]">
            girl
          </span>
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
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="p-2.5 text-charcoal"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`lg:hidden fixed inset-0 top-16 z-40 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <nav
        className={`frost relative border-b border-border/70 px-5 pb-8 pt-4 shadow-[var(--shadow-card)] transition-all duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {NAV.map((item, i) =>
            "external" in item && item.external ? (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={`block border-b border-border/50 py-4 font-display text-2xl tracking-wide text-charcoal transition-all duration-300 ${
                    open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onClose}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={({ isActive }) =>
                    `block border-b border-border/50 py-4 font-display text-2xl tracking-wide transition-all duration-300 ${
                      isActive ? "text-pink-deep" : "text-charcoal"
                    } ${open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>
        <div className="mt-6 flex flex-col gap-3">
          <Link to={ROUTES.book} onClick={onClose} className="btn-secondary w-full">
            Book Now
          </Link>
          <Link to={ROUTES.shopAll} onClick={onClose} className="btn-primary w-full">
            Shop
          </Link>
        </div>
      </nav>
    </div>
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