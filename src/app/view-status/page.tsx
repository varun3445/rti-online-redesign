"use client";

import { useState } from "react";
import { SearchComposer } from "@/components/ui/SearchComposer";
import { Alert } from "@/components/ui/Alert";
import { CaseCard } from "@/components/ui/CaseCard";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mockRtiCases } from "@/lib/mock-rti-cases";
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

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <Nav />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
          Check One Case
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
          Enter your <em>registration number.</em>
        </h1>
        <p className="mt-3 text-neutral-600">
          Filed something just now? Its registration number works here. Otherwise, try one of the sample numbers
          below.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <SearchComposer
          size="md"
          leadingIcon="search"
          submitIcon="arrow_forward"
          submitLabel="Check status"
          value={query}
          onChange={setQuery}
          onSubmit={onSubmit}
          placeholder="e.g. RTI-2026-0002"
          disabled={loading}
          loading={loading}
          inputProps={{ "aria-label": "Registration number" }}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-500">Sample numbers:</span>
          {SAMPLE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className="rounded-full border border-neutral-300 px-2.5 py-1 font-mono text-xs text-neutral-700 hover:bg-neutral-100"
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
          <div className="mt-6">
            <Alert variant="info">
              No case found for &ldquo;{query}&rdquo;. Try one of the sample numbers above.
            </Alert>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <CaseCard rtiCase={result} />
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
