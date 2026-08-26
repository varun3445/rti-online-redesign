import { Icon } from "./Icon";
import { FontSizeControl } from "@/components/FontSizeControl";

/** Government of India link + font-size control + language selector —
 * extracted from Nav's top utility strip. */
export function AccessibilityBar() {
  return (
    <div className="border-b border-neutral-200 bg-accent-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:text-xs">
          Skip to Main Content
        </a>
        <a
          aria-label="Government of India (opens in new tab)"
          className="flex items-center gap-1 text-xs"
          href="https://www.india.gov.in/"
          target="_blank"
          rel="noopener"
        >
          Government of India
          <Icon name="open_in_new" size={14} />
        </a>
        <div className="flex items-center gap-3">
          <FontSizeControl />
          <span className="h-4 w-px bg-white/30" aria-hidden="true" />
          <span className="flex items-center gap-1 text-xs">
            <Icon name="language" size={14} />
            English
          </span>
        </div>
      </div>
    </div>
  );
}
