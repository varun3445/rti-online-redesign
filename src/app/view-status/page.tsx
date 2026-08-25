"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mockRtiCases } from "@/lib/mock-rti-cases";
import { STATE_LABEL, STATE_TOKEN, headlineState, summaryLine } from "@/lib/case-status";
import type { RtiCase } from "@/lib/rti-case.schema";

const SAMPLE_IDS = mockRtiCases.map((c) => c.id);

export default function ViewStatusPage() {
  const [query, setQuery] = useState("RTI-2026-0002");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RtiCase | undefined>();

  async function runLookup(q: string) {
    setLoading(true);
    try {
      const r = await fetch(`/api/cases/lookup?q=${encodeURIComponent(q)}`);
      const j = await r.json();
      setResult(j.case ?? undefined);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runLookup(query);
  }

  const headline = result ? headlineState(result) : undefined;

  return (
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">CHECK ONE CASE</span>
        <h1 className="page-header__title">
          Enter your <em>registration number.</em>
        </h1>
        <p className="page-header__lede">
          Filed something just now? Its registration number works here.
          Otherwise, try one of the sample numbers below.
        </p>
      </section>

      <section className="section">
        <form className="composer lookup-form" onSubmit={onSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. RTI-2026-0002"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Checking…" : "Check status →"}
          </button>
        </form>

        <p className="lookup-samples">
          Sample numbers:{" "}
          {SAMPLE_IDS.map((id, i) => (
            <span key={id}>
              <button
                type="button"
                className="lookup-samples__chip"
                onClick={() => {
                  setQuery(id);
                  runLookup(id);
                }}
              >
                {id}
              </button>
              {i < SAMPLE_IDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        {searched && !loading && !result && (
          <div className="artifact">
            <p className="artifact__meta">
              No case found for &ldquo;{query}&rdquo;. Try one of the sample
              numbers above.
            </p>
          </div>
        )}

        {result && headline && (
          <article className={`case-card case-card--${STATE_TOKEN[headline]} view-status-result`}>
            <span className={`status-chip status-chip--${STATE_TOKEN[headline]}`}>
              {STATE_LABEL[headline]}
            </span>
            <h2>{result.subject}</h2>
            <p className="case-card__authority">{result.authority.name}</p>
            <p className="case-card__summary">{summaryLine(result)}</p>

            {result.subRecords.length > 0 && (
              <ul className="case-card__subrecords">
                {result.subRecords.map((sub) => (
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

            <div className="timeline">
              <span className="artifact__label">TIMELINE</span>
              <ul className="timeline__list">
                {result.events.map((event, i) => (
                  <li key={i} className="timeline__item">
                    <span
                      className={`status-dot status-dot--${STATE_TOKEN[event.state]}`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="timeline__message">{event.message}</p>
                      <p className="timeline__date">
                        {new Date(event.occurredAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </section>

      <Footer />
    </main>
  );
}
