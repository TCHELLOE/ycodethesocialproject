"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CallEntry, CallOutcome, Settings } from "@/lib/types";

type Step = "form" | "outcome" | "note" | "snippet";

const OUTCOME_LABELS: Record<CallOutcome, string> = {
  answered: "Erreicht",
  ring: "Hat nur geklingelt",
  voicemail: "Mailbox erreicht",
};

function buildSnippet(call: CallEntry, outcome: CallOutcome, secondTimezone: string): string {
  const startedAt = new Date(call.startedAt);
  const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date = startedAt.toLocaleDateString("de-DE", { timeZone: deviceTz });
  const deviceTime = startedAt.toLocaleTimeString("de-DE", {
    timeZone: deviceTz,
    hour: "2-digit",
    minute: "2-digit",
  });

  let timePart = `${deviceTime} Uhr (${deviceTz})`;
  if (secondTimezone !== deviceTz) {
    const secondTime = startedAt.toLocaleTimeString("de-DE", {
      timeZone: secondTimezone,
      hour: "2-digit",
      minute: "2-digit",
    });
    timePart += ` / ${secondTime} Uhr (${secondTimezone})`;
  }

  return `Angerufen am ${date} um ${timePart} – ${OUTCOME_LABELS[outcome]}`;
}

export default function NewCallPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState<CallEntry | null>(null);
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [note, setNote] = useState("");
  const [snippet, setSnippet] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function startCall() {
    const res = await fetch("/api/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone || undefined, name: name || undefined }),
    });
    const entry: CallEntry = await res.json();
    setCall(entry);
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
    setStep("outcome");
  }

  async function chooseOutcome(chosen: CallOutcome) {
    if (!call) return;
    setOutcome(chosen);

    if (chosen === "answered") {
      setStep("note");
      return;
    }

    await fetch(`/api/calls/${call.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome: chosen }),
    });
    setSnippet(buildSnippet(call, chosen, settings?.secondTimezone ?? "Europe/Berlin"));
    setStep("snippet");
  }

  async function saveNote() {
    if (!call || !outcome) return;
    await fetch(`/api/calls/${call.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome, note: note || undefined }),
    });
    router.push("/");
  }

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 p-4 dark:bg-black sm:p-8">
      <h1 className="text-2xl font-semibold">Neuer Anruf</h1>

      {step === "form" && (
        <div className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="Telefonnummer (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            onClick={startCall}
            className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
          >
            Anruf starten
          </button>
        </div>
      )}

      {step === "outcome" && (
        <div className="flex flex-col gap-4">
          <p className="text-zinc-500">Ist jemand drangegangen?</p>
          <button
            onClick={() => chooseOutcome("answered")}
            className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
          >
            Erreicht
          </button>
          <button
            onClick={() => chooseOutcome("ring")}
            className="rounded-2xl bg-zinc-200 py-4 text-lg font-semibold text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
          >
            Hat nur geklingelt
          </button>
          <button
            onClick={() => chooseOutcome("voicemail")}
            className="rounded-2xl bg-zinc-200 py-4 text-lg font-semibold text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
          >
            Mailbox erreicht
          </button>
        </div>
      )}

      {step === "note" && (
        <div className="flex flex-col gap-4">
          <p className="text-zinc-500">Kurzes Feedback zum Call (optional)</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            placeholder="Was ist während des Calls passiert?"
            className="rounded-xl border border-zinc-300 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            onClick={saveNote}
            className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
          >
            Speichern
          </button>
        </div>
      )}

      {step === "snippet" && (
        <div className="flex flex-col gap-4">
          <p className="text-zinc-500">Textschnipsel für deine Tabelle:</p>
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm dark:bg-zinc-900">
            {snippet}
          </div>
          <button
            onClick={copySnippet}
            className="rounded-2xl bg-zinc-200 py-4 text-lg font-semibold text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
          >
            {copied ? "Kopiert!" : "Kopieren"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white shadow-sm"
          >
            Fertig
          </button>
        </div>
      )}
    </div>
  );
}
