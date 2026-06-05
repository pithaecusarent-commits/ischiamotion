import { createHmac, timingSafeEqual } from "crypto";

const maxSignatureAgeMs = 5 * 60 * 1000;

function getSecret() {
  return process.env.BOOKING_EMAIL_SECRET || "";
}

function sign(secret: string, timestamp: string, body: string) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export function createInternalSignature(body: string) {
  const secret = getSecret();

  if (!secret) {
    throw new Error("BOOKING_EMAIL_SECRET missing.");
  }

  const timestamp = String(Date.now());
  return {
    timestamp,
    signature: sign(secret, timestamp, body)
  };
}

export function verifyInternalSignature(headers: Headers, body: string) {
  const secret = getSecret();
  const timestamp = headers.get("x-im-timestamp") || "";
  const signature = headers.get("x-im-signature") || "";

  if (!secret || !timestamp || !signature) return false;

  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt) || Math.abs(Date.now() - issuedAt) > maxSignatureAgeMs) {
    return false;
  }

  const expected = sign(secret, timestamp, body);
  const receivedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer);
}
