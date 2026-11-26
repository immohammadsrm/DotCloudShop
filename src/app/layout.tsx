import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import CursorEffects from "@/components/CursorEffects";
import FuturisticBackground from "@/components/FuturisticBackground";
import LiveSales from "@/components/LiveSales";
import ChatWidget from "@/components/ChatWidget";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: site.title, description: site.description, url: site.url, siteName: site.name, type: "website" },
  // Site-wide noindex while site.indexing is false (see src/lib/site.ts)
  ...(site.indexing ? {} : { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
};

export const viewport: Viewport = { themeColor: "#0a0a0c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="bg-ink font-sans text-white">
        <FuturisticBackground />
        <CartProvider>
          <Header />
          <main className="relative">{children}</main>
          <Footer />
          <ScrollEffects />
          <LiveSales />
          <ChatWidget />
          <CursorEffects />
        </CartProvider>
      </body>
    </html>
  );
}
