import type { RtiCase } from "@/lib/rti-case.schema";
import { STATE_LABEL, headlineState, summaryLine } from "@/lib/case-status";
import { RTI_ACT_REFERENCE, formatDate } from "@/lib/rti-knowledge-base";
import { Card } from "./Card";
import { Tag } from "./Tag";
import { Alert } from "./Alert";
import { SLAProgressBar } from "./SLAProgressBar";
import { Timeline } from "./Timeline";

const MS_PER_DAY = 86_400_000;

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / MS_PER_DAY);
}

function expectedByDate(submittedAt: string): string {
  const due = new Date(submittedAt);
  due.setDate(due.getDate() + RTI_ACT_REFERENCE.responseWindowDays);
  return formatDate(due);
}

/** SLA countdown against the real Section 7(1) statutory window. */
function slaFor(rtiCase: RtiCase) {
  const elapsed = daysSince(rtiCase.submittedAt);
  const windowDays = RTI_ACT_REFERENCE.responseWindowDays;
  const daysLeft = Math.max(0, windowDays - elapsed);
  const progress = Math.min(100, Math.max(0, (elapsed / windowDays) * 100));
  const status = daysLeft === 0 ? "error" : daysLeft <= 5 ? "warning" : "default";
  return { daysLeft, progress, status } as const;
}

/** One case's full card — header, status tag, SLA countdown, sub-record
 * list (the multi-department split — the product's core differentiator),
 * and journey timeline. Extracted from CaseList so it can be reused (and
 * previewed) standalone; CaseList is now a thin .map() wrapper over this. */
export function CaseCard({ rtiCase }: { rtiCase: RtiCase }) {
  const headline = headlineState(rtiCase);
  const isOpen = headline !== "responded" && headline !== "returned-to-applicant";
  const sla = slaFor(rtiCase);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide text-neutral-400">Reference Number</div>
            <div className="font-mono text-sm text-neutral-900">{rtiCase.id}</div>
          </div>
          <div className="h-9 w-px bg-neutral-200" aria-hidden="true" />
          <div>
            <div className="font-mono text-xs uppercase tracking-wide text-neutral-400">Department</div>
            <div className="text-sm font-medium text-neutral-900">{rtiCase.authority.name}</div>
          </div>
        </div>
        <Tag status={headline}>{STATE_LABEL[headline]}</Tag>
      </div>

      <h2 className="text-base font-semibold text-neutral-900">{rtiCase.subject}</h2>

      <p className="text-sm text-neutral-600">{summaryLine(rtiCase)}</p>

      {isOpen && (
        <SLAProgressBar
          daysLeft={sla.daysLeft}
          progress={sla.progress}
          status={sla.status}
          expectedByLabel={expectedByDate(rtiCase.submittedAt)}
        />
      )}

      {headline === "responded" && (
        <Alert variant="success">Response issued — please check your email for the documents.</Alert>
      )}

      {rtiCase.subRecords.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rtiCase.subRecords.map((sub) => (
            <li key={sub.id} className="flex items-center gap-2 text-sm text-neutral-700">
              <Tag status={sub.state}>{STATE_LABEL[sub.state]}</Tag>
              {sub.authority.name}
            </li>
          ))}
        </ul>
      )}

      <div>
        <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Timeline</h3>
        <Timeline events={rtiCase.events} />
      </div>
    </Card>
  );
}
