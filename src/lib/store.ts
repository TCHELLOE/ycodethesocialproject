import { redis } from "./redis";
import { CallEntry, DEFAULT_SETTINGS, Settings } from "./types";

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function callsKey(date: string): string {
  return `calls:${date}`;
}

export async function getSettings(): Promise<Settings> {
  const settings = await redis.get<Settings>("settings");
  return settings ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await redis.set("settings", settings);
}

export async function getCalls(date: string): Promise<CallEntry[]> {
  const calls = await redis.get<CallEntry[]>(callsKey(date));
  return calls ?? [];
}

export async function addCall(entry: CallEntry): Promise<void> {
  const date = entry.startedAt.slice(0, 10);
  const calls = await getCalls(date);
  calls.push(entry);
  await redis.set(callsKey(date), calls);
}

export async function updateCall(
  date: string,
  id: string,
  patch: Partial<CallEntry>
): Promise<CallEntry | null> {
  const calls = await getCalls(date);
  const idx = calls.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  calls[idx] = { ...calls[idx], ...patch };
  await redis.set(callsKey(date), calls);
  return calls[idx];
}
