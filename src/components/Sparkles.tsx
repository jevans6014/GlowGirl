import { useMemo } from "react";
// Floating golden orbs / sparkle dots for hero background
export function Sparkles({ count = 18 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        duration: 14 + Math.random() * 18,
        delay: -Math.random() * 20,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="animate-float absolute rounded-full bg-gold"
          style={{
            left: `${d.left}%`,
            bottom: "-20px",
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            boxShadow: "0 0 10px rgba(201, 169, 112, 0.7)",
          }}
        />
      ))}
    </div>
  );
}