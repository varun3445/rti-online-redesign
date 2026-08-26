import { cn } from "@/lib/cn";

const TONE_CLASSES = {
  default: "border-neutral-300 border-t-accent-600",
  // For use inside a solid accent-600 button (SearchComposer's submit
  // button while searching) — the default tone would be invisible against
  // that same purple fill.
  "on-accent": "border-white/30 border-t-white",
};

/** Small loading spinner — chat's ThreadTyping indicator, and
 * SearchComposer's in-flight search state. */
export function Spinner({ size = 16, tone = "default" }: { size?: number; tone?: keyof typeof TONE_CLASSES }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block animate-spin rounded-full border-2", TONE_CLASSES[tone])}
      style={{ width: size, height: size }}
    />
  );
}
