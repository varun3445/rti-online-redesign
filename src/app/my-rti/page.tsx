"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaseList } from "@/components/CaseList";
import { SearchComposer } from "@/components/ui/SearchComposer";
import type { RtiCase } from "@/lib/rti-case.schema";

/** Merged My RTI + View History — one email-gated lookup flow instead of
 * two near-duplicate pages (My RTI used to show the shared example set
 * with no gate at all; View History asked for an email first). Now both
 * concepts are this single flow; /view-history redirects here. */
export default function MyRtiPage() {
  const [email, setEmail] = useState("priya@example.com");
  const [unlocked, setUnlocked] = useState(false);
  const [cameFromFiling, setCameFromFiling] = useState(false);
  const [cases, setCases] = useState<RtiCase[]>([]);
  const [loading, setLoading] = useState(false);

  async function lookup(forEmail: string) {
    setLoading(true);
    try {
      const r = await fetch(`/api/cases?email=${encodeURIComponent(forEmail)}`);
      const j = await r.json();
      setCases(j.cases ?? []);
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("email");
    if (fromQuery) {
      setEmail(fromQuery);
      setCameFromFiling(true);
      lookup(fromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    lookup(email);
  }

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <Nav />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
          Your Cases, One View
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900">
          Every case. <em>One place.</em>
        </h1>
        <p className="mt-3 text-neutral-600">
          {unlocked
            ? "Even when a request splits across multiple departments internally, it shows up here as one case with one plain-language status — not a pile of registration numbers to track separately."
            : "No password to remember — look it up by the email you used to file. No email yet? You'll still see the shared example set."}
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        {!unlocked ? (
          <SearchComposer
            size="md"
            leadingIcon="mail"
            submitIcon="arrow_forward"
            submitLabel="Look up my cases"
            value={email}
            onChange={setEmail}
            onSubmit={onSubmit}
            placeholder="the email you filed with"
            disabled={loading}
            inputProps={{ type: "email", "aria-label": "Email" }}
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-neutral-500">
              {cameFromFiling ? (
                <>
                  Recognized <b>{email}</b> from the request you just filed &mdash; no need to look it up again.
                </>
              ) : (
                <>
                  Showing cases filed under <b>{email}</b>, plus the shared example set every visitor sees.
                </>
              )}
            </p>
            <CaseList cases={cases} />
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
