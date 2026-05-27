import Link from "next/link";
import type { ReactNode } from "react";
import { signOutRenter } from "@/app/renter/login/actions";

export function RenterShell({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-[30px] bg-cream p-6 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">{eyebrow || "Noleggiatore"}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold">{title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <NavLink href="/renter">Area</NavLink>
            <NavLink href="/renter/bookings">Prenotazioni</NavLink>
            <NavLink href="/renter/availability">Disponibilita</NavLink>
            <NavLink href="/renter/checkin">Check-in</NavLink>
            <NavLink href="/renter/account">Account</NavLink>
            <form action={signOutRenter}>
              <button className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep">
                Esci
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}

export function AccessDenied({ accountStatus }: { accountStatus?: "pending" | "approved" | "rejected" | "disabled" }) {
  const message = accountStatus === "pending"
    ? "Registrazione ricevuta. Il tuo account è in attesa di approvazione admin."
    : accountStatus === "rejected"
      ? "La registrazione non è stata autorizzata. Contatta IschiaMotion per maggiori informazioni."
      : accountStatus === "disabled"
        ? "Account noleggiatore disattivato. Non puoi accedere o ricevere nuove richieste. Contatta IschiaMotion."
        : "Il tuo utente non ha il ruolo noleggiatore. Accedi con un account abilitato da IschiaMotion.";

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-xl rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Accesso negato</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Area noleggiatore non disponibile</h1>
        <p className="mt-4 text-ink/65">
          {message}
        </p>
        <Link className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" href="/renter/login">
          Torna al login
        </Link>
      </section>
    </main>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-ink/10 bg-white/70 p-8 text-center">
      <h2 className="font-serif text-3xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-ink/65">{text}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  const tone = status === "checked_in"
    ? "border-green-deep/20 bg-green-deep/10 text-green-deep"
    : status === "cancelled" || status === "no_show"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-sea/20 bg-sea/10 text-green-deep";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${tone}`}>
      {label}
    </span>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-bold text-ink/70 hover:border-sea/30 hover:text-green-deep" href={href}>
      {children}
    </Link>
  );
}
