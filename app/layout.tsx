import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Toaster } from "sonner";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://elkasimluxury.com"),
  title: {
    default: "EL•KASIM LUXURY — Global Fashion World",
    template: "%s — EL•KASIM LUXURY",
  },
  description:
    "EL•KASIM LUXURY is a Nigerian streetwear house crafting minimal, editorial menswear and accessories. Shop the current collection.",
  openGraph: {
    title: "EL•KASIM LUXURY — Global Fashion World",
    description:
      "Minimal, monochrome, premium streetwear out of Lagos. Shop the current collection.",
    siteName: "EL•KASIM LUXURY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[60vh] pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileTabBar />
          <Toaster position="top-center" theme="light" />
        </Providers>
      </body>
    </html>
  );
}
