import { Instagram } from "lucide-react";

const INSTAGRAM_IMAGES = [
  "/images/glowgirl_004.jpg",
  "/images/glowgirl_006.jpg",
  "/images/glowgirl_020.png",
  "/images/glowgirl_032.png",
  "/images/glowgirl_040.png",
  "/images/glowgirl_008.jpg",
];

export function InstagramFeed() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-pink-blush/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Follow Our Journey
          </h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto mb-6">
            See the latest sparkle, styles, and behind-the-scenes moments from our studio
          </p>
          <a
            href="https://www.instagram.com/glowgirl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition font-medium"
          >
            <Instagram className="w-5 h-5" />
            Follow @glowgirl
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_IMAGES.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/glowgirl"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-pink-blush/20 to-gold/20"
            >
              <img
                src={src}
                alt={`GLOWGIRL Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
