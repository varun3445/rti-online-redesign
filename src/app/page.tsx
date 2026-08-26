"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/ui/Icon";
import { IconBadge } from "@/components/ui/IconBadge";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SearchComposer } from "@/components/ui/SearchComposer";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { whatIsRti, howItWorksSteps } from "@/lib/rti-content";

const STEP_ICONS = ["chat", "account_balance", "payments", "task_alt"];

// Same shape/JSX as the original whatYouCanGet import (title / example /
// note), just swapped for the new brief's copy — kept to 4 items so the
// existing 2x2 card grid doesn't have to change shape.
const WHAT_YOU_CAN_GET = [
  {
    icon: "chat",
    title: "Simple Request",
    example: "Just tell us what you need.",
    note: "Speak or type your question. Our AI assistant helps you turn it into a clear RTI request, find the right authority, and submit it within the guidelines.",
  },
  {
    icon: "schedule",
    title: "Easy Tracking",
    example: "Know what’s happening.",
    note: "No more wondering where your request went. See your application, timeline, current status and next steps — all in one place.",
  },
  {
    icon: "shield",
    title: "Secure Information",
    example: "Your information, your control.",
    note: "Receive and access your RTI documents securely, with DigiLocker integration designed to reduce unnecessary steps and keep your information in one place.",
  },
  {
    icon: "eye",
    title: "Transparent by Design",
    example: "See exactly where things stand.",
    note: "See the ₹10 fee, expected timeline, status, reasons for delays and what happens next.",
  },
];

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
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <Spinner />
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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
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
        // Carries what the citizen already gave the assistant into step 2,
        // so identity verification doesn't ask for any of it twice.
        setEmail(j.applicant.email);
        setName(j.applicant.name);
        setAddress(j.applicant.address);
      } else if (!j.draft) {
        // Assistant is still asking for something and doesn't have
        // applicant details yet — same "ready to just click send" example
        // reply as firstMessage above, but only appears once the assistant
        // has actually asked for it, not the moment the chat step opens.
        setComposerText("Priya Sharma, 12 MG Road, Bengaluru 560001, priya@example.com");
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
          applicantName: name,
          applicantAddress: address,
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
    <main className="flex flex-1 flex-col">
      <Nav />

      {step === "home" && (
        <>
          <section className="bg-gradient-to-br from-accent-600 via-accent-800 to-accent-900 py-24">
            <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
              <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-md">
                <Icon name="auto_awesome" size={16} />
                The Right to Information Act, 2005
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-white sm:text-5xl">
                Bas bolo, aur ho jayega.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
                Your right to information, without the jhanjhat.
              </p>
              <div className="mt-8">
                <SearchComposer
                  size="lg"
                  leadingIcon="auto_awesome"
                  submitIcon="arrow_upward"
                  submitLabel="Start with this"
                  value={firstMessage}
                  onChange={setFirstMessage}
                  onSubmit={startFromHome}
                  placeholder="For example: why is my PF claim delayed?"
                  inputProps={{ "aria-label": "Describe your RTI request" }}
                  voice
                  tone="dark"
                />
              </div>
              <p className="mt-4 font-mono text-xs text-white/70">
                Plain language in. A properly addressed RTI request out.
              </p>
            </div>
          </section>

          <Reveal>
            <section id="how-it-works" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
              <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
                {whatIsRti.eyebrow}
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-neutral-900">
                {whatIsRti.title}
              </h2>
              <p className="mt-3 text-neutral-600">{whatIsRti.body}</p>
              <Link href="/how-it-works" className="mt-3 inline-block text-sm font-medium text-accent-600">
                Read the full walkthrough &rarr;
              </Link>
            </section>
          </Reveal>

          <Reveal>
            <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
              <h2 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
                What You Can Actually Get
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {WHAT_YOU_CAN_GET.map((item) => (
                  <Card key={item.title} lift>
                    <IconBadge icon={item.icon} className="mb-3" />
                    <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium text-neutral-800">{item.example}</p>
                    <p className="mt-1 text-sm text-neutral-500">{item.note}</p>
                  </Card>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
              <h2 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-600" aria-hidden="true" />
                How It Works
              </h2>
              <ol className="mt-6 flex flex-col divide-y divide-neutral-200" style={{ listStyle: "none", padding: 0 }}>
                {howItWorksSteps.map((s, i) => {
                  const iconName = STEP_ICONS[i % STEP_ICONS.length];
                  return (
                    <li key={s.step} className="flex gap-4 py-4">
                      <Icon name={iconName} size={24} className="mt-0.5 shrink-0 text-accent-600" />
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">{s.title}</h3>
                        <p className="mt-1 text-sm text-neutral-500">{s.body}</p>
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
        <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
            Describe Your Question
          </h1>

          <div className="my-6 flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <ChatBubble role={m.role}>{m.content}</ChatBubble>
                {m.role === "assistant" && i === messages.length - 1 && source && (
                  <div className="pl-1">
                    <Tag tonal={source === "ai" ? "primary" : "neutral"}>
                      {source === "ai" ? "Answered by OpenAI" : "Answered by local matcher"}
                    </Tag>
                  </div>
                )}
              </div>
            ))}
            {loading && <ThreadTyping />}
          </div>

          {authority && (
            <Card className="my-6">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
                Likely Public Authority
              </span>
              <h2 className="mt-1 text-base font-semibold text-neutral-900">{authority.name}</h2>
              <p className="text-sm text-neutral-500">{authority.ministry}</p>
            </Card>
          )}

          {draft && (
            <div className="my-6 flex flex-col gap-3">
              <Textarea label="Your Editable Draft" id="rti-draft" value={draft} onChange={setDraft} />
              <Button onClick={() => setStep("verify")} className="self-start">
                Review &amp; continue &rarr;
              </Button>
            </div>
          )}

          {error && (
            <div className="my-6">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <SearchComposer
            size="md"
            leadingIcon="chat"
            submitIcon="send"
            submitLabel="Send"
            value={composerText}
            onChange={setComposerText}
            onSubmit={continueThread}
            placeholder="Add more detail, or ask a follow-up…"
            disabled={loading}
            className="mt-6"
            inputProps={{ "aria-label": "Add more detail, or ask a follow-up" }}
          />
        </section>
      )}

      {step === "verify" && (
        <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Step 2 of 4</span>
          <div className="mt-2">
            <Tag tonal="warning">MOCK IDENTITY CHECK &mdash; no real OTP is sent</Tag>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">
            One check. <em>Then you&rsquo;re through.</em>
          </h1>

          {!otpSent ? (
            <>
              <p className="mt-4 mb-6 text-neutral-600">
                Pulled straight from what you told the assistant &mdash; check it over, fix anything that&rsquo;s off.
                The email is also what your registration number and future status updates will be tied to,
                including what you&rsquo;d look up later in{" "}
                <Link href="/my-rti" className="font-medium text-accent-600">
                  My RTI
                </Link>
                .
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setOtpSent(true);
                }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Full Name"
                  id="rti-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
                <Input
                  label="Postal Address"
                  id="rti-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your postal address"
                />
                <Input
                  label="Email"
                  id="rti-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button className="self-start">Send mock code &rarr;</Button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-4 mb-6 text-neutral-600">
                Mock code sent to <b>{email}</b>. Nothing was really sent &mdash; use <b>123456</b>.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("pay");
                }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="One-time code"
                  id="rti-otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                />
                <Button className="self-start">Verify &rarr;</Button>
              </form>
            </>
          )}
        </section>
      )}

      {step === "pay" && (
        <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Step 3 of 4</span>
          <div className="mt-2">
            <Tag tonal="warning">MOCK PAYMENT &mdash; no real transaction</Tag>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">₹10 request fee</h1>
          <p className="mt-4 mb-6 text-neutral-600">
            Non-BPL applicants pay ₹10. BPL applicants attaching a valid BPL certificate pay no fee.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={finalizeCase} disabled={filing}>
              {filing ? "Filing…" : "Pay ₹10 (mock) →"}
            </Button>
            <Button variant="outline" onClick={finalizeCase} disabled={filing}>
              {filing ? "Filing…" : "Use BPL waiver →"}
            </Button>
          </div>
        </section>
      )}

      {step === "done" && (
        <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">Step 4 of 4</span>
          <div className="mt-2">
            <Tag tonal="success">MOCK CONFIRMATION &mdash; no real government request was filed</Tag>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">
            Your request has a <em>home.</em>
          </h1>
          <Card className="mt-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">
              Your RTI Case ID
            </span>
            <h2 className="mt-1 font-mono text-lg font-semibold text-neutral-900">{caseId}</h2>
            <p className="mt-2 text-sm text-neutral-500">
              One citizen-facing case, even if a Nodal Officer forwards parts to other CPIOs. Status updates go to{" "}
              <b>{email}</b>.
            </p>
            <Link
              href={`/my-rti?email=${encodeURIComponent(email)}`}
              className="mt-3 inline-block text-sm font-medium text-accent-600"
            >
              View in My RTI &rarr;
            </Link>
          </Card>
        </section>
      )}

      <Footer />
    </main>
  );
}
