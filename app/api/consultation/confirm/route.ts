import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { hashToken } from "../../../../lib/consultation/token";
import { confirmApplication } from "../../../../lib/consultation/applications";
import { deliverNotification } from "../../../../lib/consultation/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!trustedRequestOrigin(request)) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  let tokenHash;
  try {
    const body = await request.text();
    if (body.length > 1000) throw new Error("Too large");
    tokenHash = hashToken(JSON.parse(body).token);
  } catch {
    return Response.json({ error: "Ссылка недействительна или срок её действия истёк. Заполните заявку ещё раз." }, { status: 400 });
  }
  try {
    const id = await confirmApplication(tokenHash);
    if (!id) return Response.json({ error: "Ссылка недействительна или срок её действия истёк. Заполните заявку ещё раз." }, { status: 400 });
    // The permanent record is committed. Notification failures are retried by maintenance.
    await deliverNotification(id).catch(() => console.error("Consultation notification deferred."));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Не удалось сохранить заявку. Попробуйте ещё раз." }, { status: 503 });
  }
}
