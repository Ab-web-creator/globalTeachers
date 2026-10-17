import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import {
  clientFromSession,
  clientSessionCookie,
} from "../../../../lib/client-area/access";
import {
  privateJson,
  smallJson,
  actionError,
} from "../../../../lib/client-area/http";
import { bookAppointment, cancelAppointment } from "../../../../lib/client-area/workspace";
import { deliverBookingEmail } from "../../../../lib/client-area/booking-email";
import { uuidPattern } from "../../../../lib/client-area/types";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  try {
    const clientId = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!clientId) return privateJson({ error: "Нет доступа." }, 401);
    const input = await smallJson(request);
    if (!uuidPattern.test(input?.slotId ?? ""))
      return privateJson({ error: "Выберите доступное время." }, 400);
    if (input.action === "cancel") {
      await cancelAppointment(clientId, input.slotId);
      return privateJson({ ok: true });
    }
    await bookAppointment(clientId, input.slotId, input.timeZone);
    // The booking is durable even if email is temporarily unavailable; maintenance retries it.
    await deliverBookingEmail(input.slotId).catch(() => false);
    return privateJson({ ok: true });
  } catch (error) {
    return privateJson({ error: actionError(error) }, 409);
  }
}
