import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { BestsellersCarousel } from "@/components/home/bestsellers-carousel";
import { StoryTeaser } from "@/components/home/story-teaser";
import { WhyUs } from "@/components/home/why-us";
import { getFeaturedProducts } from "@/lib/queries";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const l = locale as Locale;
  return {
    title:
      l === "ar"
        ? "الأصلي | عطور أصلية في دبي والإمارات"
        : "Al Asly | Authentic Perfumes in Dubai, UAE",
    description:
      l === "ar"
        ? "مجموعة مُنتقاة بعناية من العطور الأصلية، الماركات العالمية والنيش، مصدرها مباشرة من موزعين معتمدين في دبي."
        : "A hand-picked edit of authentic branded and niche perfumes, sourced directly from authorized dealers in Dubai, UAE.",
    alternates: buildAlternates(l, "/"),
  };
}

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
