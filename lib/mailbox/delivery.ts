import { database } from "../consultation/database";

export const deliveryEventTypes = new Set([
  "email.delivered", "email.delivery_delayed", "email.bounced", "email.failed", "email.suppressed",
]);

export async function recordDeliveryEvent(id: string, event: {
  type: string; created_at?: unknown;
  data?: { email_id?: unknown; bounce?: { message?: unknown }; failed?: { reason?: unknown }; suppressed?: { message?: unknown } };
}) {
  const providerId = event.data?.email_id;
  if (!id || id.length > 200 || typeof providerId !== "string" || !providerId || providerId.length > 100
    || typeof event.created_at !== "string" || !Number.isFinite(Date.parse(event.created_at))) {
    throw new Error("Invalid delivery event");
  }
  const detail = event.data?.bounce?.message ?? event.data?.failed?.reason ?? event.data?.suppressed?.message;
  await database().query(`INSERT INTO mail_delivery_events (id, resend_id, event_type, occurred_at, reason)
    VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
    [id, providerId, event.type, event.created_at, typeof detail === "string" ? detail.slice(0, 4000) : null]);
}

export function deliveryLabel(status?: string | null) {
  switch (status) {
    case "email.bounced": return "Не доставлено: возврат письма";
    case "email.failed": return "Ошибка отправки";
    case "email.suppressed": return "Отправка заблокирована";
    case "email.delivery_delayed": return "Доставка задерживается";
    case "email.delivered": return "Доставлено на почтовый сервер";
    default: return "Отправлено · доставка не подтверждена";
  }
}
