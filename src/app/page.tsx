"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { whatIsRti, whatYouCanGet, howItWorksSteps } from "@/lib/rti-content";
import { ClockIcon, DocumentIcon, ChatIcon, CoinsIcon, BuildingIcon, MapPinCheckIcon } from "@/components/icons";

const EXAMPLE_ICONS = [ClockIcon, DocumentIcon, ChatIcon, CoinsIcon];
const STEP_ICONS = [ChatIcon, BuildingIcon, CoinsIcon, MapPinCheckIcon];

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
  return <div className="thread__typing">{LOADING_STAGES[stageIndex]}</div>;
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
          <section className="landing">
            <span className="landing__eyebrow">RIGHT TO INFORMATION, MADE CLEAR</span>
            <h1 className="landing__title">
              <em>Simply</em> ask for what&rsquo;s yours.
            </h1>
            <p className="landing__lede">
              Describe what you need in your own words. We&rsquo;ll turn it into a
              clear request under the Right to Information Act, 2005.
            </p>
            <form className="composer composer--pill" onSubmit={startFromHome}>
              <input
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="For example: why is my PF claim delayed?"
              />
              <button type="submit" className="composer__submit" aria-label="Start with this">
                &uarr;
              </button>
            </form>
            <small className="landing__hint">
              Plain language in, a formatted RTI request out — powered by OpenAI.
            </small>
          </section>

          <section id="how-it-works" className="section section--intro">
            <span className="section__eyebrow">{whatIsRti.eyebrow}</span>
            <h2 className="section__title">{whatIsRti.title}</h2>
            <p className="section__body">{whatIsRti.body}</p>
            <Link href="/how-it-works" className="button-link">
              Read the full walkthrough &rarr;
            </Link>
          </section>

          <section className="section">
            <span className="section__eyebrow">WHAT YOU CAN ACTUALLY GET</span>
            <div className="info-grid">
              {whatYouCanGet.map((item, i) => {
                const Icon = EXAMPLE_ICONS[i % EXAMPLE_ICONS.length];
                return (
                  <article key={item.title} className="info-card">
                    <div className="info-card__icon">
                      <Icon />
                    </div>
                    <h3>{item.title}</h3>
                    <p className="info-card__quote">{item.example}</p>
                    <p className="info-card__note">{item.note}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="section">
            <span className="section__eyebrow">HOW IT WORKS</span>
            <ol className="numbered-list">
              {howItWorksSteps.map((s, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <li key={s.step} className="numbered-list__item">
                    <span className="numbered-list__index">
                      <Icon />
                    </span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      )}

      {step === "chat" && (
        <section className="thread-page">
          <span className="thread-page__eyebrow">DESCRIBE YOUR QUESTION</span>

          <div className="thread">
            {messages.map((m, i) => (
              <div key={i} className={`thread__row thread__row--${m.role}`}>
                <div>
                  <div className={`thread__bubble thread__bubble--${m.role}`}>{m.content}</div>
                  {m.role === "assistant" && i === messages.length - 1 && source && (
                    <span className={`thread__source thread__source--${source}`}>
                      {source === "ai" ? "Answered by OpenAI" : "Answered by local matcher"}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && <ThreadTyping />}
          </div>

          {authority && (
            <div className="artifact artifact--authority">
              <span className="artifact__label">LIKELY PUBLIC AUTHORITY</span>
              <h2>{authority.name}</h2>
              <p className="artifact__meta">{authority.ministry}</p>
            </div>
          )}

          {draft && (
            <div className="artifact">
              <span className="artifact__label">YOUR EDITABLE DRAFT</span>
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
              <p className="artifact__meta">{draft.length} characters &middot; no character whitelist</p>
              <button onClick={() => setStep("verify")}>Review &amp; continue &rarr;</button>
            </div>
          )}

          {error && <p className="error-text thread-page__error">{error}</p>}

          <form className="thread-composer" onSubmit={continueThread}>
            <input
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Add more detail, or ask a follow-up&hellip;"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </section>
      )}

      {step === "verify" && (
        <section className="step-panel">
          <span className="step-panel__eyebrow">STEP 2 OF 4</span>
          <span className="step-panel__tag">MOCK IDENTITY CHECK &mdash; no real OTP is sent</span>
          <h1 className="step-panel__title">
            One check. <em>Then you&rsquo;re through.</em>
          </h1>

          {!otpSent ? (
            <>
              <p>
                This is also the email your registration number and future
                status updates will be tied to &mdash; including what you&rsquo;d
                look up later in{" "}
                <Link href="/view-history" className="text-link">
                  View History
                </Link>
                .
              </p>
              <form
                className="composer lookup-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setOtpSent(true);
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <button type="submit">Send mock code &rarr;</button>
              </form>
            </>
          ) : (
            <>
              <p>
                Mock code sent to <b>{email}</b>. Nothing was really sent
                &mdash; use <b>123456</b>.
              </p>
              <form
                className="composer lookup-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("pay");
                }}
              >
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                />
                <button type="submit">Verify &rarr;</button>
              </form>
            </>
          )}
        </section>
      )}

      {step === "pay" && (
        <section className="step-panel">
          <span className="step-panel__eyebrow">STEP 3 OF 4</span>
          <span className="step-panel__tag">MOCK PAYMENT &mdash; no real transaction</span>
          <h1 className="step-panel__title">&#8377;10 request fee</h1>
          <p>
            Non-BPL applicants pay &#8377;10. BPL applicants attaching a valid
            BPL certificate pay no fee.
          </p>
          <button onClick={finalizeCase} disabled={filing}>
            {filing ? "Filing…" : "Pay ₹10 (mock) →"}
          </button>{" "}
          <button onClick={finalizeCase} disabled={filing}>
            {filing ? "Filing…" : "Use BPL waiver →"}
          </button>
        </section>
      )}

      {step === "done" && (
        <section className="step-panel">
          <span className="step-panel__eyebrow">STEP 4 OF 4</span>
          <span className="step-panel__tag">MOCK CONFIRMATION &mdash; no real government request was filed</span>
          <h1 className="step-panel__title">
            Your request has a <em>home.</em>
          </h1>
          <div className="artifact">
            <span className="artifact__label">YOUR RTI CASE ID</span>
            <h2>{caseId}</h2>
            <p>
              One citizen-facing case, even if a Nodal Officer forwards parts
              to other CPIOs. Status updates go to <b>{email}</b>.
            </p>
            <Link href={`/view-history?email=${encodeURIComponent(email)}`}>
              View in My RTI &rarr;
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
