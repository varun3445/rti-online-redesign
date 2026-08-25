import { NextResponse } from "next/server";
import { fetchCasesForEmail, createCase } from "@/lib/rti-cases-db";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email") ?? undefined;
  const cases = await fetchCasesForEmail(email);
  return NextResponse.json({ cases });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, subject, authority, applicantEmail, applicantName, applicantAddress, draftText } = body;

  if (!id || !subject || !authority?.code || !applicantEmail) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  await createCase({ id, subject, authority, applicantEmail, applicantName, applicantAddress, draftText });
  return NextResponse.json({ ok: true });
}
