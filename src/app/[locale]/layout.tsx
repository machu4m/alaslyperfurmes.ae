import type { Metadata } from "next";
import { Amiri, Manrope, Playfair_Display, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
// Manrope is the logotype's own face, so the interface and the logo share a
// skeleton. See docs/BRAND.md §5.1.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-arabic-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Al Asly | الأصلي — Authentic Perfumes in Dubai, UAE",
    template: "%s | Al Asly",
  },
  description:
    "A hand-picked edit of authentic branded and niche perfumes, sourced directly from authorized dealers in Dubai, UAE.",
  applicationName: "Al Asly",
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "Al Asly",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  // Warm, not blue-black: the browser chrome should match the brand ground.
  other: { "color-scheme": "light" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = localeDirection[locale as Locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${manrope.variable} ${amiri.variable} ${tajawal.variable}`}
    >
      <body
        className={
          locale === "ar" ? "font-arabicBody" : "font-sans"
        }
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
