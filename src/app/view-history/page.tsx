"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CaseList } from "@/components/CaseList";
import type { RtiCase } from "@/lib/rti-case.schema";

export default function ViewHistoryPage() {
  const [email, setEmail] = useState("demo@example.com");
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
    <main>
      <Nav />

      <section className="page-header">
        <span className="landing__eyebrow">EVERYTHING YOU&rsquo;VE FILED</span>
        <h1 className="page-header__title">
          Look it up by <em>email.</em>
        </h1>
        <p className="page-header__lede">
          No password to remember — we look up your filing history by the
          email you used to file. It's the same view as{" "}
          <Link href="/my-rti" className="text-link">
            My RTI
          </Link>
          , with a quick lookup step in front of it.
        </p>
      </section>

      <section className="section">
        {!unlocked ? (
          <form className="composer lookup-form" onSubmit={onSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="the email you filed with"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Looking up…" : "Look up →"}
            </button>
          </form>
        ) : (
          <>
            <p className="lookup-samples">
              {cameFromFiling ? (
                <>
                  Recognized <b>{email}</b> from the request you just filed
                  &mdash; no need to look it up again.
                </>
              ) : (
                <>
                  Showing cases filed under <b>{email}</b>, plus the shared
                  example set every visitor sees.
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
