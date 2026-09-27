export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONSULTATION_EMAIL_FROM;
  const recipient = process.env.CONSULTATION_EMAIL_TO;
  const origin = process.env.SITE_URL;
  if (!apiKey || !from || !recipient || !origin) throw new Error("Email is not configured");
  const url = new URL(origin);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Invalid site URL");
  return { apiKey, from, recipient, origin: url.origin };
}

export async function sendEmail(message: { to: string; subject: string; text: string; reply_to?: string }, id?: string) {
  const { apiKey, from } = emailConfig();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(id ? { "Idempotency-Key": id } : {}),
    },
    body: JSON.stringify({ from, ...message }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Email delivery failed");
}
