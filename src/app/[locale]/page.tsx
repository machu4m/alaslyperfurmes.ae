import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { BestsellersCarousel } from "@/components/home/bestsellers-carousel";
import { StoryTeaser } from "@/components/home/story-teaser";
import { WhyUs } from "@/components/home/why-us";
import { getFeaturedProducts } from "@/lib/queries";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const bestsellers = await getFeaturedProducts(8);

  return (
    <>
      <Hero />
      <WhyUs />
      <BestsellersCarousel products={bestsellers} />
      <StoryTeaser />
    </>
  );
}
