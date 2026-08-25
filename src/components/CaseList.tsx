import type { RtiCase } from "@/lib/rti-case.schema";
import { STATE_LABEL, STATE_TOKEN, headlineState, summaryLine } from "@/lib/case-status";

export function CaseList({ cases }: { cases: RtiCase[] }) {
  return (
    <ul className="case-list">
      {cases.map((c) => {
        const headline = headlineState(c);
        return (
          <li key={c.id} className={`case-card case-card--${STATE_TOKEN[headline]}`}>
            <span className={`status-chip status-chip--${STATE_TOKEN[headline]}`}>
              {STATE_LABEL[headline]}
            </span>
            <h3>{c.subject}</h3>
            <p className="case-card__authority">{c.authority.name}</p>
            <p className="case-card__summary">{summaryLine(c)}</p>
            {c.subRecords.length > 0 && (
              <ul className="case-card__subrecords">
                {c.subRecords.map((sub) => (
                  <li key={sub.id}>
                    <span
                      className={`status-dot status-dot--${STATE_TOKEN[sub.state]}`}
                      aria-hidden="true"
                    />
                    {sub.authority.name} &mdash; {STATE_LABEL[sub.state]}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
