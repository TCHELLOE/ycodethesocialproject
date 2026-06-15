import { NextRequest, NextResponse } from "next/server";
import { updateCall, todayKey } from "@/lib/store";
import { CallOutcome } from "@/lib/types";

const VALID_OUTCOMES: CallOutcome[] = ["answered", "ring", "voicemail"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const date = body.date ?? todayKey();

  const patch: { outcome?: CallOutcome; note?: string } = {};
  if (body.outcome !== undefined) {
    if (!VALID_OUTCOMES.includes(body.outcome)) {
      return NextResponse.json({ error: "invalid outcome" }, { status: 400 });
    }
    patch.outcome = body.outcome;
  }
  if (body.note !== undefined) {
    patch.note = String(body.note);
  }

  const updated = await updateCall(date, id, patch);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
