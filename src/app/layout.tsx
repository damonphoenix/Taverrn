import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { ConditionalChrome } from "@/components/ConditionalChrome";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://brewery.phx.cx";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brewery - Brew your files",
    template: "%s | Brewery",
  },
  description:
    "Drop your ingredients on the bar. We brew them into new formats - right in your browser. No data ever leaves your device.",
  keywords: ["file converter", "convert files", "privacy", "browser", "client-side", "WASM"],
  authors: [{ name: "Brewery" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Brewery - Brew your files",
    description:
      "Drop your ingredients on the bar. We brew them into new formats - right in your browser. No data ever leaves your device.",
    siteName: "Brewery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brewery - Brew your files",
    description:
      "Drop your ingredients on the bar. We brew them into new formats - right in your browser.",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Brewery",
  description:
    "Client-side file conversion. Drop your ingredients on the bar; we brew them into new formats in your browser. No data ever leaves your device.",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
