const ITEMS = [
  "PERMANENT JEWELRY",
  "CUSTOM CHAINS",
  "250+ CHARMS",
  "ENGRAVED JEWELRY",
  "GLOWGIRL CAFÉ",
  "PRIVATE EVENTS",
  "WALK-INS WELCOME",
  "GOLD",
  "SILVER",
  "ROSE GOLD",
];
export function Marquee() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-pink-blush text-white overflow-hidden py-5 border-y border-pink-deep/20">
      <div className="flex animate-marquee whitespace-nowrap font-display italic text-2xl sm:text-3xl">
        {loop.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            {item}
            <span className="text-pink-pale">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}