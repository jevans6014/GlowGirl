import { Link } from "react-router-dom";
import { JewelryMadeBoss } from "@/components/home/sections";
import { LINKS } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
export default function JewelryMadeBossPage() {
  return (
    <>
      <JewelryMadeBoss />
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="bg-white rounded-3xl p-8 h-full">
              <h3 className="font-display text-3xl">The eBook</h3>
              <p className="mt-3 text-mid-gray">
                <em>Becoming a Jewelry Boss</em> — the full playbook from sourcing to selling.
              </p>
              <Link to={LINKS.ebook} className="btn-primary mt-6">Get It Now — $80</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white rounded-3xl p-8 h-full">
              <h3 className="font-display text-3xl">The Community</h3>
              <p className="mt-3 text-mid-gray">
                Join thousands of jewelry entrepreneurs sharing wins, lessons, and resources.
              </p>
              <a href={LINKS.facebookGroup} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6">Join the Facebook Group</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}