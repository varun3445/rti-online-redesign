import { useState } from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import { VoiceComposer } from "./VoiceComposer";
import { cn } from "@/lib/cn";

type Size = "lg" | "md";

const SIZE = {
  // Full text-lg only kicks in at desktop widths — mobile and tablet get a
  // smaller size so the placeholder/typed text doesn't get cramped or
  // clipped next to the leading icon and submit button at narrower widths.
  lg: { height: "h-16", pad: "pl-6 pr-2", text: "text-base lg:text-lg", btn: "h-12 w-12", icon: 22 },
  // Bigger on tablet/desktop (sm+) — mobile stays compact so it doesn't
  // dominate a narrow screen, but on larger viewports this reads too
  // small next to the rest of the site's scale at the default size.
  md: {
    height: "h-12 sm:h-14",
    pad: "pl-4 pr-1.5 sm:pl-5 sm:pr-2",
    text: "text-[0.9375rem] sm:text-base",
    btn: "h-9 w-9 sm:h-11 sm:w-11",
    icon: 20,
  },
};

/** Pill search/composer bar — leading icon, text input, circular accent
 * submit button. Used at hero scale (home) and inline scale (chat
 * follow-up, view-status search). */
export function SearchComposer({
  size = "md",
  leadingIcon = "search",
  value,
  onChange,
  onSubmit,
  placeholder,
  submitIcon = "arrow_forward",
  submitLabel = "Submit",
  disabled,
  loading = false,
  className,
  inputProps,
  voice = false,
  tone = "light",
}: {
  size?: Size;
  leadingIcon?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  submitIcon?: string;
  submitLabel?: string;
  disabled?: boolean;
  /** Swaps the submit icon for a spinner and marks the form busy — for an
   * in-flight search/lookup, distinct from `disabled` (which a caller may
   * also set for other reasons). */
  loading?: boolean;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Adds a Text/Voice mode toggle. Voice mode is purely visual — an
   * orb + "Coming soon" label, no microphone access — so this is safe to
   * show unconditionally rather than gated on browser API support. */
  voice?: boolean;
  /** "light" (default) is the solid-white pill used on light pages.
   * "dark" swaps it for the same translucent white-on-gradient treatment
   * as the voice panel's own chips, for composers that sit directly on a
   * dark/gradient background (the home hero). */
  tone?: "light" | "dark";
}) {
  const s = SIZE[size];
  const [mode, setMode] = useState<"text" | "voice">("text");

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      {mode === "voice" ? (
        <VoiceComposer />
      ) : (
        <form
          onSubmit={onSubmit}
          aria-busy={loading}
          className={cn(
            "flex w-full items-center rounded-full",
            tone === "dark" ? "border border-white/25 bg-white/10" : "bg-white shadow-[0_8px_24px_rgb(0_0_0_/_0.12)]",
            s.height,
            s.pad
          )}
        >
          <Icon name={leadingIcon} className={cn("mr-2", tone === "dark" ? "text-white" : "text-accent-600")} size={s.icon} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent outline-none",
              tone === "dark" ? "text-white placeholder:text-white/60" : "text-neutral-900 placeholder:text-neutral-400",
              s.text
            )}
            {...inputProps}
          />
          <button
            type="submit"
            disabled={disabled}
            aria-label={loading ? "Searching…" : submitLabel}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-700 disabled:opacity-50",
              s.btn
            )}
          >
            {loading ? <Spinner size={s.icon - 2} tone="on-accent" /> : <Icon name={submitIcon} size={s.icon} className="text-white" />}
          </button>
        </form>
      )}

      {voice && (
        <div className="mt-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("text")}
            aria-pressed={mode === "text"}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              mode === "text" ? "bg-white text-accent-700" : "text-white/70 hover:text-white"
            )}
          >
            Text mode
          </button>
          <button
            type="button"
            onClick={() => setMode("voice")}
            aria-pressed={mode === "voice"}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              mode === "voice" ? "bg-white text-accent-700" : "text-white/70 hover:text-white"
            )}
          >
            Voice mode
          </button>
        </div>
      )}
    </div>
  );
}
