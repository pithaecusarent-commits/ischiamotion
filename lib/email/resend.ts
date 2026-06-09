const resendEndpoint = "https://api.resend.com/emails";
const defaultFromEmail = "IschiaMotion <booking@mail.ischiamotion.com>";
const defaultReplyToEmail = "info@ischiamotion.com";

export type EmailAttachment = {
  content: string;
  filename: string;
  contentId?: string;
  contentType?: string;
};

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
  attachments?: EmailAttachment[];
}): Promise<{ ok: boolean; error: string | null; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY missing." };
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "IschiaMotion/1.0"
      },
      body: JSON.stringify({
        from: input.from || process.env.BOOKING_FROM_EMAIL || defaultFromEmail,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html || textToHtml(input.text),
        reply_to: input.replyTo || process.env.BOOKING_REPLY_TO_EMAIL || process.env.BOOKING_ADMIN_EMAIL || defaultReplyToEmail,
        attachments: input.attachments?.map((attachment) => ({
          content: attachment.content,
          filename: attachment.filename,
          content_id: attachment.contentId,
          content_type: attachment.contentType,
          content_disposition: attachment.contentId ? "inline" : undefined
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

    const id = typeof body === "object" && body && "id" in body ? String(body.id) : undefined;
    return { ok: true, error: null, id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to contact Resend."
    };
  }
}
