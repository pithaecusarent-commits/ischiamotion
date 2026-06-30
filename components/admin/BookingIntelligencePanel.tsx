import type { AdminCheckin } from "@/lib/supabase/queries/checkins";
import type { AdminBookingItem } from "@/lib/supabase/queries/admin-bookings";
import type { AdminVoucher } from "@/lib/supabase/queries/vouchers";
import { isNauticalCategory } from "@/lib/vehicle-categories";
import { WhatsAppCopilot } from "@/components/admin/WhatsAppCopilot";

type BookingIntelligencePanelProps = {
  booking: AdminBookingItem;
  voucher: AdminVoucher | null;
  checkin: AdminCheckin | null;
};

type PriorityLevel = "urgent" | "hot" | "normal" | "low";

const handledStatuses = new Set(["cancelled", "completed", "checked_in", "no_show"]);

const priorityStyles: Record<PriorityLevel, { label: string; className: string }> = {
  urgent: {
    label: "⚡ Urgente",
    className: "border-amber-200 bg-amber-50 text-amber-800"
  },
  hot: {
    label: "🔥 Richiesta calda",
    className: "border-rose-200 bg-rose-50 text-rose-800"
  },
  normal: {
    label: "🕒 Normale",
    className: "border-blue-200 bg-blue-50 text-blue-800"
  },
  low: {
    label: "✅ Gestita",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800"
  }
};

function getBookingNoteValue(notes: string | null, label: "Vehicle" | "Pickup point") {
  if (!notes) return "";
  const line = notes.split("\n").find((item) => item.startsWith(`${label}: `));
  return line?.replace(`${label}: `, "") || "";
}

function getVehicleLabel(booking: AdminBookingItem) {
  if (booking.customer_language === "en") {
    return booking.vehicles?.title_en || booking.vehicles?.title_it || getBookingNoteValue(booking.notes, "Vehicle") || "your rental";
  }

  return booking.vehicles?.title_it || getBookingNoteValue(booking.notes, "Vehicle") || "il mezzo richiesto";
}

function daysUntilStart(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const now = new Date();
  return (start.getTime() - now.getTime()) / 86_400_000;
}

function rentalDays(booking: AdminBookingItem) {
  const start = new Date(`${booking.start_date}T00:00:00`);
  const end = new Date(`${booking.end_date}T00:00:00`);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
}

function formatDate(value: string, locale: "it" | "en") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function nauticalFromBooking(booking: AdminBookingItem) {
  const slug = booking.vehicles?.vehicle_categories?.slug;
  const label = `${getVehicleLabel(booking)} ${booking.vehicles?.vehicle_categories?.name_it || ""}`.toLowerCase();
  return isNauticalCategory(slug) || ["barca", "gommone", "beach club", "boat"].some((term) => label.includes(term));
}

function analyzePriority(booking: AdminBookingItem, isNautical: boolean) {
  const reasons: string[] = [];
  const duration = rentalDays(booking);
  const startsSoon = daysUntilStart(booking.start_date) <= 2 && daysUntilStart(booking.start_date) >= -1;

  if (startsSoon && ["pending", "confirmed"].includes(booking.status)) {
    reasons.push("Ritiro previsto entro 48 ore");
  }
  if (isNautical) reasons.push("Categoria ad alto valore");
  if (booking.customer_phone) reasons.push("Cliente contattabile su WhatsApp");
  if (duration >= 4) reasons.push("Durata noleggio interessante");
  if (booking.status === "pending") reasons.push("Richiesta ancora in attesa di conferma");

  let level: PriorityLevel = "normal";
  if (handledStatuses.has(booking.status)) level = "low";
  else if (startsSoon && ["pending", "confirmed"].includes(booking.status)) level = "urgent";
  else if (duration >= 4 || isNautical || Boolean(booking.customer_phone)) level = "hot";

  if (level === "low" && reasons.length === 0) reasons.push("Richiesta già gestita o chiusa");
  if (level === "normal" && reasons.length === 0) reasons.push("Nessun segnale operativo critico");

  return { level, reasons };
}

function nextActions(booking: AdminBookingItem, isNautical: boolean) {
  const byStatus: Record<string, string> = {
    pending: "Verifica disponibilità con il partner e contatta il cliente.",
    confirmed: "Genera o invia il voucher al cliente.",
    voucher_sent: "Attendi il cliente al punto di ritiro o prepara il check-in.",
    checked_in: "Check-in completato. Nessuna azione urgente.",
    cancelled: "Richiesta annullata. Nessuna azione richiesta.",
    no_show: "Cliente segnato come no-show.",
    completed: "Richiesta completata."
  };
  const actions = [byStatus[booking.status] || "Verifica lo stato operativo della richiesta."];

  if (booking.delivery_method === "hotel_delivery") {
    actions.push("Verifica indirizzo e orario di consegna in hotel.");
  }
  if (isNautical) {
    actions.push("Verifica condizioni meteo/marine e punto ritiro nautico.");
  }

  return actions;
}

function whatsappMessage(booking: AdminBookingItem, vehicleLabel: string) {
  const name = booking.customer_first_name || (booking.customer_language === "en" ? "there" : "ciao");
  const start = formatDate(booking.start_date, booking.customer_language);
  const end = formatDate(booking.end_date, booking.customer_language);

  if (booking.customer_language === "en") {
    const messages: Record<string, string> = {
      pending: `Hi ${name}, we received your request for ${vehicleLabel} from ${start} to ${end}. We are checking availability with our selected local partners and will update you shortly.`,
      confirmed: `Hi ${name}, we confirm availability for ${vehicleLabel} from ${start} to ${end}. We will send you all pickup/delivery details.`,
      voucher_sent: `Hi ${name}, your IschiaMotion voucher has been generated. Please keep it and show it at pickup.`,
      cancelled: `Hi ${name}, we are sorry to inform you that we cannot confirm the requested availability for ${vehicleLabel} on the selected dates. We can check alternative solutions.`
    };
    return messages[booking.status] || messages.pending;
  }

  const messages: Record<string, string> = {
    pending: `Ciao ${name}, abbiamo ricevuto la tua richiesta per ${vehicleLabel} dal ${start} al ${end}. Stiamo verificando la disponibilità con i nostri partner locali selezionati e ti aggiorniamo a breve.`,
    confirmed: `Ciao ${name}, ti confermiamo la disponibilità per ${vehicleLabel} dal ${start} al ${end}. Ti invieremo tutti i dettagli per il ritiro/consegna.`,
    voucher_sent: `Ciao ${name}, il tuo voucher IschiaMotion è stato generato. Ti ricordiamo di conservarlo e mostrarlo al momento del ritiro.`,
    cancelled: `Ciao ${name}, ci dispiace informarti che non possiamo confermare la disponibilità richiesta per ${vehicleLabel} nelle date selezionate. Possiamo verificare soluzioni alternative.`
  };
  return messages[booking.status] || messages.pending;
}

function TimelineItem({ label, detail, done }: { label: string; detail: string; done?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${done ? "bg-green-deep" : "bg-ink/20"}`} />
      <span>
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span className="block text-xs leading-5 text-ink/55">{detail}</span>
      </span>
    </li>
  );
}

export function BookingIntelligencePanel({ booking, voucher, checkin }: BookingIntelligencePanelProps) {
  const isNautical = nauticalFromBooking(booking);
  const vehicleLabel = getVehicleLabel(booking);
  const priority = analyzePriority(booking, isNautical);
  const priorityStyle = priorityStyles[priority.level];
  const actions = nextActions(booking, isNautical);
  const message = whatsappMessage(booking, vehicleLabel);
  const checkinDone = booking.status === "checked_in" || Boolean(checkin);

  return (
    <div className="mt-5 rounded-[28px] border border-sea/15 bg-white/80 p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Assistente operativo</div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Booking Intelligence</h2>
        </div>
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${priorityStyle.className}`}>
          {priorityStyle.label}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-ink/10 bg-cream/65 p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Perché</div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">
              {priority.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Prossima azione</div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">
              {actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        <WhatsAppCopilot booking={booking} message={message} />
      </div>

      <div className="mt-5 rounded-[24px] border border-ink/10 bg-white/70 p-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green-deep/70">Timeline operativa</div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <TimelineItem label="Richiesta ricevuta" detail={new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(booking.created_at))} done />
          <TimelineItem label="Email cliente inviata" detail="Email inviate al momento della richiesta, se configurate." done />
          <TimelineItem label="Email admin inviata" detail="Email inviate al momento della richiesta, se configurate." done />
          <TimelineItem label="Disponibilità verificata / pending" detail={booking.status === "pending" ? "Ancora in attesa di conferma." : "Stato avanzato oltre pending."} done={booking.status !== "pending"} />
          <TimelineItem label="Voucher generato / non generato" detail={voucher ? `Voucher ${voucher.voucher_code}` : "Voucher non generato."} done={Boolean(voucher)} />
          <TimelineItem label="Check-in effettuato / non effettuato" detail={checkinDone ? "Check-in registrato." : "Check-in non effettuato."} done={checkinDone} />
        </ul>
      </div>
    </div>
  );
}
