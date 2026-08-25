import Link from "next/link";
import { Nav } from "@/components/Nav";
import { mockRtiCases } from "@/lib/mock-rti-cases";
import { STATE_LABEL, STATE_TOKEN, headlineState, summaryLine } from "@/lib/case-status";

export default function MyRtiPage() {
  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">YOUR CASES, ONE VIEW</span>
        <h1 className="page-header__title">
          Every case. <em>One place.</em>
        </h1>
        <p className="page-header__lede">
          This prototype doesn&rsquo;t have real accounts yet, so what you&rsquo;re
          seeing below is example data — but it&rsquo;s the real point: even when a
          request gets split across multiple departments internally, you see
          one case with one plain-language status, not a pile of registration
          numbers to track separately.
        </p>
      </section>

      <section className="section">
        <ul className="case-list">
          {mockRtiCases.map((c) => {
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
      </section>

      <section className="section section--cta">
        <h2>Filing something new?</h2>
        <p>It&rsquo;ll show up here the same way, collapsed into one view.</p>
        <Link href="/" className="button-link">
          Start a request &rarr;
        </Link>
      </section>

      <footer>
        Prototype only. No real government service, identity verification, or
        payment is used.
      </footer>
    </main>
  );
}
