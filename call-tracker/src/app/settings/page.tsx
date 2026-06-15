"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Settings } from "@/lib/types";

const TIMEZONES = [
  "Europe/Berlin",
  "Europe/London",
  "Europe/Madrid",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    setSaved(false);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
  }

  if (!settings) return null;

  const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneOptions = TIMEZONES.includes(settings.secondTimezone)
    ? TIMEZONES
    : [settings.secondTimezone, ...TIMEZONES];

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 p-4 dark:bg-black sm:p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Einstellungen</h1>
        <Link href="/" className="text-sm text-zinc-500 underline">
          Zurück
        </Link>
      </header>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-500">Tagesziel (Anrufe)</label>
        <input
          type="number"
          min={0}
          value={settings.dailyGoal}
          onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })}
          className="rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-500">
          Zweite Zeitzone für Textschnipsel
        </label>
        <p className="text-xs text-zinc-400">
          Deine Geräte-Zeitzone ({deviceTz}) wird immer angezeigt. Diese zweite
          Zeitzone wird zusätzlich ausgegeben (falls unterschiedlich).
        </p>
        <select
          value={settings.secondTimezone}
          onChange={(e) => setSettings({ ...settings, secondTimezone: e.target.value })}
          className="rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={save}
        className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
      >
        {saved ? "Gespeichert!" : "Speichern"}
      </button>
    </div>
  );
}
