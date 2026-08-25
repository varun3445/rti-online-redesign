import { NextResponse } from "next/server";
import { mockAuthorities } from "@/lib/mock-authorities";
import { localFallbackResponse } from "@/lib/local-intake-fallback";

const PLACEHOLDER_KEY = "your_openai_api_key_here";

const SYSTEM_INSTRUCTIONS = `You are a plain-language RTI intake assistant for a
prototype, not legal advice. Use only this mock Public Authority dataset:
${JSON.stringify(mockAuthorities)}. Ground text in the Right to Information Act,
2005. Correctly use Public Authority, CPIO, Nodal Officer. Fee: ₹10 for
non-BPL; waived for BPL applicants attaching a valid BPL certificate; First
Appeal has no fee. If vague, ask exactly one clarifying question and return
JSON {reply,needsClarification:true}. Otherwise return ONLY JSON
{reply,needsClarification:false,authority:{code,name,ministry},draft}. Draft a
concise CPIO-addressed request with numbered points. Never claim to file a
real request. Never add a character limit or whitelist.`;

export async function POST(request: Request) {
  const { message, history = [] } = await request.json();
  const key = process.env.OPENAI_API_KEY;

  // No real key configured yet — use the local matcher, honestly labeled.
  if (!key || key === PLACEHOLDER_KEY) {
    return NextResponse.json({ ...localFallbackResponse(message, history), source: "fallback" });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: SYSTEM_INSTRUCTIONS,
        input: [...history.slice(-6), { role: "user", content: message }],
        text: { format: { type: "json_object" } },
      }),
    });

    if (!r.ok) {
      // Live call failed (bad key, quota, network) — degrade gracefully
      // instead of dead-ending the demo.
      return NextResponse.json({ ...localFallbackResponse(message, history), source: "fallback" });
    }

    const j = await r.json();
    const parsed = JSON.parse(j.output_text);
    return NextResponse.json({ ...parsed, source: "ai" });
  } catch {
    return NextResponse.json({ ...localFallbackResponse(message, history), source: "fallback" });
  }
}
