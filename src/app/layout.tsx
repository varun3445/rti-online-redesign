import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { FigmaCaptureDev } from "@/components/FigmaCaptureDev";
import "ux4g-web-components/styles.css";
import "./globals.css";

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
  title: "RTI Online Redesign",
  description: "Mock RTI case-tracking prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body>
        <FigmaCaptureDev />
        {children}
      </body>
    </html>
  );
}
