const resendEndpoint = "https://api.resend.com/emails";
const defaultFromEmail = "IschiaMotion <booking@mail.ischiamotion.com>";

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
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    contentType?: string;
    contentId?: string;
  }>;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY missing." };
  }

  try {
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
        html: input.html || textToHtml(input.text),
        reply_to: input.replyTo || process.env.BOOKING_ADMIN_EMAIL || "info@ischiamotion.com",
        attachments: input.attachments?.map((attachment) => ({
          content: attachment.content,
          filename: attachment.filename,
          content_type: attachment.contentType,
          content_id: attachment.contentId
        }))
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
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to send email." };
  }
}
