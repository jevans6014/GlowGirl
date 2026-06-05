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
// INTERNAL ROUTES — all shopping & booking now lives inside this site
export const ROUTES = {
  shopChains: "/shop/chains",
  shopCharms: "/shop/charms",
  shopGoldEarrings: "/shop/gold-earrings",
  shopSilverEarrings: "/shop/silver-earrings",
  shopGoldNameplate: "/shop/gold-nameplate",
  shopSilverNameplate: "/shop/silver-nameplate",
  shopAll: "/shop",
  ebook: "/shop/jewelry-boss-ebook",
  giftCards: "/shop/gift-cards",
  book: "/book",
  cart: "/cart",
  checkout: "/checkout",
  orderSuccess: "/order-success",
  admin: "/admin",
};

// STILL EXTERNAL — social media only
export const SOCIAL = {
  instagram: "https://www.instagram.com/glowgirl/",
  cafeInstagram: "https://www.instagram.com/glowgirlcafe/",
  facebookBrand: "https://www.facebook.com/glowgirlbrand",
  facebookGroup: "https://www.facebook.com/groups/jewelrymadeboss",
  twitter: "https://twitter.com/glowgirlbrand",
  googleReviews:
    "https://www.google.com/maps/search/?api=1&query=Glowgirl+Charlotte",
};

// Backwards-compatible alias so existing imports keep working.
// Shop/book links are now INTERNAL routes; social links remain external.
export const LINKS = {
  shopChains: ROUTES.shopChains,
  shopCharms: ROUTES.shopCharms,
  shopGold: ROUTES.shopGoldNameplate,
  shopSilver: ROUTES.shopSilverNameplate,
  shopGoldEarrings: ROUTES.shopGoldEarrings,
  shopSilverEarrings: ROUTES.shopSilverEarrings,
  shopAll: ROUTES.shopAll,
  ebook: ROUTES.ebook,
  bookAppointment: ROUTES.book,
  facebookGroup: SOCIAL.facebookGroup,
  facebookBrand: SOCIAL.facebookBrand,
  instagram: SOCIAL.instagram,
  cafeInstagram: SOCIAL.cafeInstagram,
  twitter: SOCIAL.twitter,
  jewelryCare: "/permanent-jewelry",
  shippingReturns: "/contact",
  googleReviews: SOCIAL.googleReviews,
};
type NavItem =
  | { label: string; to: string; external?: false; href?: undefined }
  | { label: string; href: string; external: true; to?: undefined };
export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: ROUTES.shopAll },
  { label: "Permanent Jewelry", to: "/permanent-jewelry" },
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