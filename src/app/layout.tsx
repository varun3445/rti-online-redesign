import type { Metadata } from "next";
import "ux4g-web-components/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "RTI Online Redesign",
  description: "Mock RTI case-tracking prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
