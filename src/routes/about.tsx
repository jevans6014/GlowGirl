import { Reveal } from "@/components/Reveal";
import { Instagram } from "lucide-react";

const VALUES = [
  { t: "Quality", b: "Tarnish-free, waterproof, built to last through every season of your life." },
  { t: "Community", b: "A studio where every girl belongs — and every boss is celebrated." },
  { t: "Self-Expression", b: "30+ chains, 250+ charms — designed so your jewelry tells your story." },
  { t: "Glow", b: "Because feeling beautiful shouldn't be reserved for special occasions." },
];

const TEAM = [
  {
    name: "Founder & Creative Director",
    role: "Leading the vision",
    image: "/images/glowgirl_001.png",
    instagram: "glowgirl",
  },
  {
    name: "Studio Artist",
    role: "Permanent jewelry specialist",
    image: "/images/glowgirl_002.png",
    instagram: "glowgirl",
  },
  {
    name: "Café Manager",
    role: "Creating the vibe",
    image: "/images/glowgirl_020.png",
    instagram: "glowgirl",
  },
];
export default function AboutPage() {
  return (
    <>
      <section className="hero-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Our Story</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            Designed in the <span className="italic text-pink-deep">Queen City</span>.
          </h1>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-display italic text-2xl sm:text-3xl leading-relaxed text-charcoal text-balance">
              "Luxury, personalized, and permanent jewelry for the girls who glow."
            </p>
            <p className="mt-8 text-mid-gray leading-relaxed">
              Since 2018, our goal has been to design jewelry that revolves around <em>you</em> — and encourages you to glow.
              What started as a love letter to Charlotte's girl-energy has grown into a studio, a café, and a community
              of jewelry bosses building something all their own.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="font-display font-light text-4xl text-center">What we believe</h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i}>
                <div className="bg-white rounded-3xl p-7 h-full border-t-4 border-pink-blush">
                  <h3 className="font-display text-2xl">{v.t}</h3>
                  <p className="mt-2 text-mid-gray">{v.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display font-light text-4xl text-center mb-4">Meet the Team</h2>
            <p className="text-center text-mid-gray max-w-2xl mx-auto mb-12">
              The creative minds and warm hearts behind every piece of jewelry and every cup of coffee
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <Reveal key={i} delay={i}>
                <div className="group text-center">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-pink-blush/20 to-gold/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-xl">{member.name}</h3>
                  <p className="text-mid-gray text-sm mt-1">{member.role}</p>
                  <a
                    href={`https://www.instagram.com/${member.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition text-sm mt-2"
                  >
                    <Instagram className="w-4 h-4" />
                    @{member.instagram}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}