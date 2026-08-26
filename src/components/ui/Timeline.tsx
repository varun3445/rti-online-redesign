import { Fragment } from "react";
import { Icon } from "./Icon";
import { Tag } from "./Tag";
import type { CaseLifecycleState } from "@/lib/rti-case.schema";
import { STATE_LABEL } from "@/lib/case-status";

type TimelineEvent = { occurredAt: string; state: CaseLifecycleState; message: string };

/** Horizontal milestone timeline — node circles connected by a line, a
 * date/title/status card below each. The last event is "active" (open
 * ring), earlier ones "completed" (filled, checkmarked) — matches the
 * data model, which only ever records events that already happened.
 * Horizontal-scrolls on narrow viewports rather than compressing. */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-start" style={{ minWidth: "fit-content" }}>
        {events.map((event, i) => {
          const isLast = i === events.length - 1;
          return (
            <Fragment key={i}>
              <div
                className="flex min-w-36 flex-col items-start gap-3"
                style={{ flex: isLast ? "0 0 auto" : "1 1 0%" }}
              >
                <div
                  className={
                    isLast
                      ? "flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent-600 bg-white text-accent-600"
                      : "flex h-7 w-7 items-center justify-center rounded-full bg-accent-600 text-white"
                  }
                >
                  <Icon name="check" size={16} />
                </div>
                <div className="rounded-xl bg-white p-3 shadow-[0_0_0_1px_var(--color-neutral-200)]">
                  <div className="font-mono text-xs text-neutral-500">
                    {new Date(event.occurredAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="mt-1 text-sm font-medium text-neutral-900">{event.message}</div>
                  <Tag status={event.state} className="mt-2">
                    {STATE_LABEL[event.state]}
                  </Tag>
                </div>
              </div>
              {!isLast && <div className="mt-3.5 h-0.5 min-w-8 flex-1 bg-neutral-200" />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
