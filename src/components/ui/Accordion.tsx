"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** Plain useState-driven accordion — replaces UX4G's runtime-dependent
 * data-ux-toggle="collapse" mechanism with no equivalent needed once
 * ux4g-web-components is gone. Single-open (one item expanded at a time). */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-neutral-200 rounded-2xl shadow-[0_0_0_1px_var(--color-neutral-200)]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.9375rem] font-medium text-neutral-900"
              >
                {item.q}
                <Icon
                  name="arrow_forward"
                  className={`shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>
            </h3>
            {isOpen && (
              <div id={`faq-panel-${i}`} className="px-5 pb-4 text-sm text-neutral-600">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
