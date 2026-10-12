export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredFrom = process.env.CONSULTATION_EMAIL_FROM;
  const recipient = process.env.CONSULTATION_EMAIL_TO?.split(",").map((email) => email.trim()).filter(Boolean);
  const origin = process.env.SITE_URL;
  if (!apiKey || !configuredFrom || !recipient?.length || !origin) throw new Error("Email is not configured");
  const address = configuredFrom.match(/<([^<>]+)>\s*$/)?.[1]?.trim() ?? configuredFrom.trim();
  const from = `TeacherNavigator <${address}>`;
  const url = new URL(origin);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Invalid site URL");
  return { apiKey, from, address, recipient, origin: url.origin };
}

export type EmailMessage = {
  to: string | string[]; subject: string; text: string; html?: string; reply_to?: string | string[]; cc?: string[];
  headers?: Record<string, string>; attachments?: { filename: string; path: string; content_type?: string }[];
};

export async function sendEmail(message: EmailMessage, id?: string): Promise<string | undefined> {
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
  if (!response.ok) throw new Error(`Email delivery failed (${response.status}): ${(await response.text().catch(() => "")).slice(0, 200)}`);
  const result = await response.json().catch(() => null);
  return typeof result?.id === "string" ? result.id : undefined;
}
