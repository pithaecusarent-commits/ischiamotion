const fallbackSiteUrl = "https://ischiamotion.com";
const qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/";

function normalizeSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
}

export function toAbsoluteCheckinUrl(payload: string) {
  if (/^https?:\/\//i.test(payload)) {
    return payload;
  }

  const path = payload.startsWith("/") ? payload : `/${payload}`;
  return `${normalizeSiteUrl()}${path}`;
}

export async function generateQrDataUrl(payload: string) {
  const absolutePayload = toAbsoluteCheckinUrl(payload);
  const params = new URLSearchParams({
    data: absolutePayload,
    size: "320x320",
    margin: "16",
    format: "svg",
    ecc: "M",
    color: "151512",
    bgcolor: "FFFFFF"
  });

  return `${qrApiUrl}?${params.toString()}`;
}
