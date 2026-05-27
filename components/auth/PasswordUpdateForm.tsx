"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Status = {
  tone: "success" | "error" | "info";
  message: string;
};

export function PasswordUpdateForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({
    tone: "info",
    message: "Verifica del link di reset in corso."
  });

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function prepareSession() {
      if (!supabase) {
        if (isMounted) {
          setStatus({ tone: "error", message: "Configurazione Supabase mancante." });
        }
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (isMounted) {
            setStatus({ tone: "error", message: "Link di reset non valido o scaduto." });
          }
          return;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!data.session) {
        setStatus({ tone: "error", message: "Link di reset non valido o scaduto." });
        return;
      }

      setIsReady(true);
      setStatus({ tone: "info", message: "Inserisci una nuova password." });
    }

    prepareSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isReady) return;

    if (password.length < 8) {
      setStatus({ tone: "error", message: "La password deve avere almeno 8 caratteri." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ tone: "error", message: "Le password non coincidono." });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setStatus({ tone: "error", message: "Impossibile aggiornare la password. Richiedi un nuovo link." });
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus({ tone: "success", message: "Password aggiornata" });
  }

  const toneClass = status.tone === "success"
    ? "border-sea/20 bg-sea/10 text-green-deep"
    : status.tone === "error"
      ? "border-amber-200 bg-amber-50 text-ink/70"
      : "border-ink/10 bg-white/70 text-ink/60";

  return (
    <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
      <div className={`rounded-3xl border p-4 text-sm font-bold ${toneClass}`}>
        {status.message}
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink/70">
        Nuova password
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50 disabled:opacity-60"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={!isReady || status.tone === "success"}
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink/70">
        Conferma password
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50 disabled:opacity-60"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={!isReady || status.tone === "success"}
          required
        />
      </label>

      <button
        className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={!isReady || isSubmitting || status.tone === "success"}
      >
        {isSubmitting ? "Aggiornamento..." : "Aggiorna password"}
      </button>

      {status.tone === "success" ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <a className="font-bold text-green-deep hover:text-ink" href="/admin/login">
            Vai al login admin
          </a>
          <a className="font-bold text-green-deep hover:text-ink" href="/renter/login">
            Vai al login noleggiatore
          </a>
        </div>
      ) : null}
    </form>
  );
}
