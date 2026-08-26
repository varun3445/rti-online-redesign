import type { RtiCase } from "@/lib/rti-case.schema";
import { STATE_LABEL, STATE_TAG_VARIANT, headlineState, summaryLine } from "@/lib/case-status";
import { RTI_ACT_REFERENCE, formatDate } from "@/lib/rti-knowledge-base";

const MS_PER_DAY = 86_400_000;

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / MS_PER_DAY);
}

function expectedByDate(submittedAt: string): string {
  const due = new Date(submittedAt);
  due.setDate(due.getDate() + RTI_ACT_REFERENCE.responseWindowDays);
  return formatDate(due);
}

/** SLA countdown against the real Section 7(1) statutory window — not a
 * decorative bar, the same 30-day figure the drafted letters cite. */
function slaFor(c: RtiCase) {
  const elapsed = daysSince(c.submittedAt);
  const windowDays = RTI_ACT_REFERENCE.responseWindowDays;
  const daysLeft = Math.max(0, windowDays - elapsed);
  const progress = Math.min(100, Math.max(0, (elapsed / windowDays) * 100));
  const status = daysLeft === 0 ? "error" : daysLeft <= 5 ? "warning" : "default";
  return { daysLeft, progress, status };
}

export function CaseList({ cases }: { cases: RtiCase[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }} className="ux4g-d-flex ux4g-flex-column ux4g-gap-m">
      {cases.map((c) => {
        const headline = headlineState(c);
        const isOpen = headline !== "responded" && headline !== "returned-to-applicant";
        const sla = slaFor(c);

        return (
          <li
            key={c.id}
            className="ux4g-result-list ux4g-result-list-v1 ux4g-shadow-l2"
          >
            <div className="ux4g-result-list-header">
              <div className="ux4g-result-list-info">
                <div className="ux4g-result-list-title-group">
                  <div className="ux4g-result-list-meta ux4g-flex-wrap">
                    <span className="rti-mono ux4g-body-xs-default ux4g-result-list-id ux4g-min-w-0">
                      <span className="rti-mono-label ux4g-text-neutral-tertiary ux4g-label-s-default ux4g-mb-2xs ux4g-d-block">
                        Reference Number
                      </span>
                      {c.id}
                    </span>
                    <span className="ux4g-divider-vertical"></span>
                    <span className="ux4g-label-m-strong ux4g-result-list-dept ux4g-min-w-0">
                      <span className="rti-mono-label ux4g-text-neutral-tertiary ux4g-label-s-default ux4g-mb-2xs ux4g-d-block">
                        Department
                      </span>
                      {c.authority.name}
                    </span>
                  </div>
                  <h2 className="ux4g-title-s-default ux4g-result-list-title">{c.subject}</h2>
                </div>
              </div>
              <div className="ux4g-result-list-actions-container ux4g-d-flex">
                <span className={`ux4g-tag-tonal-${STATE_TAG_VARIANT[headline]}`}>
                  {STATE_LABEL[headline]}
                </span>
              </div>
            </div>

            <div className="ux4g-result-list-content">
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                {summaryLine(c)}
              </p>

              {isOpen && (
                <article
                  className={`ux4g-sla-linear ux4g-sla-linear-rounded ux4g-sla-status-${sla.status} ux4g-mt-m`}
                  style={{ ["--ux4g-sla-progress" as string]: String(sla.progress) }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(sla.progress)}
                  aria-label={`SLA progress — ${sla.daysLeft} days left of the 30-day statutory window`}
                >
                  <div className="ux4g-sla-linear-body">
                    <div className="ux4g-sla-linear-head ux4g-flex-wrap ux4g-gap-3xs">
                      <div className="ux4g-sla-linear-title-wrap">
                        <span className="ux4g-label-l-strong ux4g-sla-linear-title">
                          {sla.daysLeft === 0
                            ? "Past the 30-day statutory window"
                            : `${sla.daysLeft} day${sla.daysLeft === 1 ? "" : "s"} left`}
                        </span>
                      </div>
                      <span className="rti-mono ux4g-label-s-default ux4g-text-neutral-secondary">
                        Expected by {expectedByDate(c.submittedAt)}
                      </span>
                    </div>
                    <div className="ux4g-sla-linear-track" aria-hidden="true">
                      <div className="ux4g-sla-linear-fill"></div>
                    </div>
                  </div>
                </article>
              )}

              {c.subRecords.length > 0 && (
                <ul className="ux4g-mt-s" style={{ listStyle: "none", padding: 0 }}>
                  {c.subRecords.map((sub) => (
                    <li
                      key={sub.id}
                      className="ux4g-d-flex ux4g-ai-center ux4g-gap-2xs ux4g-body-s-default ux4g-py-2xs"
                    >
                      <span className={`ux4g-tag-tonal-${STATE_TAG_VARIANT[sub.state]}`}>
                        {STATE_LABEL[sub.state]}
                      </span>
                      {sub.authority.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="ux4g-mt-m">
                <h3 className="rti-mono-label ux4g-label-s-strong ux4g-text-primary">Timeline</h3>
                <div className="ux4g-journey-timeline ux4g-journey-timeline--vertical ux4g-mt-s">
                  {c.events.map((event, i) => (
                    <div
                      key={i}
                      className={`ux4g-journey-step${i === c.events.length - 1 ? " ux4g-journey-step-active" : " ux4g-journey-step-completed"}`}
                    >
                      <div className="ux4g-journey-indicator">
                        <span className="ux4g-icon-outlined">check</span>
                      </div>
                      <div className="ux4g-journey-card ux4g-journey-card--standard">
                        <div className="ux4g-journey-info">
                          <span className="rti-mono ux4g-journey-date">
                            {new Date(event.occurredAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="ux4g-journey-title">{event.message}</span>
                          <span className={`ux4g-tag-tonal-${STATE_TAG_VARIANT[event.state]}`}>
                            {STATE_LABEL[event.state]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
