import { signOutAdmin } from "@/app/admin/login/actions";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminPeriodFilter } from "@/components/admin/AdminPeriodFilter";
import { AdminQuickAction } from "@/components/admin/AdminQuickAction";
import { AdminRecentBookings } from "@/components/admin/AdminRecentBookings";
import { AdminSystemStatus } from "@/components/admin/AdminSystemStatus";
import type { AdminDashboardData, RenterProductivityStat } from "@/lib/supabase/queries/admin-dashboard";

type Props = {
  data: AdminDashboardData;
  adminEmail: string | null;
};

function todayLabel() {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
}

function maskEmail(email: string | null) {
  if (!email) return "-";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sea">{eyebrow}</p>
      <h2 className="mt-1 font-serif text-2xl font-bold text-green-deep">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm font-semibold text-ink/50">{subtitle}</p>
      )}
    </div>
  );
}

function RenterProductivityBar({ stats }: { stats: RenterProductivityStat[] }) {
  if (!stats.length) return null;
  const maxConfirmed = stats[0].confirmedBookings;

  return (
    <section className="mt-5 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">Performance</p>
          <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">Top partner</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
            Partner attivi ordinati per booking confermati.
          </p>
        </div>
        <a
          className="shrink-0 rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-ink/55 transition hover:border-sea/30 hover:text-sea"
          href="/admin/renters"
        >
          Tutti
        </a>
      </div>
      <div className="mt-4 grid gap-3">
        {stats.map((stat, i) => {
          const barWidth = maxConfirmed > 0
            ? Math.round((stat.confirmedBookings / maxConfirmed) * 100)
            : 0;
          return (
            <div className="flex items-center gap-3" key={stat.renterId}>
              <span className="w-4 shrink-0 text-[10px] font-black text-ink/30 tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-ink">{stat.businessName}</p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {stat.pendingBookings > 0 && (
                      <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                        {stat.pendingBookings} att.
                      </span>
                    )}
                    <span className="text-[10px] font-black text-sea tabular-nums">
                      {stat.confirmedBookings}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sea to-mint"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-semibold text-ink/35 tabular-nums">
                {stat.vehicleCount}M
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function AdminDashboard({ data, adminEmail }: Props) {
  const { metrics } = data;
  const hasPendingBookings = metrics.pendingBookings.available && metrics.pendingBookings.value > 0;
  const hasPendingRenters = metrics.pendingRenters.available && metrics.pendingRenters.value > 0;
  const hasUrgencies = hasPendingBookings || hasPendingRenters;

  const totalActiveBookings = metrics.confirmedBookings.value + metrics.pendingBookings.value;
  const conversionRate =
    totalActiveBookings > 0
      ? Math.round((metrics.confirmedBookings.value / totalActiveBookings) * 100)
      : 0;
  const conversionAvailable =
    metrics.confirmedBookings.available && metrics.pendingBookings.available;

  return (
    <div className="min-h-screen bg-sand text-ink">
      {/* ─────────────────────────────────────────────────────
          TOP ADMIN NAVBAR
      ───────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7">
        {/* ─────────────────────────────────────────────────────
            PAGE HERO HEADER
        ───────────────────────────────────────────────────── */}
        <header className="relative overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-br from-white via-cream to-mint/20 p-6 shadow-soft sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-deep via-sea to-mint"
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 hidden h-full w-1/3 border-l border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0.5)_75%,transparent_75%,transparent)] bg-[length:22px_22px] opacity-30 lg:block"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-sea/20 bg-sea/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-sea">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sea shadow-[0_0_0_4px_rgba(0,151,171,0.12)]" />
                  Sistema operativo
                </span>
                <span className="rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 text-sm font-bold capitalize text-ink/50">
                  {todayLabel()}
                </span>
              </div>
              <h1 className="mt-5 font-serif text-3xl font-bold leading-tight text-ink sm:text-5xl">
                Dashboard IschiaMotion
              </h1>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-ink/60 sm:text-base">
                La control room per richieste, mezzi, partner e operativita giornaliera.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                className="min-h-[44px] rounded-full bg-green-deep px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sea"
                href="/admin/bookings"
              >
                Gestisci richieste
              </a>
              <a
                className="min-h-[44px] rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-deep"
                href="/admin/vehicle-models/new"
              >
                Nuovo modello veicolo
              </a>
              <a
                className="min-h-[44px] rounded-full border border-sea/25 bg-white/80 px-5 py-2.5 text-sm font-bold text-sea shadow-sm transition hover:border-sea/40 hover:bg-sea/10"
                href="/admin/vehicles/new"
              >
                Nuova offerta partner
              </a>
              <a
                className="min-h-[44px] rounded-full border border-ink/10 bg-white/75 px-5 py-2.5 text-sm font-bold text-ink/65 shadow-sm transition hover:border-sea/30 hover:text-sea"
                href="/admin/settings/payments"
              >
                Impostazioni pagamento
              </a>
              <a
                className="min-h-[44px] rounded-full border border-ink/10 bg-white/75 px-5 py-2.5 text-sm font-bold text-ink/65 shadow-sm transition hover:border-sea/30 hover:text-sea"
                href="https://www.ischiamotion.com/it"
                rel="noopener noreferrer"
                target="_blank"
              >
                Apri sito pubblico
              </a>
              <form action={signOutAdmin}>
                <button
                  className="min-h-[44px] rounded-full border border-ink/10 bg-white/65 px-5 py-2.5 text-sm font-bold text-ink/55 transition hover:border-ink/20 hover:text-ink"
                  type="submit"
                >
                  Esci
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────
            URGENCY BANNER
        ───────────────────────────────────────────────────── */}
        {hasUrgencies && (
          <section
            aria-label="Urgenze operative"
            className="mt-5 overflow-hidden rounded-2xl border-2 border-gold/45 bg-gradient-to-r from-amber-50 via-white to-cream p-5 shadow-md sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-xl font-black text-amber-700 shadow-sm"
              >
                !
              </span>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700/70">
                  Da gestire ora
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-amber-900">
                  Richiede attenzione
                </h2>
                <p className="mt-1 text-sm font-semibold text-amber-800/65">
                  Le attività che richiedono intervento immediato sono raccolte qui.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {hasPendingBookings && (
                    <a
                      className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
                      href="/admin/bookings"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold/15 text-sm font-black text-amber-700"
                      >
                        R
                      </span>
                      <div>
                        <p className="text-sm font-black text-ink">
                          {metrics.pendingBookings.value}{" "}
                          {metrics.pendingBookings.value === 1
                            ? "richiesta cliente in attesa"
                            : "richieste clienti in attesa"}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-green-deep px-3 py-1 text-xs font-bold text-white">
                          Gestisci richieste →
                        </span>
                      </div>
                    </a>
                  )}
                  {hasPendingRenters && (
                    <a
                      className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
                      href="/admin/renters"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold/15 text-sm font-black text-amber-700"
                      >
                        P
                      </span>
                      <div>
                        <p className="text-sm font-black text-ink">
                          {metrics.pendingRenters.value}{" "}
                          {metrics.pendingRenters.value === 1
                            ? "partner da valutare"
                            : "partner da valutare"}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-green-deep px-3 py-1 text-xs font-bold text-white">
                          Vai alle richieste →
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════
            SEZIONE 1 — KPI
        ═════════════════════════════════════════════════════ */}
        <section aria-label="Metriche operative" className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Panoramica"
              title="Metriche operative"
              subtitle="Dati in tempo reale dalla piattaforma."
            />
            <AdminPeriodFilter />
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
            <AdminKpiCard
              available={metrics.pendingBookings.available}
              detail="Richieste da gestire ora"
              href="/admin/bookings?status=pending"
              icon="R"
              label="Clienti in attesa"
              tone={hasPendingBookings ? "attention" : "default"}
              value={metrics.pendingBookings.value}
            />
            <AdminKpiCard
              available={metrics.pendingRenters.available}
              detail="Partner da valutare"
              href="/admin/renters?status=pending"
              icon="P"
              label="Partner pending"
              tone={hasPendingRenters ? "attention" : "default"}
              value={metrics.pendingRenters.value}
            />
            <AdminKpiCard
              available={metrics.activeVehicles.available}
              detail="Visibili nel marketplace"
              href="/admin/vehicles?status=active"
              icon="M"
              label="Offerte attive"
              tone="success"
              value={metrics.activeVehicles.value}
            />
            <AdminKpiCard
              available={metrics.activeRenters.available}
              detail="Partner operativi collegati"
              href="/admin/renters?status=active"
              icon="N"
              label="Partner attivi"
              tone="success"
              value={metrics.activeRenters.value}
            />
            <AdminKpiCard
              available={metrics.confirmedBookings.available}
              detail="Con disponibilità confermata"
              href="/admin/bookings?status=confirmed"
              icon="C"
              label="Booking confermati"
              value={metrics.confirmedBookings.value}
            />
            <AdminKpiCard
              available={metrics.generatedVouchers.available}
              detail="Voucher presenti in piattaforma"
              href="/admin/bookings?status=voucher_sent"
              icon="V"
              label="Voucher generati"
              value={metrics.generatedVouchers.value}
            />
            <AdminKpiCard
              available={metrics.completedCheckins.available}
              detail="Ritiri registrati internamente"
              href="/admin/bookings?status=checked_in"
              icon="Q"
              label="Check-in effettuati"
              value={metrics.completedCheckins.value}
            />
            <AdminKpiCard
              available={conversionAvailable}
              detail="Richieste confermate su totale attive"
              href="/admin/bookings"
              icon="%"
              label="Tasso conversione"
              suffix="%"
              tone="info"
              value={conversionRate}
            />
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════
            SEZIONE 2 — AZIONI RAPIDE
        ═════════════════════════════════════════════════════ */}
        <section aria-label="Azioni rapide" className="mt-10">
          <div className="mb-5">
            <SectionHeader
              eyebrow="Operazioni"
              title="Azioni rapide"
              subtitle="Accedi direttamente alle sezioni operative."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <AdminQuickAction
              accent="bg-green-deep text-white"
              description="Apri la coda booking, assegna partner e aggiorna stati operativi."
              href="/admin/bookings"
              icon="R"
              pendingCount={
                metrics.pendingBookings.available ? metrics.pendingBookings.value : undefined
              }
              title="Gestisci richieste"
            />
            <AdminQuickAction
              accent="bg-ink text-white"
              description="Crea una scheda pubblica per auto, scooter, barche o gommoni."
              href="/admin/vehicle-models/new"
              icon="+"
              title="Nuovo modello veicolo"
            />
            <AdminQuickAction
              accent="bg-sea/10 text-sea"
              description="Collega un partner a un modello esistente con prezzo e pickup point."
              href="/admin/vehicles/new"
              icon="+"
              title="Nuova offerta partner"
            />
            <AdminQuickAction
              accent="bg-sand text-ink"
              description="Modifica disponibilità, prezzi, categorie e dettagli dei mezzi attivi."
              href="/admin/vehicles"
              icon="M"
              title="Gestisci offerte"
            />
            <AdminQuickAction
              accent="bg-amber-50 text-amber-800"
              description="Gestisci anagrafiche partner, fornitori e accessi quando il portale e attivo."
              href="/admin/renters"
              icon="P"
              pendingCount={
                metrics.pendingRenters.available ? metrics.pendingRenters.value : undefined
              }
              title="Gestisci partner"
            />
            <AdminQuickAction
              accent="bg-white text-ink"
              description="Aggiorna credenziali e dati dell'account amministratore."
              href="/admin/account"
              icon="A"
              title="Account e password"
            />
            <AdminQuickAction
              accent="bg-sea/10 text-sea"
              description="Configura le coordinate usate nelle email di richiesta acconto."
              href="/admin/settings/payments"
              icon="$"
              title="Impostazioni pagamento"
            />
            <AdminQuickAction
              accent="bg-mint/20 text-green-deep"
              description="Controlla l'esperienza cliente pubblica su ischiamotion.com."
              external
              href="https://www.ischiamotion.com/it"
              icon="↗"
              title="Apri sito pubblico"
            />
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════
            SEZIONE 3 — OPERATIVO
        ═════════════════════════════════════════════════════ */}
        <section aria-label="Attività operativa" className="mt-10">
          <div className="mb-5">
            <SectionHeader
              eyebrow="Monitoraggio"
              title="Attività operativa"
              subtitle="Booking recenti, partner pipeline e stato piattaforma."
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
            <AdminRecentBookings
              bookings={data.recentBookings}
              error={data.recentBookingsError}
            />

            <div className="grid gap-5">
              {/* Partner pipeline */}
              <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sea/70">
                      Partner pipeline
                    </p>
                    <h2 className="mt-1.5 font-serif text-xl font-bold text-green-deep">
                      Nuovi partner
                    </h2>
                    <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
                      Richieste partner da valutare con calma operativa.
                    </p>
                  </div>
                  <a
                    className="shrink-0 rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-ink/55 transition hover:border-sea/30 hover:text-sea"
                    href="/admin/renters"
                  >
                    Valuta
                  </a>
                </div>

                {data.pendingRenterApplicationsError ? (
                  <div className="mt-4 rounded-xl border border-gold/20 bg-amber-50 p-3.5 text-xs font-semibold text-ink/65">
                    Impossibile caricare le richieste partner.
                  </div>
                ) : null}

                {!data.pendingRenterApplicationsError &&
                data.pendingRenterApplications.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-sea/15 bg-sea/5 p-4 text-xs font-semibold text-sea">
                    Nessuna richiesta partner in attesa. Pipeline partner ordinata.
                  </div>
                ) : null}

                <div className="mt-4 grid gap-2.5">
                  {data.pendingRenterApplications.map((application) => (
                    <a
                      className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-gradient-to-br from-sand/40 to-white p-3.5 transition hover:-translate-y-0.5 hover:border-sea/25 hover:shadow-sm"
                      href={`/admin/renters/${application.id}`}
                      key={application.id}
                    >
                      <span
                        aria-hidden="true"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-deep text-sm font-black text-white"
                      >
                        {(application.business_name || "N").slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-ink">
                          {application.business_name || "Partner"}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-ink/55">
                          {application.contact_name || "Referente non indicato"}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-ink/38">
                          {maskEmail(application.email)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-black text-amber-700 transition group-hover:bg-gold/20">
                        Pending
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              <AdminSystemStatus />
            </div>
          </div>

          <RenterProductivityBar stats={data.renterProductivity} />
        </section>

        {/* Footer */}
        <p className="mt-8 text-xs font-semibold text-ink/35">
          Accesso: {adminEmail || "admin"}
        </p>
      </main>
    </div>
  );
}
