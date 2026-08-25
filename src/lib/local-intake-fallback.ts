import { mockAuthorities, type MockAuthority } from "./mock-authorities";

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

function draftRequest(message: string, authority: MockAuthority): string {
  const clean = message.trim().replace(/[.?!]+$/, "");
  return [
    `To: The CPIO, ${authority.name}`,
    authority.ministry,
    "",
    "Subject: Request for information under the Right to Information Act, 2005",
    "",
    `1. ${clean}.`,
    "2. Please provide the current status, along with relevant file notings or correspondence related to the above.",
    "3. Kindly provide certified copies of any documents responsive to this request.",
    "",
    "I am an Indian citizen. I enclose the prescribed fee of ₹10 (or a valid BPL certificate, where applicable) as required under the RTI Rules, 2012.",
  ].join("\n");
}

export type IntakeResponse = {
  reply: string;
  needsClarification: boolean;
  authority?: { code: string; name: string; ministry: string };
  draft?: string;
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

  const combinedContext = priorUserText ? `${priorUserText} ${message}` : message;

  const reply = priorUserText
    ? "Got it — I've folded that into the draft below. Edit anything that still needs adjusting."
    : `This sounds like something handled by ${authority.name} (${authority.ministry}). I've drafted a request below — edit it before continuing if anything's off.`;

  return {
    reply,
    needsClarification: false,
    authority: { code: authority.code, name: authority.name, ministry: authority.ministry },
    draft: draftRequest(combinedContext, authority),
  };
}
