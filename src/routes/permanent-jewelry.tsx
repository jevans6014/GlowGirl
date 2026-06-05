import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { LINKS, SITE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { Sparkles } from "@/components/Sparkles";
import { EventInquiryForm } from "@/components/forms/EventInquiryForm";
const FAQS = [
  { q: "What is permanent jewelry?", a: "Permanent jewelry is clasp-free, custom jewelry welded directly onto you. No clasps, no tangles — just a seamless, timeless fit you wear until you choose to take it off." },
  { q: "Does it hurt?", a: "Not at all. The welder is heatless on your skin — it only fuses the chain. Most clients say they feel nothing." },
  { q: "Can I shower or swim in it?", a: "Yes. Our pieces are tarnish-free stainless steel, gold-filled, and sterling silver options — all waterproof and built for everyday life." },
  { q: "How do I remove it?", a: "Easily — just snip the chain with scissors. Bring it back any time and we'll re-weld it for you." },
  { q: "How long does an appointment take?", a: "Most appointments are 20–40 minutes. Walk-ins are welcome, but appointments guarantee your spot." },
];
export default function PermanentJewelryPage() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden py-24 sm:py-32">
        <Sparkles count={16} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Since 2018</span>
          <h1 className="font-display font-light text-5xl sm:text-7xl mt-4 text-balance">
            The <span className="italic text-pink-deep">Keep Glowing Girl</span> Experience
          </h1>
          <p className="mt-6 text-lg text-mid-gray max-w-2xl mx-auto">
            Choose your chain. Pick your charms. We weld it on — and you glow forever.
          </p>
          <Link to={LINKS.bookAppointment} className="btn-primary mt-8">
            Book Your Appointment
          </Link>
        </div>
      </section>
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display font-light text-4xl text-center">Frequently Asked</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => <FAQ key={i} {...f} />)}
          </div>
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Private Events</span>
            <h2 className="font-display font-light text-4xl sm:text-5xl mt-3 text-balance">
              Host up to 14 guests. <span className="italic">Or we come to you.</span>
            </h2>
            <p className="mt-5 text-mid-gray leading-relaxed">
              Bachelorettes, birthdays, brand activations, girls' nights — the studio (or your space)
              becomes a permanent-jewelry experience your guests will never forget.
            </p>
            <ul className="mt-6 space-y-2 text-charcoal text-[15px]">
              <li>· Up to 14 guests in-studio</li>
              <li>· Mobile events anywhere in the Charlotte area</li>
              <li>· Complimentary water & wine</li>
              <li>· Custom party favors available</li>
            </ul>
            <p className="mt-6 text-sm text-mid-gray">
              {SITE.address} · {SITE.phone}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="bg-cream rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-2xl mb-4">Inquire About an Event</h3>
              <EventInquiryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-lg">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-gold">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-mid-gray leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}