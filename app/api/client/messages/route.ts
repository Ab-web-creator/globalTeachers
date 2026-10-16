import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import {
  clientFromSession,
  clientSessionCookie,
} from "../../../../lib/client-area/access";
import { privateJson, smallJson } from "../../../../lib/client-area/http";
import {
  addChatMessage,
  getWorkspace,
  markClientChatRead,
} from "../../../../lib/client-area/workspace";
import { uuidPattern } from "../../../../lib/client-area/types";

export async function GET(request: NextRequest) {
  try {
    const clientId = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!clientId)
      return privateJson(
        { error: "Откройте личную страницу по ссылке из письма." },
        401,
      );
    return privateJson(await getWorkspace(clientId));
  } catch {
    return privateJson({ error: "Не удалось загрузить личную страницу." }, 503);
  }
}
export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  try {
    const clientId = await clientFromSession(
      request.cookies.get(clientSessionCookie)?.value,
    );
    if (!clientId) return privateJson({ error: "Нет доступа." }, 401);
    const input = await smallJson(request);
    if (
      input?.action === "read-chat" &&
      Array.isArray(input.ids) &&
      input.ids.length <= 200 &&
      input.ids.every(
        (id: unknown) => typeof id === "string" && uuidPattern.test(id),
      )
    ) {
      await markClientChatRead(clientId, input.ids);
      return privateJson({ ok: true });
    }
    if (
      !uuidPattern.test(input?.id ?? "") ||
      typeof input?.body !== "string" ||
      !input.body.trim() ||
      input.body.length > 5000
    )
      return privateJson(
        { error: "Напишите сообщение до 5000 символов." },
        400,
      );
    const saved = await addChatMessage(
      clientId,
      "client",
      input.id,
      input.body.trim(),
    );
    return saved
      ? privateJson({ ok: true })
      : privateJson({ error: "Сообщение не сохранено." }, 409);
  } catch {
    return privateJson({ error: "Не удалось отправить сообщение." }, 503);
  }
}
