"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (res.ok) {
      router.push(params.get("from") ?? "/");
    } else {
      setError(true);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
    >
      <h1 className="text-xl font-semibold text-center">Call Tracker</h1>
      <input
        type="password"
        inputMode="numeric"
        autoFocus
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="rounded-lg border border-zinc-300 px-4 py-3 text-center text-lg tracking-widest dark:border-zinc-700 dark:bg-zinc-800"
      />
      {error && (
        <p className="text-center text-sm text-red-600">Falsche PIN</p>
      )}
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white dark:bg-white dark:text-zinc-900"
      >
        Login
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
