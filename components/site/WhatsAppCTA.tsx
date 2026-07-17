import type { Locale } from "@/lib/types";
import type { VehicleFilter } from "@/lib/types";
import { getWhatsAppUrl, resolveWhatsAppType, type WhatsAppMessageContext } from "@/lib/whatsapp";

export function WhatsAppCTA({
  locale,
  category = "all",
  context,
  messageType
}: {
  locale: Locale;
  category?: VehicleFilter;
  context?: WhatsAppMessageContext;
  messageType?: "requestReceived";
}) {
  const type = messageType ?? resolveWhatsAppType(category);
  const href = getWhatsAppUrl(locale, type, { ...context, category });
  const label = locale === "it" ? "Chiedi un consiglio su WhatsApp" : "Ask for advice on WhatsApp";

  return (
    <a
      aria-label={label}
      className="whatsapp-cta"
      data-ga-event="click_whatsapp"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
        <path d="M16 4.2A11.45 11.45 0 0 0 6.4 21.85L5 27l5.28-1.38A11.44 11.44 0 1 0 16 4.2Zm0 2.1a9.35 9.35 0 1 1-4.75 17.4l-.38-.22-3.02.8.82-2.93-.25-.4A9.35 9.35 0 0 1 16 6.3Z" />
        <path d="M12.56 10.82c-.22 0-.55.08-.84.39-.3.32-1.1 1.07-1.1 2.6 0 1.54 1.13 3.03 1.28 3.24.16.2 2.18 3.47 5.39 4.73 2.66 1.05 3.2.84 3.78.79.58-.06 1.86-.77 2.12-1.5.26-.74.26-1.36.18-1.5-.08-.13-.29-.21-.61-.37-.32-.16-1.86-.92-2.15-1.03-.29-.1-.5-.16-.72.16-.21.32-.83 1.02-1.02 1.23-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.88-1.77-2.2-.18-.32-.02-.5.14-.66.15-.15.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.98-2.38-.26-.62-.53-.54-.72-.55h-.59Z" />
      </svg>
    </a>
  );
}
