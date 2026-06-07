export type ShopCategory = {
  slug: string;
  category: string;
  title: string;
  blurb: string;
  gradient: string;
};

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "chains",
    category: "chains",
    title: "Chain Collection",
    blurb: "Tarnish-free, waterproof chains designed for stacking or wearing solo.",
    gradient: "from-pink-blush via-pink-pale to-gold-light",
  },
  {
    slug: "charms",
    category: "charms",
    title: "Charm Collection",
    blurb: "250+ charms to tell your story — mix, match, and make it yours.",
    gradient: "from-gold-light via-cream to-pink-blush",
  },
  {
    slug: "gold-earrings",
    category: "gold-earrings",
    title: "Gold Earrings",
    blurb: "Everyday gold earrings with that signature Glowgirl shine.",
    gradient: "from-gold via-gold-light to-cream",
  },
  {
    slug: "silver-earrings",
    category: "silver-earrings",
    title: "Silver Earrings",
    blurb: "Cool-toned sterling styles for the silver girlies.",
    gradient: "from-pink-pale via-white to-gold-light",
  },
  {
    slug: "gold-nameplate",
    category: "gold-nameplate",
    title: "Gold Nameplate",
    blurb: "Personalized gold nameplate necklaces — your name, your word, your brand.",
    gradient: "from-gold-light via-pink-blush to-pink-pale",
  },
  {
    slug: "silver-nameplate",
    category: "silver-nameplate",
    title: "Silver Nameplate",
    blurb: "Custom silver nameplate pieces, made just for you.",
    gradient: "from-cream via-pink-pale to-gold-light",
  },
];

export function categoryBySlug(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug);
}

/** Canonical URL for a collection/category page. */
export function collectionPath(slug: string) {
  return `/shop/${slug}`;
}

/**
 * Canonical URL for a product detail page.
 * Products live under `/shop/p/:slug` so product slugs can never
 * collide with collection slugs (e.g. a product named "chains").
 */
export function productPath(slug: string) {
  return `/shop/p/${slug}`;
}
