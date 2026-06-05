import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
export default function ContactPage() {
  return (
    <>
      <section className="hero-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-display font-light text-5xl sm:text-7xl text-balance">Say hi 💌</h1>
          <p className="mt-5 text-mid-gray">We usually respond within one business day.</p>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-5 text-charcoal">
              <Item icon={MapPin} title="Visit">{SITE.address}</Item>
              <Item icon={Clock} title="Hours">{SITE.hours}</Item>
              <Item icon={Phone} title="Call"><a href={`tel:${SITE.phone}`} className="story-link">{SITE.phone}</a></Item>
              <Item icon={Mail} title="Email"><a href={`mailto:${SITE.email}`} className="story-link">{SITE.email}</a></Item>
            </div>
            <div className="rounded-3xl overflow-hidden mt-8 h-64 shadow-[var(--shadow-card)]">
              <iframe title="Map" src={SITE.mapsEmbed} loading="lazy" className="w-full h-full border-0" />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-3xl mb-6">Send a message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
function Item({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl p-5">
      <span className="w-10 h-10 rounded-full bg-pink-pale flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gold" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-widest text-mid-gray">{title}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}