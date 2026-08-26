"use client";

import { useEffect } from "react";

/** Figma's "send to Figma" (html-to-design) capture widget — local
 * development only, never shipped to production users. The NODE_ENV check
 * is a build-time constant in Next.js, so the whole branch is dead-code-
 * eliminated from production bundles (verified via `npm run build` +
 * grepping .next/ for "html-to-design", per the setup this mirrors). Lives
 * in a client component's useEffect rather than a raw <script> tag in
 * layout's markup, so it can never render into a production response
 * regardless of env — a tag in JSX ships either way. */
export function FigmaCaptureDev() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const script = document.createElement("script");
      script.src = "https://mcp.figma.com/mcp/html-to-design/capture.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
