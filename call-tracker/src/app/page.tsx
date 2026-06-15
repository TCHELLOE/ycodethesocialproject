"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CallEntry, Settings } from "@/lib/types";

const OUTCOME_LABELS: Record<string, string> = {
  answered: "Erreicht",
  ring: "Nur geklingelt",
  voicemail: "Mailbox",
};

export default function Dashboard() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [calls, setCalls] = useState<CallEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
    fetch("/api/calls").then((r) => r.json()).then(setCalls);
  }, []);

  const total = calls?.length ?? 0;
  const answered = calls?.filter((c) => c.outcome === "answered").length ?? 0;
  const goal = settings?.dailyGoal ?? 0;
  const progress = goal > 0 ? Math.min(100, Math.round((total / goal) * 100)) : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 p-4 pb-24 dark:bg-black sm:p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Call Tracker</h1>
        <Link href="/settings" className="text-sm text-zinc-500 underline">
          Einstellungen
        </Link>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Heute</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-4xl font-bold">{total}</span>
          <span className="pb-1 text-zinc-500">/ {goal} Anrufe</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          <span className="font-semibold text-emerald-600">{answered}</span> erreicht
        </p>
      </section>

      <Link
        href="/call/new"
        className="flex items-center justify-center rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
      >
        Neuer Anruf
      </Link>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-zinc-500">Heutige Anrufe</h2>
        {calls?.length === 0 && (
          <p className="text-sm text-zinc-400">Noch keine Anrufe heute.</p>
        )}
        {calls
          ?.slice()
          .reverse()
          .map((call) => (
            <div
              key={call.id}
              className="flex flex-col gap-1 rounded-xl bg-white p-3 shadow-sm dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {call.name || call.phone || "Unbekannt"}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(call.startedAt).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {call.phone && call.name && (
                <span className="text-xs text-zinc-400">{call.phone}</span>
              )}
              {call.outcome && (
                <span
                  className={`self-start rounded-full px-2 py-0.5 text-xs font-medium ${
                    call.outcome === "answered"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {OUTCOME_LABELS[call.outcome]}
                </span>
              )}
              {call.note && <p className="text-sm text-zinc-600 dark:text-zinc-400">{call.note}</p>}
            </div>
          ))}
      </section>
    </div>
  );
}
