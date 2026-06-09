const resendEndpoint = "https://api.resend.com/emails";
const defaultFromEmail = "IschiaMotion <noreply@mail.ischiamotion.com>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(text: string) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#151512;white-space:pre-wrap">${escapeHtml(text)}</div>`;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY missing." };
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: input.from || process.env.BOOKING_FROM_EMAIL || defaultFromEmail,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: textToHtml(input.text),
      reply_to: input.replyTo || process.env.BOOKING_ADMIN_EMAIL || "info@ischiamotion.com"
    })
  });

  const body = await response.json().catch(async () => {
    const text = await response.text().catch(() => "");
    return text ? { message: text } : null;
  });

  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body
      ? String(body.message)
      : `Resend error ${response.status}`;
    return { ok: false, error: message };
  }

  return { ok: true, error: null };
}
