import type { Metadata } from "next";
import { Amiri, Inter, Playfair_Display, Tajawal } from "next/font/google";
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
const inter = Inter({
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
  title: {
    default: "Alasly | الأصلي — Arabian Perfumery",
    template: "%s | Alasly",
  },
  description:
    "Handcrafted Arabian perfumes for the modern GCC. Oud, floral, fresh and oriental fragrances, shipped across the Gulf.",
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
      className={`${playfair.variable} ${inter.variable} ${amiri.variable} ${tajawal.variable}`}
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
