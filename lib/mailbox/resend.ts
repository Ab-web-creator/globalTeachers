export type ReceivedAttachment = { id: string; filename: string; content_type: string; size?: number; download_url?: string };
export type ReceivedEmail = {
  id: string; from: string; to: string[]; cc?: string[]; reply_to?: string[]; subject: string | null;
  text: string | null; html: string | null; message_id?: string; created_at: string; attachments?: ReceivedAttachment[];
};

async function receiving<T>(path: string): Promise<T> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Email is not configured");
  const response = await fetch(`https://api.resend.com/emails/receiving/${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Received email lookup failed");
  return response.json();
}

export function receivedEmail(id: string) {
  return receiving<ReceivedEmail>(encodeURIComponent(id));
}

/** Attachment download links are signed and expire, so fetch them right before use. */
export async function receivedAttachments(id: string) {
  return (await receiving<{ data: ReceivedAttachment[] }>(`${encodeURIComponent(id)}/attachments`)).data ?? [];
}
