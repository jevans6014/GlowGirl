// Try-On catalog — POC assets.
//
// Each item renders as an inline SVG so the feature works today with
// zero real image assets. To upgrade later, swap `svg` for a PNG/WebP
// `src` (transparent background) or a 3D asset and update TryOnOverlay.
//
// `defaultScale` is relative to the stage width (0–1), `placement`
// hints where it usually sits so we can pre-position it.

export type TryOnPlacement = "neck" | "ears" | "wrist";

export type TryOnItem = {
  id: string;
  name: string;
  category: "chains" | "charms" | "earrings" | "nameplate";
  placement: TryOnPlacement;
  /** Fraction of stage width the asset should span by default. */
  defaultScale: number;
  /** Inline SVG markup (viewBox 0 0 100 100). Replace with real assets later. */
  svg: string;
};

const GOLD = "#c9a970";
const GOLD_LIGHT = "#f0ddb8";
const SILVER = "#d6d8db";

export const TRY_ON_ITEMS: TryOnItem[] = [
  {
    id: "gold-chain",
    name: "Classic Gold Chain",
    category: "chains",
    placement: "neck",
    defaultScale: 0.55,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12 Q50 78 92 12" fill="none" stroke="${GOLD}" stroke-width="3.2"
        stroke-linecap="round" stroke-dasharray="0.5 5"/>
      <path d="M8 12 Q50 78 92 12" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2"
        stroke-linecap="round" stroke-dasharray="0.5 5" opacity="0.7"/>
    </svg>`,
  },
  {
    id: "silver-chain",
    name: "Silver Rope Chain",
    category: "chains",
    placement: "neck",
    defaultScale: 0.55,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12 Q50 80 92 12" fill="none" stroke="${SILVER}" stroke-width="3.4"
        stroke-linecap="round" stroke-dasharray="1 4"/>
    </svg>`,
  },
  {
    id: "heart-charm",
    name: "Heart Charm Necklace",
    category: "charms",
    placement: "neck",
    defaultScale: 0.5,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12 Q50 72 88 12" fill="none" stroke="${GOLD}" stroke-width="2.6"
        stroke-linecap="round" stroke-dasharray="0.5 4.5"/>
      <path d="M50 64 l-7 -7 a5 5 0 1 1 7 -7 a5 5 0 1 1 7 7 z" fill="${GOLD}"
        stroke="${GOLD_LIGHT}" stroke-width="0.8"/>
    </svg>`,
  },
  {
    id: "gold-hoops",
    name: "Gold Hoop Earrings",
    category: "earrings",
    placement: "ears",
    defaultScale: 0.16,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="34" fill="none" stroke="${GOLD}" stroke-width="9"/>
      <circle cx="50" cy="55" r="34" fill="none" stroke="${GOLD_LIGHT}" stroke-width="3" opacity="0.6"/>
    </svg>`,
  },
  {
    id: "silver-studs",
    name: "Silver Star Studs",
    category: "earrings",
    placement: "ears",
    defaultScale: 0.1,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8 L61 39 L94 39 L67 59 L77 91 L50 71 L23 91 L33 59 L6 39 L39 39 Z"
        fill="${SILVER}" stroke="#fff" stroke-width="2"/>
    </svg>`,
  },
  {
    id: "nameplate",
    name: "Custom Nameplate",
    category: "nameplate",
    placement: "neck",
    defaultScale: 0.4,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 14 Q50 66 84 14" fill="none" stroke="${GOLD}" stroke-width="2.4"
        stroke-linecap="round" stroke-dasharray="0.5 4"/>
      <text x="50" y="62" text-anchor="middle" font-family="'Dancing Script', cursive"
        font-size="22" fill="${GOLD}">name</text>
    </svg>`,
  },
];
