"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mockRtiCases } from "@/lib/mock-rti-cases";
import { STATE_LABEL, STATE_TOKEN, STATE_TAG_VARIANT, headlineState, summaryLine } from "@/lib/case-status";
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

      <section className="ux4g-container ux4g-py-2xl">
        <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Check One Case</span>
        <h1 className="ux4g-heading-xl-strong ux4g-my-m">
          Enter your <em>registration number.</em>
        </h1>
        <p className="ux4g-body-m-default ux4g-text-neutral-secondary">
          Filed something just now? Its registration number works here.
          Otherwise, try one of the sample numbers below.
        </p>
      </section>

      <section className="ux4g-container ux4g-py-2xl">
        <form className="ux4g-search" onSubmit={onSubmit}>
          <span className="ux4g-icon-outlined ux4g-search-leading-icon">search</span>
          <input
            className="ux4g-search-input"
            aria-label="Registration number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. RTI-2026-0002"
          />
          <button type="submit" className="ux4g-search-btn" disabled={loading} aria-label="Check status">
            <span className="ux4g-icon-outlined">arrow_forward</span>
          </button>
        </form>

        <div className="ux4g-d-flex ux4g-ai-center ux4g-flex-wrap ux4g-gap-2xs ux4g-mt-s">
          <span className="ux4g-body-s-default ux4g-text-neutral-secondary">Sample numbers:</span>
          {SAMPLE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className="rti-mono ux4g-tag-outline-neutral ux4g-d-inline-flex"
              onClick={() => {
                setQuery(id);
                runLookup(id);
              }}
            >
              {id}
            </button>
          ))}
        </div>

        {searched && !loading && !result && (
          <div className="ux4g-context-alert ux4g-alert-info ux4g-mt-m">
            <i className="ux4g-icon ux4g-alert-icon">info</i>
            <div className="ux4g-alert-message">
              No case found for &ldquo;{query}&rdquo;. Try one of the sample
              numbers above.
            </div>
          </div>
        )}

        {result && headline && (
          <article className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2 ux4g-mt-m">
            <div className="ux4g-card-body">
              <span className={`ux4g-tag-tonal-${STATE_TAG_VARIANT[headline]}`}>
                {STATE_LABEL[headline]}
              </span>
              <h2 className="ux4g-card-title ux4g-mt-xs">{result.subject}</h2>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary">
                {result.authority.name}
              </p>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-xs">
                {summaryLine(result)}
              </p>

              {result.subRecords.length > 0 && (
                <ul className="ux4g-mt-m" style={{ listStyle: "none", padding: 0 }}>
                  {result.subRecords.map((sub) => (
                    <li
                      key={sub.id}
                      className="ux4g-d-flex ux4g-ai-center ux4g-gap-2xs ux4g-body-s-default ux4g-py-xs"
                    >
                      <span className={`ux4g-tag-tonal-${STATE_TAG_VARIANT[sub.state]}`}>
                        {STATE_LABEL[sub.state]}
                      </span>
                      {sub.authority.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="ux4g-mt-l">
                <h3 className="rti-mono-label ux4g-label-s-strong ux4g-text-primary">Timeline</h3>
                <div className="ux4g-journey-timeline ux4g-journey-timeline--vertical ux4g-mt-s">
                  {result.events.map((event, i) => (
                    <div
                      key={i}
                      className={`ux4g-journey-step${i === result.events.length - 1 ? " ux4g-journey-step-active" : " ux4g-journey-step-completed"}`}
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
          </article>
        )}
      </section>

      <Footer />
    </main>
  );
}
