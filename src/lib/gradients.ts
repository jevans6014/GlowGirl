// Deterministic brand-palette gradient per product slug (image placeholder).
// TODO: Replace gradient with actual product photos from owner.
const GRADIENTS = [
  "from-pink-blush via-pink-pale to-gold-light",
  "from-gold-light via-cream to-pink-blush",
  "from-gold via-gold-light to-cream",
  "from-pink-pale via-white to-gold-light",
  "from-gold-light via-pink-blush to-pink-pale",
  "from-cream via-pink-pale to-gold-light",
  "from-pink-blush via-cream to-gold",
  "from-pink-deep via-pink-blush to-pink-pale",
];

export function gradientFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}
