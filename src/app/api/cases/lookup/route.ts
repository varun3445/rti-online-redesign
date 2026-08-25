import { NextResponse } from "next/server";
import { findCaseByIdLike } from "@/lib/rti-cases-db";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const found = await findCaseByIdLike(q);
  return NextResponse.json({ case: found ?? null });
}
