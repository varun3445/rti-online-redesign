import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Noto_Sans } from "next/font/google";
import { FigmaCaptureDev } from "@/components/FigmaCaptureDev";
import "./globals.css";

// Body face — UX4G's own font-family-base ("Noto Sans", system-ui,
// sans-serif). We're dropping the ux4g-web-components package itself (its
// component CSS/JS), but keeping its actual design tokens — colors and
// this font — rather than inventing new ones. Self-hosted via
// next/font/google so it stays reliably resolvable (real family name, not
// a generic fallback) when the live site is captured into Figma.
const bodyFont = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Display face for hero/section headlines only — UX4G's own Noto Sans
// still drives every component, form, and body of text. Two weights only
// (not the full variable range) to keep the payload down for the mobile
// data plans a lot of RTI Online's real user base is on.
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

// Label/data face — eyebrows, badges, reference numbers, timestamps. Reads
// as "structured, verifiable record," which mirrors what the product
// actually does (plain language in, formatted request out). One weight
// only; same mobile-payload reasoning as the display face above.
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RTI Online BWMI 26",
  description: "RTI Online portal for Build What Moves India 2026 by Varun Srivathsan.",
  icons: {
    icon: "https://cdn.ux4g.gov.in/UX4G@3.0.18/assets/images/national_emblem.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <FigmaCaptureDev />
        {children}
      </body>
    </html>
  );
}
