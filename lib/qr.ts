import QRCode from "qrcode";

const fallbackSiteUrl = "https://ischiamotion.com";

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

  try {
    return await QRCode.toDataURL(absolutePayload, {
      type: "image/png",
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#151512",
        light: "#FFFFFF"
      }
    });
  } catch {
    return null;
  }
}
