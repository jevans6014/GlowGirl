import { Reveal } from "@/components/Reveal";
import { EventInquiryForm } from "@/components/forms/EventInquiryForm";
import { SITE } from "@/lib/site";
export default function EventsPage() {
  return (
    <>
      <section className="hero-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Private Events</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            Make your party <span className="italic text-pink-deep">permanent</span>.
          </h1>
          <p className="mt-6 text-mid-gray text-lg max-w-xl mx-auto">
            Up to 14 guests in-studio. Or we bring the glow to you anywhere in the Charlotte area.
          </p>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-3xl mb-2">Tell us about your event</h2>
              <p className="text-mid-gray mb-6 text-sm">
                We'll respond within one business day with availability and pricing.
              </p>
              <EventInquiryForm />
              <p className="text-center text-xs text-mid-gray mt-6">
                Prefer to call? {SITE.phone}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}