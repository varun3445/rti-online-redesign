import { cn } from "@/lib/cn";
import type { CaseLifecycleState } from "@/lib/rti-case.schema";
import { STATE_TOKEN } from "@/lib/case-status";

type TonalVariant = "info" | "success" | "warning" | "error" | "neutral" | "primary";

const TONAL_CLASSES: Record<TonalVariant, string> = {
  info: "bg-[#c9f7f2] text-[#006d75]", // ux4g cyan-100 / cyan-800
  success: "bg-[#ddf8d8] text-[#00522c]", // ux4g green-100 / green-800
  warning: "bg-[#ffe7bf] text-[#ad4e00]", // ux4g orange-100 / orange-800
  error: "bg-[#ffecee] text-[#8a1a16]", // ux4g red-100 / red-800
  neutral: "bg-neutral-100 text-neutral-700",
  primary: "bg-accent-50 text-accent-700",
};

const BASE = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium";

/** Pill tag. Two independent color modes:
 * - `status`: one of the 6 real CaseLifecycleState values, colored from the
 *   per-state CSS custom properties in globals.css (one distinct real UX4G
 *   hue each — see STATE_TOKEN in case-status.ts).
 * - `tonal`: a fixed small set of generic semantic colors, for non-case
 *   uses (the chat "Answered by OpenAI" tag, "MOCK PAYMENT" banners). */
export function Tag({
  status,
  tonal,
  outline,
  className,
  children,
}: {
  status?: CaseLifecycleState;
  tonal?: TonalVariant;
  outline?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (status) {
    const token = STATE_TOKEN[status];
    return (
      <span
        className={cn(BASE, className)}
        style={{
          background: `var(--color-status-${token}-bg)`,
          color: `var(--color-status-${token}-fg)`,
        }}
      >
        {children}
      </span>
    );
  }

  if (outline) {
    return (
      <span className={cn(BASE, "border border-neutral-300 text-neutral-700 bg-transparent", className)}>
        {children}
      </span>
    );
  }

  return <span className={cn(BASE, TONAL_CLASSES[tonal ?? "neutral"], className)}>{children}</span>;
}
