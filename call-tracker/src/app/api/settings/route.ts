import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/store";
import { DEFAULT_SETTINGS } from "@/lib/types";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const dailyGoal = Number(body.dailyGoal);
  const secondTimezone = String(body.secondTimezone ?? DEFAULT_SETTINGS.secondTimezone);

  if (!Number.isFinite(dailyGoal) || dailyGoal < 0) {
    return NextResponse.json({ error: "invalid dailyGoal" }, { status: 400 });
  }

  const settings = { dailyGoal, secondTimezone };
  await saveSettings(settings);
  return NextResponse.json(settings);
}
