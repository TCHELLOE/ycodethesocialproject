import { NextRequest, NextResponse } from "next/server";
import { addCall, getCalls, todayKey } from "@/lib/store";
import { CallEntry } from "@/lib/types";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? todayKey();
  const calls = await getCalls(date);
  return NextResponse.json(calls);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const entry: CallEntry = {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    phone: body.phone ? String(body.phone) : undefined,
    name: body.name ? String(body.name) : undefined,
  };

  await addCall(entry);
  return NextResponse.json(entry);
}
