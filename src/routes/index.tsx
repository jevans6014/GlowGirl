import {
  Hero, Marquee, Experience, Collections, Explainer,
  Reviews, StudioInfo, JewelryMadeBoss, InstagramTeaser, Newsletter,
} from "@/components/home/sections";
import { useSEO } from "@/hooks/useSEO";
import { SITE } from "@/lib/site";

export default function Index() {
  useSEO({
    title: "Charlotte's Girliest Permanent Jewelry & Café",
    description: SITE.description,
    path: "/",
  });
  return (
    <>
      <Hero />
      <Marquee />
      <Experience />
      <Collections />
      <Explainer />
      <Reviews />
      <StudioInfo />
      <JewelryMadeBoss />
      <InstagramTeaser />
      <Newsletter />
    </>
  );
}
