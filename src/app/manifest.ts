import type { MetadataRoute } from "next";

/** Web app manifest. Icons and colours come from the brand kit —
 *  see docs/BRAND.md §4 and public/brand/README.md. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Al Asly | الأصلي",
    short_name: "Al Asly",
    description:
      "Authentic branded and niche perfumes, sourced through authorised channels in Dubai, UAE.",
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#171717",
    icons: [
      { src: "/brand/icon/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/icon/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/icon/icon-512.png", type: "image/png", sizes: "512x512" },
      {
        src: "/brand/icon/icon-maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
