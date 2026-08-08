import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional pages: no SEO value, and every visitor's cart/checkout
      // state is different, so they'd otherwise show up as thin/duplicate
      // content. Matches under both locale prefixes.
      disallow: ["/api/", "/*/cart", "/*/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
