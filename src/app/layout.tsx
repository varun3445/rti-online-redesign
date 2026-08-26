import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
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

export const metadata: Metadata = {
  title: "RTI Online Redesign",
  description: "Mock RTI case-tracking prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={displayFont.variable}>
      <body>
        <FigmaCaptureDev />
        {children}
      </body>
    </html>
  );
}
