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
import { database } from "../../../../lib/consultation/database";
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
    if (input?.action === "edit-chat" || input?.action === "delete-chat") {
      if (!uuidPattern.test(input.id ?? "")) return privateJson({ error: "Invalid message" }, 400);
      if (input.action === "edit-chat" && (typeof input.body !== "string" || !input.body.trim() || input.body.length > 5000))
        return privateJson({ error: "Напишите сообщение до 5000 символов." }, 400);
      const condition = `id = $1 AND client_id = $2 AND author = 'client'
        AND NOT hidden_from_client AND client_deleted_at IS NULL
        AND EXISTS (SELECT 1 FROM private_clients WHERE id = $2 AND active AND paid_at IS NOT NULL)`;
      const result = input.action === "edit-chat"
        ? await database().query(`UPDATE private_chat_messages SET
            client_edit_history = client_edit_history || jsonb_build_array(jsonb_build_object('body', body, 'changed_at', now())),
            body = $3, client_edited_at = now(), admin_read_at = NULL
            WHERE ${condition} AND body <> $3 RETURNING id`, [input.id, clientId, input.body.trim()])
        : await database().query(`UPDATE private_chat_messages SET hidden_from_client = true,
            client_deleted_at = now(), admin_read_at = NULL WHERE ${condition} RETURNING id`, [input.id, clientId]);
      return result.rowCount ? privateJson({ ok: true }) : privateJson({ error: "Сообщение недоступно для изменения." }, 409);
    }
    if (input?.action !== undefined) return privateJson({ error: "Invalid action" }, 400);
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
      : privateJson({ error: "Сообщение не сохранено. Аккаунт может быть заморожен до подтверждения оплаты." }, 409);
  } catch {
    return privateJson({ error: "Не удалось отправить сообщение." }, 503);
  }
}
