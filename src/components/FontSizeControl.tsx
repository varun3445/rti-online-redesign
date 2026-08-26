"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

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
    <div aria-label="Text size controls" className="flex items-center gap-1" role="group">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
        onClick={() => apply("sm")}
        aria-pressed={scale === "sm"}
        aria-label="Decrease text size"
      >
        <Icon name="remove" size={16} />
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
        onClick={() => apply("md")}
        aria-pressed={scale === "md"}
        aria-label="Reset text size"
      >
        <Icon name="font_download" size={16} />
      </button>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
        onClick={() => apply("lg")}
        aria-pressed={scale === "lg"}
        aria-label="Increase text size"
      >
        <Icon name="add" size={16} />
      </button>
    </div>
  );
}
