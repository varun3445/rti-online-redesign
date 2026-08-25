import { mockAuthorities, type MockAuthority } from "./mock-authorities";
import { SERVICE_SLA_HINTS, formatDate } from "./rti-knowledge-base";

/**
 * Local, non-AI matcher. Used when OPENAI_API_KEY isn't configured (or the
 * live call fails) so the demo flow always works — never a hard dead end.
 * The API route labels every response with `source: "ai" | "fallback"` so
 * the UI can disclose honestly which one produced it.
 */
export function matchAuthority(message: string): MockAuthority | null {
  const lower = message.toLowerCase();
  let best: MockAuthority | null = null;
  let bestScore = 0;
  for (const authority of mockAuthorities) {
    for (const topic of authority.topics) {
      if (lower.includes(topic) && topic.length > bestScore) {
        bestScore = topic.length;
        best = authority;
      }
    }
  }
  return best;
}

function extractStatedDays(text: string): number | null {
  const m = text.match(/(\d+)\s*(day|days|week|weeks|month|months)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("week")) return n * 7;
  if (unit.startsWith("month")) return n * 30;
  return n;
}

export type Applicant = { name: string; address: string; email: string };

/**
 * Looks for "Name, Address, email@x.com" — the format the assistant's own
 * clarifying question asks for. No NLP here, just enough to unblock the
 * demo without a real model to parse free text.
 */
function extractApplicant(text: string): Applicant | null {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (!emailMatch) return null;
  const withoutEmail = text.replace(emailMatch[0], "").trim();
  const parts = withoutEmail
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  return { name: parts[0], address: parts.slice(1).join(", "), email: emailMatch[0] };
}

/** Strictly formatted official RTI letter — salutation, section citations,
 * statutory response window, and a formal closing, not just a numbered
 * ask. Matches how an actual RTI application is expected to read. */
function draftRequest(message: string, authority: MockAuthority, applicant: Applicant): string {
  const clean = message.trim().replace(/[.?!]+$/, "");
  return [
    "To,",
    "The Central Public Information Officer (CPIO)",
    authority.name,
    authority.ministry,
    "Government of India",
    "",
    `Date: ${formatDate()}`,
    "",
    "Subject: Request for information under Section 6(1) of the Right to Information Act, 2005",
    "",
    "Sir/Madam,",
    "",
    "Under Section 6(1) of the Right to Information Act, 2005, I request the following information:",
    "",
    `1. ${clean}.`,
    "2. The current status of the above matter, along with copies of relevant file notings, correspondence, or internal communication.",
    "3. Certified copies of any documents responsive to this request, as provided under Section 2(j) of the Act.",
    "",
    "I am a citizen of India. I enclose the prescribed fee of ₹10 under the Right to Information (Regulation of Fee and Cost) Rules, 2012, or a valid Below Poverty Line certificate, where applicable.",
    "",
    "I request that the above information be furnished within the statutory period of thirty days from the receipt of this application, as prescribed under Section 7(1) of the Act.",
    "",
    "Yours faithfully,",
    applicant.name,
    applicant.address,
    applicant.email,
  ].join("\n");
}

export type IntakeResponse = {
  reply: string;
  needsClarification: boolean;
  authority?: { code: string; name: string; ministry: string };
  draft?: string;
  applicant?: Applicant;
};

type HistoryMessage = { role: "user" | "assistant"; content: string };

/**
 * The matcher only looks at single messages, so a context-free follow-up
 * ("also mention my PAN") won't match anything on its own. Fold in the
 * earlier user turns so an already-established authority carries forward
 * instead of the fallback re-asking a question it already has the answer
 * to. A real OpenAI call handles this natively via `history`; this is the
 * fallback's equivalent.
 */
export function localFallbackResponse(
  message: string,
  history: HistoryMessage[] = []
): IntakeResponse {
  const priorUserText = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");

  const authority = matchAuthority(message) ?? matchAuthority(priorUserText);

  if (!authority) {
    return {
      reply:
        "Could you say a bit more about which government office or service this involves? For example: railways, EPFO/PF, income tax, passports, or a central ministry.",
      needsClarification: true,
    };
  }

  // Only check the SLA on the opening message — if the citizen already
  // saw this note and replied anyway, treat that as them insisting and
  // draft normally rather than repeating the check.
  const sla = SERVICE_SLA_HINTS[authority.code];
  const statedDays = extractStatedDays(message);
  if (history.length === 0 && sla && statedDays !== null && statedDays < sla.days) {
    return {
      reply: `${sla.note} — you mentioned ${statedDays} day${statedDays === 1 ? "" : "s"}, which is still inside that window. RTI is meant for a genuine delay, not routine processing time still in progress. Want to wait it out, or file anyway?`,
      needsClarification: true,
    };
  }

  // Draft only once we have real applicant details — never leave
  // "[Applicant Name]"-style placeholders in an official letter. Whichever
  // user message carries the email is treated as the applicant-details
  // reply and excluded from the letter's substantive request text.
  const allUserMessages = [...history.filter((m) => m.role === "user").map((m) => m.content), message];
  const applicantMessage = allUserMessages.find((m) => extractApplicant(m));
  const applicant = applicantMessage ? extractApplicant(applicantMessage) : null;

  if (!applicant) {
    return {
      reply:
        "Before I draft this, I need your details for the letter — reply with your full name, address, and email, separated by commas. For example: Priya Sharma, 12 MG Road, Bengaluru 560001, priya@example.com.",
      needsClarification: true,
      authority: { code: authority.code, name: authority.name, ministry: authority.ministry },
    };
  }

  const requestText = allUserMessages.filter((m) => m !== applicantMessage).join(" ") || message;

  const reply = applicantMessage === message
    ? "Got it — here's the formatted request with your details filled in. Edit anything that still needs adjusting."
    : "Got it — I've folded that into the draft below. Edit anything that still needs adjusting.";

  return {
    reply,
    needsClarification: false,
    authority: { code: authority.code, name: authority.name, ministry: authority.ministry },
    draft: draftRequest(requestText, authority, applicant),
    applicant,
  };
}
