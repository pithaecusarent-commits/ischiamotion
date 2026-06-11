import { savePaymentSettingsAction } from "@/app/admin/settings/payments/actions";
import { signOutAdmin } from "@/app/admin/login/actions";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminPaymentSettings } from "@/lib/supabase/queries/admin-payment-settings";

type Props = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

export default async function AdminPaymentSettingsPage({ searchParams }: Props) {
  const { accessToken } = await requireAdmin("/admin/settings/payments");
  const { settings, error } = await getAdminPaymentSettings(accessToken);

  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-4xl rounded-[30px] bg-cream p-6 shadow-soft sm:p-8">
        <p className="section-kicker">Admin</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">Impostazioni pagamento</h1>
            <p className="mt-3 max-w-2xl text-ink/65">
              Configura le coordinate usate nelle email di richiesta acconto.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin">
              Area admin
            </a>
            <a className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" href="/admin/bookings">
              Prenotazioni
            </a>
            <form action={signOutAdmin}>
              <button className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70" type="submit">
                Esci
              </button>
            </form>
          </div>
        </div>

        {searchParams?.saved ? (
          <div className="mt-6 rounded-3xl border border-sea/20 bg-sea/10 p-4 text-sm font-bold text-green-deep">
            Impostazioni pagamento salvate correttamente.
          </div>
        ) : null}

        {searchParams?.error || error ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {searchParams?.error || error}
          </div>
        ) : null}

        <form action={savePaymentSettingsAction} className="mt-6 grid gap-5">
          <section className="grid gap-4 rounded-3xl border border-ink/10 bg-white/70 p-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">Metodi di pagamento disponibili</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Stripe e PayPal sono predisposti ma non ancora integrati. Attivarli ora serve solo a prepararne la configurazione futura.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex min-h-24 items-start gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
                <input
                  className="mt-1 h-4 w-4"
                  name="bank_transfer_enabled"
                  type="checkbox"
                  defaultChecked={settings?.bank_transfer_enabled ?? true}
                />
                <span>
                  <span className="block font-bold text-ink">Bonifico bancario</span>
                  <span className="mt-1 block leading-5">Usato per le email acconto.</span>
                </span>
              </label>
              <label className="flex min-h-24 items-start gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
                <input
                  className="mt-1 h-4 w-4"
                  name="stripe_enabled"
                  type="checkbox"
                  defaultChecked={settings?.stripe_enabled ?? false}
                />
                <span>
                  <span className="flex flex-wrap items-center gap-2 font-bold text-ink">
                    Stripe
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800">Non ancora collegato al checkout</span>
                  </span>
                  <span className="mt-1 block leading-5">Predisposto, non ancora attivo nel checkout.</span>
                </span>
              </label>
              <label className="flex min-h-24 items-start gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
                <input
                  className="mt-1 h-4 w-4"
                  name="paypal_enabled"
                  type="checkbox"
                  defaultChecked={settings?.paypal_enabled ?? false}
                />
                <span>
                  <span className="flex flex-wrap items-center gap-2 font-bold text-ink">
                    PayPal
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800">Non ancora collegato al checkout</span>
                  </span>
                  <span className="mt-1 block leading-5">Predisposto, non ancora attivo nel checkout.</span>
                </span>
              </label>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Intestatario conto
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="bank_account_holder"
                defaultValue={settings?.bank_account_holder || ""}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              IBAN
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="iban"
                defaultValue={settings?.iban || ""}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Banca
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="bank_name"
                defaultValue={settings?.bank_name || ""}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              BIC / SWIFT
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="bic_swift"
                defaultValue={settings?.bic_swift || ""}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70 md:col-span-2">
              Causale predefinita
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="payment_reason_template"
                defaultValue={settings?.payment_reason_template || "Acconto richiesta {bookingCode} - IschiaMotion"}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Istruzioni acconto IT
              <textarea
                className="min-h-[150px] rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="deposit_instructions_it"
                defaultValue={settings?.deposit_instructions_it || "Effettua il bonifico alle coordinate indicate. Dopo il pagamento, invia la ricevuta rispondendo a questa email o tramite WhatsApp."}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Istruzioni acconto EN
              <textarea
                className="min-h-[150px] rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="deposit_instructions_en"
                defaultValue={settings?.deposit_instructions_en || "Please make the bank transfer using the details below. After payment, send the receipt by replying to this email or via WhatsApp."}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              Email per ricevute
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="receipt_email"
                type="email"
                defaultValue={settings?.receipt_email || ""}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/70">
              WhatsApp per ricevute
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-sea/50"
                name="receipt_whatsapp"
                defaultValue={settings?.receipt_whatsapp || ""}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm font-bold text-ink/70">
            <input
              className="h-4 w-4"
              name="is_active"
              type="checkbox"
              defaultChecked={settings?.is_active ?? true}
            />
            Attivo
          </label>

          <div className="rounded-3xl border border-sea/10 bg-white/70 p-4 text-sm leading-6 text-ink/65">
            Queste coordinate vengono usate nelle email di richiesta acconto. Le note pagamento della singola booking restano disponibili per eventuali istruzioni extra.
          </div>

          <div className="flex justify-end">
            <button className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white" type="submit">
              Salva impostazioni pagamento
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
