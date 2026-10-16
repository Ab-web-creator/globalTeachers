import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import {
  clientFromSession,
  clientSessionCookie,
} from "../../../../lib/client-area/access";
import { actionError, privateJson } from "../../../../lib/client-area/http";
import {
  incomingAppointmentCall,
  createAppointmentCall,
} from "../../../../lib/client-area/appointment-call";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  try {
    const clientId = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!clientId)
      return privateJson({ error: "Войдите по вашему ключу из письма." }, 401);
    return privateJson(await createAppointmentCall(clientId));
  } catch (error) {
    return privateJson({ error: actionError(error) }, 403);
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!clientId) return privateJson({ error: "Unauthorized" }, 401);
    return privateJson({ incoming: await incomingAppointmentCall(clientId) });
  } catch {
    return privateJson({ error: "Не удалось проверить звонки." }, 503);
  }
}
