"use client";

import { useEffect, useState } from "react";

type Scale = "sm" | "md" | "lg";
const STORAGE_KEY = "rti-font-scale";

export function FontSizeControl() {
  const [scale, setScale] = useState<Scale>("md");

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
    <div className="font-size-control" role="group" aria-label="Text size">
      <button
        type="button"
        className={scale === "sm" ? "is-active" : ""}
        onClick={() => apply("sm")}
        aria-pressed={scale === "sm"}
        aria-label="Smaller text"
      >
        A&minus;
      </button>
      <button
        type="button"
        className={scale === "md" ? "is-active" : ""}
        onClick={() => apply("md")}
        aria-pressed={scale === "md"}
        aria-label="Default text size"
      >
        A
      </button>
      <button
        type="button"
        className={scale === "lg" ? "is-active" : ""}
        onClick={() => apply("lg")}
        aria-pressed={scale === "lg"}
        aria-label="Larger text"
      >
        A+
      </button>
    </div>
  );
}
