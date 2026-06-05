import {
  Hero, Marquee, Experience, Collections, Explainer,
  Reviews, StudioInfo, JewelryMadeBoss, InstagramTeaser, Newsletter,
} from "@/components/home/sections";

export default function Index() {
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
