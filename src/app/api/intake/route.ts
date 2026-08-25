import { NextResponse } from "next/server";
import { mockAuthorities } from "@/lib/mock-authorities";
import { localFallbackResponse } from "@/lib/local-intake-fallback";
import { RTI_ACT_REFERENCE, SERVICE_SLA_HINTS, formatDate } from "@/lib/rti-knowledge-base";

const PLACEHOLDER_KEY = "your_openai_api_key_here";

const SLA_HINT_LINES = Object.values(SERVICE_SLA_HINTS)
  .filter((hint, i, arr) => arr.findIndex((h) => h.note === hint.note) === i)
  .map((hint) => `- ${hint.note} (around ${hint.days} days).`)
  .join("\n");

const SYSTEM_INSTRUCTIONS = `You are a plain-language RTI intake assistant for a
prototype, not legal advice. Use only this mock Public Authority dataset:
${JSON.stringify(mockAuthorities)}. Ground text in the Right to Information Act,
2005 — reference corpus: ${JSON.stringify(RTI_ACT_REFERENCE)}. Correctly use
Public Authority, CPIO, Nodal Officer. Fee: Rs. ${RTI_ACT_REFERENCE.requestFeeInr}
for non-BPL; waived for BPL applicants attaching a valid BPL certificate;
First Appeal has no fee. Always write the fee as "Rs." followed by the
number — never the ₹ symbol, which has caused encoding corruption in
past JSON output from this model.

Before drafting, check whether the citizen has actually waited past the
normal processing time for that service — RTI is for a genuine delay, not
routine processing still in progress. Known timelines:
${SLA_HINT_LINES}
For any other service, use the web_search tool to check the real, current
typical processing time from an official Indian government source before
deciding — do not guess a number. If the citizen's stated wait is still
within that window, do not draft yet: return
{reply,needsClarification:true} explaining the normal timeline and asking
if they want to wait or file anyway. Only skip this check on a follow-up
message where the citizen has already been told and is continuing anyway.

Use web_search whenever it would materially improve the accuracy of a
specific fact you are not confident about — the correct CPIO/office name,
a procedural citation, or a processing timeline — grounding the answer in
a real, current official Indian government source (the authority's own
site, a ministry site, or rtionline.gov.in) rather than inventing detail
you are not sure of. If a fact can't be verified, say so plainly instead
of stating it as certain.

Once the SLA check passes, check whether the citizen has given their full
name, postal address, and email anywhere in the conversation so far. If
any of those three is missing, do not draft yet — ask for exactly those
three details in one message and return {reply,needsClarification:true}.
Never invent or placeholder these — the letter must carry the citizen's
real details, not "[Applicant Name]" or similar brackets. Only proceed to
draft once all three are present in the conversation.

Return ONLY a single flat JSON object — never nest these fields inside a
"reply" key or any other wrapper. If vague, or the SLA/applicant-details
check requires asking first, return exactly:
{"reply": "<one clarifying question>", "needsClarification": true}
Otherwise return exactly this shape (five sibling keys at the top level):
{"reply": "<one or two sentence plain-language reply to the citizen>",
"needsClarification": false,
"authority": {"code": "<code>", "name": "<name>", "ministry": "<ministry>"},
"draft": "<the full formatted letter text>",
"applicant": {"name": "<their real name>", "address": "<their real address>", "email": "<their real email>"}}

The draft must be a strictly formatted official RTI letter, not a casual
note. Follow this structure exactly, filling in the real authority/
request details. Use exactly {{TODAY}} as the date — do not compute or
guess a different date:

To,
The Central Public Information Officer (CPIO)
<authority name>
<ministry>
Government of India

Date: {{TODAY}}

Subject: Request for information under Section 6(1) of the Right to Information Act, 2005

Sir/Madam,

Under Section 6(1) of the Right to Information Act, 2005, I request the following information:

1. <the citizen's request, restated formally>.
2. The current status of the above matter, along with copies of relevant file notings, correspondence, or internal communication.
3. Certified copies of any documents responsive to this request, as provided under Section 2(j) of the Act.

I am a citizen of India. I enclose the prescribed fee of Rs. 10 under the Right to Information (Regulation of Fee and Cost) Rules, 2012, or a valid Below Poverty Line certificate, where applicable.

I request that the above information be furnished within the statutory period of thirty days from the receipt of this application, as prescribed under Section 7(1) of the Act.

Yours faithfully,
<the citizen's real name>
<the citizen's real address>
<the citizen's real email>

Never claim to file a real request. Never add a character limit or
whitelist.`;

const RESEARCH_INSTRUCTIONS = `You are researching a single RTI intake
message before it gets drafted. Use web_search to check any fact you are
not already confident about — the correct CPIO/office name, a processing
timeline not already known, or a procedural detail — grounding it in a
real, current official Indian government source (the authority's own
site, a ministry site, or rtionline.gov.in). Known timelines, no need to
re-search these:
${SLA_HINT_LINES}

Write a short plain-text research note (a few sentences) covering: which
Public Authority this is likely about, the relevant processing timeline
if known, and any fact you verified or could not verify. Do not draft the
RTI letter yet — that happens in a later step. Do not return JSON.`;

type ResponsesApiResult = {
  output?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
};

/**
 * `output_text` is a convenience getter the official OpenAI SDKs add — it
 * does not exist on the raw REST response, which nests the text inside
 * output[].content[]. Calling the endpoint directly with fetch (no SDK)
 * means extracting it by hand.
 */
function extractOutputText(response: ResponsesApiResult): string {
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && part.text) return part.text;
    }
  }
  return "";
}

async function callResponses(key: string, body: Record<string, unknown>) {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-4.1-mini", ...body }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  return r.json() as Promise<ResponsesApiResult>;
}

export async function POST(request: Request) {
  const { message, history = [] } = await request.json();
  const key = process.env.OPENAI_API_KEY;

  // No real key configured yet — use the local matcher, honestly labeled.
  if (!key || key === PLACEHOLDER_KEY) {
    return NextResponse.json({ ...localFallbackResponse(message, history), source: "fallback" });
  }

  try {
    const input = [...history.slice(-6), { role: "user", content: message }];

    // Pass 1: grounded research with live web_search. OpenAI's Responses
    // API rejects combining the web_search tool with JSON-mode output
    // ("Web Search cannot be used with JSON mode"), so this pass runs in
    // plain text, and its findings feed the structured pass below.
    const research = await callResponses(key, {
      instructions: RESEARCH_INSTRUCTIONS,
      input,
      tools: [{ type: "web_search" }],
    });
    const researchNote = extractOutputText(research);

    // Pass 2: turn the grounded research into the strict structured reply.
    // OpenAI requires the literal word "json" inside `input`, not just
    // `instructions`, to use `text.format.type: "json_object"`.
    const instructions = SYSTEM_INSTRUCTIONS.replace(/\{\{TODAY\}\}/g, formatDate());
    const structured = await callResponses(key, {
      instructions: `${instructions}\n\nGrounded research notes from a live web search — use these facts where relevant:\n${researchNote}`,
      input: [...input, { role: "user", content: "Respond with valid JSON only, per the format instructions." }],
      text: { format: { type: "json_object" } },
    });

    const parsed = JSON.parse(extractOutputText(structured));
    return NextResponse.json({ ...parsed, source: "ai" });
  } catch (err) {
    // Live call failed (bad key, quota, network) — degrade gracefully
    // instead of dead-ending the demo.
    console.error("intake AI path failed:", err);
    return NextResponse.json({ ...localFallbackResponse(message, history), source: "fallback" });
  }
}
