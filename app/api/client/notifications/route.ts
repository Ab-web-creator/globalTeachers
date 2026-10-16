import type { NextRequest } from "next/server";
import {
  clientFromSession,
  clientSessionCookie,
} from "../../../../lib/client-area/access";
import { privateJson } from "../../../../lib/client-area/http";
import { clientUnreadMessages } from "../../../../lib/client-area/workspace";

export async function GET(request: NextRequest) {
  try {
    const id = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!id) return privateJson({ error: "Нет доступа." }, 401);
    return privateJson({ unread: await clientUnreadMessages(id) });
  } catch {
    return privateJson({ error: "Не удалось проверить уведомления." }, 503);
  }
}
