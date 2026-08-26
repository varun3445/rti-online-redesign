import type { CaseLifecycleState, RtiCase } from "@/lib/rti-case.schema";

export const STATE_LABEL: Record<CaseLifecycleState, string> = {
  submitted: "Submitted",
  forwarded: "In progress",
  responded: "Responded",
  "additional-payment-required": "Payment needed",
  "returned-to-applicant": "Needs your attention",
  "transferred-to-other-authority": "Transferred",
};

// CSS custom-property suffix per state — see globals.css status tokens.
export const STATE_TOKEN: Record<CaseLifecycleState, string> = {
  submitted: "submitted",
  forwarded: "forwarded",
  responded: "responded",
  "additional-payment-required": "additional-payment",
  "returned-to-applicant": "returned",
  "transferred-to-other-authority": "transferred",
};

// UX4G Tag semantic variant per state — `ux4g-tag-tonal-{variant}`.
export const STATE_TAG_VARIANT: Record<CaseLifecycleState, string> = {
  submitted: "info",
  forwarded: "warning",
  responded: "success",
  "additional-payment-required": "warning",
  "returned-to-applicant": "error",
  "transferred-to-other-authority": "info",
};

// Lower number = more urgent / more deserving of being the headline status
// when a case has fragmented into multiple sub-records.
const URGENCY_RANK: Record<CaseLifecycleState, number> = {
  "returned-to-applicant": 0,
  "additional-payment-required": 1,
  forwarded: 2,
  "transferred-to-other-authority": 3,
  submitted: 4,
  responded: 5,
};

/** The single state to show as the headline badge for a case, even if it's
 * fragmented into multiple sub-records under different departments. */
export function headlineState(rtiCase: RtiCase): CaseLifecycleState {
  if (rtiCase.subRecords.length === 0) return rtiCase.state;
  return [...rtiCase.subRecords].sort(
    (a, b) => URGENCY_RANK[a.state] - URGENCY_RANK[b.state]
  )[0].state;
}

/** One plain-language line summarizing a case, collapsing any fragmentation
 * into a single readable sentence instead of a list of registration numbers. */
export function summaryLine(rtiCase: RtiCase): string {
  if (rtiCase.subRecords.length === 0) {
    return STATE_LABEL[rtiCase.state];
  }
  const counts = new Map<CaseLifecycleState, number>();
  for (const sub of rtiCase.subRecords) {
    counts.set(sub.state, (counts.get(sub.state) ?? 0) + 1);
  }
  const parts = [...counts.entries()]
    .sort((a, b) => URGENCY_RANK[a[0]] - URGENCY_RANK[b[0]])
    .map(([state, count]) => `${count} ${STATE_LABEL[state].toLowerCase()}`);
  return `Split across ${rtiCase.subRecords.length} offices — ${parts.join(", ")}`;
}
