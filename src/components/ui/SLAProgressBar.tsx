import { cn } from "@/lib/cn";

/** Linear countdown against the 30-day statutory response window — a real
 * countdown, not decorative (see RTI_ACT_REFERENCE.responseWindowDays). */
export function SLAProgressBar({
  daysLeft,
  progress,
  status,
  expectedByLabel,
}: {
  daysLeft: number;
  progress: number;
  status: "default" | "warning" | "error";
  expectedByLabel: string;
}) {
  const fillColor =
    status === "error" ? "bg-[#db372d]" : status === "warning" ? "bg-[#fa8c16]" : "bg-accent-600";

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label={`SLA progress — ${daysLeft} days left of the 30-day statutory window`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-1.5">
        <span className="text-sm font-semibold text-neutral-900">
          {daysLeft === 0 ? "Past the 30-day statutory window" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
        </span>
        <span className="font-mono text-xs text-neutral-500">Expected by {expectedByLabel}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
        <div
          className={cn("h-full rounded-full transition-[width]", fillColor)}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
