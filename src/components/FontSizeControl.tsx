"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    ux4g?: { init?: (root: Document) => void };
  }
}

type Scale = "sm" | "md" | "lg";
const STORAGE_KEY = "rti-font-scale";

export function FontSizeControl() {
  const [scale, setScale] = useState<Scale>("md");

  useEffect(() => {
    // Injects the UX4G runtime (accordions, dropdowns, tabs, etc). Deferred
    // to a post-mount effect rather than a module-level import — importing
    // it at module-eval time ran initRuntime() while React was still
    // hydrating this same subtree, and its DOM mutations (marking icons
    // `data-ux4g-init="true"`) raced React's hydration and broke it.
    //
    // The module's own first init() pass can still miss elements that were
    // already in the DOM before the (async) module finished loading — its
    // MutationObserver only catches DOM changes *after* it starts watching.
    // Force one explicit full-document re-scan once the module is ready, so
    // every interactive element already on the page (dropdowns, accordions)
    // gets wired up, not just ones added afterward.
    import("ux4g-web-components/design-system").then(() => {
      window.ux4g?.init?.(document);
    });
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Scale | null;
    if (stored === "sm" || stored === "md" || stored === "lg") {
      setScale(stored);
      document.documentElement.setAttribute("data-font-scale", stored);
    }
  }, []);

  function apply(next: Scale) {
    setScale(next);
    document.documentElement.setAttribute("data-font-scale", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div
      aria-label="Text size controls"
      className="ux4g-topbar__group ux4g-d-flex ux4g-ai-center"
      role="group"
    >
      <button
        type="button"
        className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
        onClick={() => apply("sm")}
        aria-pressed={scale === "sm"}
        aria-label="Decrease text size"
      >
        <span className="ux4g-icon-outlined ux4g-top-bar-icon">text_decrease</span>
      </button>
      <button
        type="button"
        className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
        onClick={() => apply("md")}
        aria-pressed={scale === "md"}
        aria-label="Reset text size"
      >
        <span className="ux4g-icon-outlined ux4g-top-bar-icon">font_download</span>
      </button>
      <button
        type="button"
        className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
        onClick={() => apply("lg")}
        aria-pressed={scale === "lg"}
        aria-label="Increase text size"
      >
        <span className="ux4g-icon-outlined ux4g-top-bar-icon">text_increase</span>
      </button>
    </div>
  );
}
