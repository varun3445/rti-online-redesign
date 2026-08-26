"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { whatIsRti, whatYouCanGet, howItWorksSteps } from "@/lib/rti-content";

// UX4G Material Icons Outlined ligature names — see foundations/icons.css.
const EXAMPLE_ICONS = ["schedule", "description", "chat", "payments"];
const STEP_ICONS = ["chat", "account_balance", "payments", "task_alt"];

type ChatMessage = { role: "user" | "assistant"; content: string };
type Authority = { code: string; name: string; ministry: string };
type Applicant = { name: string; address: string; email: string };

// Reflects the real two-pass pipeline: a grounded web-search pass, then a
// drafting pass — so the wait is real, not padding for effect.
const LOADING_STAGES = [
  "Searching official sources…",
  "Checking processing timelines…",
  "Drafting your request…",
];

function ThreadTyping() {
  const [stageIndex, setStageIndex] = useState(0);
  useEffect(() => {
    setStageIndex(0);
    const id = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, LOADING_STAGES.length - 1));
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="ux4g-d-flex ux4g-ai-center ux4g-gap-4xs ux4g-body-s-default ux4g-text-neutral-secondary">
      <span className="ux4g-spinner-primary-full ux4g-spinner-sm" aria-hidden="true"></span>
      {LOADING_STAGES[stageIndex]}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<"home" | "chat" | "verify" | "pay" | "done">("home");
  const [firstMessage, setFirstMessage] = useState("Why has my PF withdrawal claim been pending for 4 months?");
  const [composerText, setComposerText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [authority, setAuthority] = useState<Authority>();
  const [applicant, setApplicant] = useState<Applicant>();
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState<"ai" | "fallback">();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("judge.demo@example.com");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");
  const [caseId, setCaseId] = useState("");
  const [filing, setFiling] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const priorHistory = messages;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: priorHistory }),
      });
      const j = await r.json();
      if (!r.ok) throw Error(j.error);
      setMessages((m) => [...m, { role: "assistant", content: j.reply }]);
      if (j.authority) setAuthority(j.authority);
      if (j.draft) setDraft(j.draft);
      if (j.applicant) {
        setApplicant(j.applicant);
        // Carries the email the citizen already gave the assistant into
        // step 2, so identity verification doesn't ask for it twice.
        setEmail(j.applicant.email);
      }
      setSource(j.source);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Try again");
    } finally {
      setLoading(false);
    }
  }

  async function startFromHome(e: React.FormEvent) {
    e.preventDefault();
    if (!firstMessage.trim()) return;
    setStep("chat");
    await sendMessage(firstMessage);
  }

  async function continueThread(e: React.FormEvent) {
    e.preventDefault();
    const text = composerText;
    setComposerText("");
    await sendMessage(text);
  }

  async function finalizeCase() {
    if (filing) return;
    setFiling(true);
    const serial = String(Math.floor(10000 + Math.random() * 90000));
    const authorityCode = authority?.code || "DOPT";
    const id = `${authorityCode}/R/E/26/${serial}`;
    try {
      await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          subject: firstMessage || draft.slice(0, 80) || "RTI request",
          authority: authority ?? { code: "DOPT", name: "Department of Personnel & Training", ministry: "Ministry of Personnel, Public Grievances and Pensions" },
          applicantEmail: email,
          applicantName: applicant?.name,
          applicantAddress: applicant?.address,
          draftText: draft,
        }),
      });
      setCaseId(id);
    } finally {
      setFiling(false);
      setStep("done");
    }
  }

  return (
    <main>
      <Nav />

      {step === "home" && (
        <>
          <section className="rti-hero ux4g-py-4xl">
            <div className="ux4g-container ux4g-text-center">
              <span className="rti-mono-label rti-badge-glass rti-hero-enter rti-hero-enter--1 ux4g-mb-m ux4g-d-inline-flex ux4g-ai-center ux4g-gap-2xs" style={{ padding: "0.375rem 0.875rem", borderRadius: "var(--ux4g-radius-full)", fontSize: "var(--ux4g-fs-12)" }}>
                <i className="ux4g-icon-outlined ux4g-fs-16">auto_awesome</i>
                AI-Assisted &middot; Right to Information, Made Clear
              </span>
              <h1 className="rti-display rti-hero-enter rti-hero-enter--2 ux4g-heading-xl-strong ux4g-text-neutral-inverse ux4g-my-m">
                Just ask for what&rsquo;s yours.
              </h1>
              <p
                className="rti-hero-enter rti-hero-enter--3 ux4g-body-m-default ux4g-text-neutral-inverse ux4g-opacity-80 ux4g-mb-l"
                style={{ maxWidth: "36rem", marginInline: "auto" }}
              >
                Describe what you need in your own words. We&rsquo;ll turn it into a
                clear request under the Right to Information Act, 2005.
              </p>
              <form
                className="ux4g-search ux4g-search-lg rti-composer rti-hero-enter rti-hero-enter--4 ux4g-text-neutral-primary"
                onSubmit={startFromHome}
              >
                <span className="ux4g-icon-outlined ux4g-search-leading-icon">auto_awesome</span>
                <input
                  className="ux4g-search-input"
                  aria-label="Describe your RTI request"
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder="For example: why is my PF claim delayed?"
                />
                <button type="submit" className="ux4g-search-btn" aria-label="Start with this">
                  <span className="ux4g-icon-outlined">arrow_upward</span>
                </button>
              </form>
              <small className="rti-mono rti-hero-enter rti-hero-enter--5 ux4g-body-xs-default ux4g-text-neutral-inverse ux4g-opacity-70 ux4g-mt-s ux4g-d-block">
                Plain language in, a formatted RTI request out — powered by OpenAI.
              </small>
            </div>
          </section>

          <Reveal>
            <section id="how-it-works" className="ux4g-container ux4g-py-2xl">
              <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">
                <span className="rti-motif-dot" aria-hidden="true"></span>
                {whatIsRti.eyebrow}
              </span>
              <h2 className="rti-display ux4g-heading-l-strong ux4g-my-m">{whatIsRti.title}</h2>
              <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
                {whatIsRti.body}
              </p>
              <Link href="/how-it-works" className="ux4g-text-link-md">
                Read the full walkthrough &rarr;
              </Link>
            </section>
          </Reveal>

          <Reveal>
            <section className="ux4g-container ux4g-py-2xl">
              <h2 className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">
                <span className="rti-motif-dot" aria-hidden="true"></span>
                What You Can Actually Get
              </h2>
              <div className="ux4g-grid ux4g-grid-auto-fit-300 ux4g-gap-m ux4g-my-m">
                {whatYouCanGet.map((item, i) => {
                  const iconName = EXAMPLE_ICONS[i % EXAMPLE_ICONS.length];
                  return (
                    <article
                      key={item.title}
                      className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2 rti-card-lift"
                    >
                      <div className="ux4g-card-body">
                        <div className="rti-icon-badge ux4g-mb-s">
                          <i className="ux4g-icon-outlined ux4g-fs-20 ux4g-text-primary" aria-hidden="true">
                            {iconName}
                          </i>
                        </div>
                        <h3 className="ux4g-card-title">{item.title}</h3>
                        <p className="ux4g-body-s-strong ux4g-mt-s">{item.example}</p>
                        <p className="ux4g-body-s-default ux4g-text-neutral-secondary">{item.note}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="ux4g-container ux4g-py-2xl">
              <h2 className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">
                <span className="rti-motif-dot" aria-hidden="true"></span>
                How It Works
              </h2>
              <ol className="ux4g-my-m" style={{ listStyle: "none", padding: 0 }}>
                {howItWorksSteps.map((s, i) => {
                  const iconName = STEP_ICONS[i % STEP_ICONS.length];
                  return (
                    <li
                      key={s.step}
                      className="ux4g-d-flex ux4g-gap-6xs ux4g-py-m"
                    >
                      <span>
                        <i className="ux4g-icon-outlined ux4g-fs-24 ux4g-text-primary" aria-hidden="true">
                          {iconName}
                        </i>
                      </span>
                      <div>
                        <h3 className="ux4g-title-s-strong">{s.title}</h3>
                        <p className="ux4g-body-s-default ux4g-text-neutral-secondary">{s.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </Reveal>
        </>
      )}

      {step === "chat" && (
        <section className="ux4g-container ux4g-py-2xl">
          <h1 className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Describe Your Question</h1>

          <div className="thread ux4g-my-m">
            {messages.map((m, i) => (
              <div key={i} className={`thread__row thread__row--${m.role}`}>
                <div>
                  <div className={`thread__bubble thread__bubble--${m.role}`}>{m.content}</div>
                  {m.role === "assistant" && i === messages.length - 1 && source && (
                    <span
                      className={
                        source === "ai" ? "ux4g-tag-tonal-primary" : "ux4g-tag-tonal-neutral"
                      }
                    >
                      {source === "ai" ? "Answered by OpenAI" : "Answered by local matcher"}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && <ThreadTyping />}
          </div>

          {authority && (
            <div className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2 ux4g-my-m">
              <div className="ux4g-card-body">
                <span className="rti-mono-label ux4g-label-s-strong ux4g-text-primary">
                  Likely Public Authority
                </span>
                <h2 className="ux4g-card-title ux4g-mt-xs">{authority.name}</h2>
                <p className="ux4g-body-s-default ux4g-text-neutral-secondary">
                  {authority.ministry}
                </p>
              </div>
            </div>
          )}

          {draft && (
            <div className="ux4g-textarea-container ux4g-textarea-lg ux4g-my-m">
              <label className="rti-mono-label ux4g-label-m-default" htmlFor="rti-draft">
                Your Editable Draft
              </label>
              <div className="ux4g-textarea">
                <textarea
                  id="rti-draft"
                  className="ux4g-textarea-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="ux4g-textarea-counter">{draft.length} characters</div>
              </div>
              <div className="ux4g-textarea-helper">
                <div className="ux4g-textarea-helper-left">
                  <span className="ux4g-icon-outlined ux4g-textarea-helper-icon">info</span>
                  <span className="ux4g-textarea-helper-text">No character whitelist</span>
                </div>
              </div>
              <button
                type="button"
                className="ux4g-btn-primary ux4g-btn-md ux4g-mt-m"
                onClick={() => setStep("verify")}
              >
                Review &amp; continue &rarr;
              </button>
            </div>
          )}

          {error && (
            <div className="ux4g-context-alert ux4g-alert-error ux4g-my-m">
              <i className="ux4g-icon ux4g-alert-icon">error</i>
              <div className="ux4g-alert-message">{error}</div>
            </div>
          )}

          <form className="ux4g-search ux4g-mt-m" onSubmit={continueThread}>
            <input
              className="ux4g-search-input"
              aria-label="Add more detail, or ask a follow-up"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Add more detail, or ask a follow-up&hellip;"
              disabled={loading}
            />
            <button type="submit" className="ux4g-search-btn" disabled={loading} aria-label="Send">
              <span className="ux4g-icon-outlined">send</span>
            </button>
          </form>
        </section>
      )}

      {step === "verify" && (
        <section className="ux4g-container ux4g-py-2xl">
          <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Step 2 of 4</span>
          <span className="ux4g-tag-tonal-warning ux4g-mt-xs ux4g-d-block" style={{ width: "fit-content" }}>
            MOCK IDENTITY CHECK &mdash; no real OTP is sent
          </span>
          <h1 className="ux4g-heading-xl-strong ux4g-my-m">
            One check. <em>Then you&rsquo;re through.</em>
          </h1>

          {!otpSent ? (
            <>
              <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
                This is also the email your registration number and future
                status updates will be tied to &mdash; including what you&rsquo;d
                look up later in{" "}
                <Link href="/view-history" className="ux4g-text-link-md">
                  View History
                </Link>
                .
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setOtpSent(true);
                }}
              >
                <div className="ux4g-input-container ux4g-input-md">
                  <label className="ux4g-label-m-default" htmlFor="rti-email">
                    Email
                  </label>
                  <div className="ux4g-input">
                    <input
                      id="rti-email"
                      className="ux4g-input-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button type="submit" className="ux4g-btn-primary ux4g-btn-md ux4g-mt-m">
                  Send mock code &rarr;
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
                Mock code sent to <b>{email}</b>. Nothing was really sent
                &mdash; use <b>123456</b>.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("pay");
                }}
              >
                <div className="ux4g-input-container ux4g-input-md">
                  <label className="ux4g-label-m-default" htmlFor="rti-otp">
                    One-time code
                  </label>
                  <div className="ux4g-input">
                    <input
                      id="rti-otp"
                      className="ux4g-input-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                    />
                  </div>
                </div>
                <button type="submit" className="ux4g-btn-primary ux4g-btn-md ux4g-mt-m">
                  Verify &rarr;
                </button>
              </form>
            </>
          )}
        </section>
      )}

      {step === "pay" && (
        <section className="ux4g-container ux4g-py-2xl">
          <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Step 3 of 4</span>
          <span className="ux4g-tag-tonal-warning ux4g-mt-xs ux4g-d-block" style={{ width: "fit-content" }}>
            MOCK PAYMENT &mdash; no real transaction
          </span>
          <h1 className="ux4g-heading-xl-strong ux4g-my-m">₹10 request fee</h1>
          <p className="ux4g-body-m-default ux4g-text-neutral-secondary ux4g-mb-m">
            Non-BPL applicants pay ₹10. BPL applicants attaching a valid
            BPL certificate pay no fee.
          </p>
          <div className="ux4g-d-flex ux4g-gap-4xs ux4g-flex-wrap">
            <button
              type="button"
              className="ux4g-btn-primary ux4g-btn-md"
              onClick={finalizeCase}
              disabled={filing}
            >
              {filing ? "Filing…" : "Pay ₹10 (mock) →"}
            </button>
            <button
              type="button"
              className="ux4g-btn-outline-primary ux4g-btn-md"
              onClick={finalizeCase}
              disabled={filing}
            >
              {filing ? "Filing…" : "Use BPL waiver →"}
            </button>
          </div>
        </section>
      )}

      {step === "done" && (
        <section className="ux4g-container ux4g-py-2xl">
          <span className="rti-mono-label ux4g-label-m-strong ux4g-text-primary">Step 4 of 4</span>
          <span className="ux4g-tag-tonal-success ux4g-mt-xs ux4g-d-block" style={{ width: "fit-content" }}>
            MOCK CONFIRMATION &mdash; no real government request was filed
          </span>
          <h1 className="ux4g-heading-xl-strong ux4g-my-m">
            Your request has a <em>home.</em>
          </h1>
          <div className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-shadow-l2">
            <div className="ux4g-card-body">
              <span className="rti-mono-label ux4g-label-s-strong ux4g-text-primary">Your RTI Case ID</span>
              <h2 className="rti-mono ux4g-card-title ux4g-mt-xs">{caseId}</h2>
              <p className="ux4g-body-s-default ux4g-text-neutral-secondary ux4g-mt-s">
                One citizen-facing case, even if a Nodal Officer forwards parts
                to other CPIOs. Status updates go to <b>{email}</b>.
              </p>
              <Link
                href={`/view-history?email=${encodeURIComponent(email)}`}
                className="ux4g-text-link-md ux4g-mt-s ux4g-d-block"
              >
                View in My RTI &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
