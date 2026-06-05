const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomToken(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function generateBookingCode() {
  return `IM-${randomToken(10)}`;
}

export function generateVoucherCode() {
  return `IM-${new Date().getFullYear()}-${randomToken(12)}`;
}
