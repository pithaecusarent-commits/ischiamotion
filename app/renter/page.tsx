import Link from "next/link";
import { requireRenter } from "@/lib/supabase/renter-auth";
import { getRenterBookings, getRenterIds } from "@/lib/supabase/queries/renter";
import { AccessDenied, RenterShell } from "@/app/renter/renter-ui";

const cards = [
  {
    title: "Prenotazioni assegnate",
    text: "Consulta le prenotazioni collegate al tuo noleggio.",
    href: "/renter/bookings"
  },
  {
    title: "Disponibilita categorie",
    text: "Apri o chiudi le categorie disponibili per IschiaMotion.",
    href: "/renter/availability"
  },
  {
    title: "Listino stagionale",
    text: "Imposta prezzi dal/al per ogni mezzo e periodo.",
    href: "/renter/pricing"
  },
  {
    title: "Check-in voucher",
    text: "Registra il ritiro inserendo il codice voucher.",
    href: "/renter/checkin"
  }
];

export default async function RenterPage() {
  const session = await requireRenter("/renter");

  if (session.denied) {
    return <AccessDenied accountStatus={session.profile?.account_status} />;
  }

  const [linksResult, bookingsResult] = await Promise.all([
    getRenterIds(session.accessToken),
    getRenterBookings(session.accessToken)
  ]);

  return (
    <RenterShell title="Mini area noleggiatore">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-[28px] border border-ink/10 bg-white/70 p-6 hover:border-sea/30">
            <h2 className="font-serif text-2xl font-bold">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">{card.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6">
          <p className="section-kicker">Totale</p>
          <p className="mt-3 text-4xl font-bold">{bookingsResult.bookings.length}</p>
          <p className="mt-2 text-sm text-ink/60">Prenotazioni visibili per il tuo account.</p>
        </div>
        <div className="rounded-[28px] border border-ink/10 bg-white/70 p-6">
          <p className="section-kicker">Collegamento</p>
          <p className="mt-3 text-4xl font-bold">{linksResult.renterIds.length}</p>
          <p className="mt-2 text-sm text-ink/60">Noleggi collegati al tuo utente.</p>
        </div>
      </div>

      {linksResult.error || bookingsResult.error ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
          {linksResult.error || bookingsResult.error}
        </div>
      ) : null}
    </RenterShell>
  );
}
