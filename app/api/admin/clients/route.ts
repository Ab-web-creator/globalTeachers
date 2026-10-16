import { clientAccessLink } from "../../../../lib/client-area/access";
import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { database } from "../../../../lib/consultation/database";
import {
  adminAllowed,
  privateJson,
  smallJson,
  actionError,
} from "../../../../lib/client-area/http";
import {
  prepareInvitation,
  getInvitation,
  pauseInvitation,
  updateInvitation,
  deliverInvitation,
} from "../../../../lib/client-area/invitations";
import {
  addChatMessage,
  adminCalendar,
  closeAppointmentSlot,
  getWorkspace,
  listPrivateClients,
  markChatRead,
  openAppointmentSlot,
  openAppointmentSlots,
} from "../../../../lib/client-area/workspace";
import { clientTiers, uuidPattern } from "../../../../lib/client-area/types";

import { startAdminAppointmentCall } from "../../../../lib/client-area/appointment-call";

import { markMessagePaid, setClientPayment } from "../../../../lib/admin/client-payment";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!adminAllowed(request))
    return privateJson({ error: "Unauthorized" }, 401);
  const clientId = request.nextUrl.searchParams.get("client");
  try {
    if (clientId) {
      if (!uuidPattern.test(clientId))
        return privateJson({ error: "Invalid client" }, 400);
      const workspace = await getWorkspace(clientId, true);
      return workspace
        ? privateJson(workspace)
        : privateJson({ error: "Клиент не найден." }, 404);
    }
    if (request.nextUrl.searchParams.get("directory") === "1")
      return privateJson({ clients: await listPrivateClients() });
    return privateJson({
      clients: await listPrivateClients(),
      ...(await adminCalendar()),
    });
  } catch {
    return privateJson({ error: "Не удалось загрузить данные." }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  if (!adminAllowed(request))
    return privateJson({ error: "Unauthorized" }, 401);
  let input;
  try {
    input = await smallJson(request);
  } catch {
    return privateJson({ error: "Invalid request" }, 400);
  }
  try {
    if (input?.action === "set-client-payment" && uuidPattern.test(input.clientId ?? "") && (input.tier === null || clientTiers.includes(input.tier)))
      return privateJson(await setClientPayment(input.clientId, input.tier));
    if (input?.action === "copy-key" && uuidPattern.test(input.clientId ?? "")) {
      const paid = await database().query("SELECT id FROM private_clients WHERE id=$1 AND paid_at IS NOT NULL", [input.clientId]);
      if (!paid.rowCount) return privateJson({ error: "Копирование ключа доступно только для оплаченных клиентов." }, 403);
      const link = await clientAccessLink(input.clientId);
      return link ? privateJson({ link }) : privateJson({ error: "Ключ клиента пока не подготовлен. Повторно выберите оплаченный пакет." }, 404);
    }
    if (input?.action === "mark-message-paid" && uuidPattern.test(input.messageId ?? "") && (input.tier === null || clientTiers.includes(input.tier)))
      return privateJson(await markMessagePaid(input.messageId, input.tier));
    if (
      input?.action === "call-client" &&
      uuidPattern.test(input.clientId ?? "")
    )
      return privateJson(await startAdminAppointmentCall(input.clientId));
    if (
      input?.action === "read-chat" &&
      uuidPattern.test(input.clientId ?? "") &&
      Array.isArray(input.ids) &&
      input.ids.length <= 200 &&
      input.ids.every(
        (id: unknown) => typeof id === "string" && uuidPattern.test(id),
      )
    ) {
      await markChatRead(input.clientId, input.ids);
      return privateJson({ ok: true });
    }
    if (
      input?.action === "prepare" &&
      typeof input.messageId === "string" &&
      uuidPattern.test(input.messageId) &&
      (input.tier === undefined || clientTiers.includes(input.tier))
    ) {
      return privateJson(await prepareInvitation(input.messageId, input.tier));
    }
    if (
      ["pause", "invitation", "send-invitation"].includes(input?.action) &&
      typeof input.id === "string" &&
      uuidPattern.test(input.id)
    ) {
      if (input.action === "pause")
        return privateJson(await pauseInvitation(input.id));
      if (input.action === "send-invitation") {
        if (input.subject !== undefined || input.body !== undefined) {
          if (
            typeof input.subject !== "string" ||
            !input.subject.trim() ||
            input.subject.length > 300 ||
            typeof input.body !== "string" ||
            !input.body.trim() ||
            input.body.length > 50000
          )
            return privateJson(
              { error: "Проверьте тему и текст письма." },
              400,
            );
          await updateInvitation(input.id, input.subject.trim(), input.body);
        }
        const result = await deliverInvitation(input.id);
        if (result === "failed")
          return privateJson(
            {
              error:
                "Не удалось отправить письмо. Оно сохранено для повторной попытки.",
            },
            502,
          );
      }
      const invite = await getInvitation(input.id);
      return invite
        ? privateJson(invite)
        : privateJson({ error: "Приглашение не найдено." }, 404);
    }
    if (
      input?.action === "chat" &&
      uuidPattern.test(input.clientId ?? "") &&
      uuidPattern.test(input.id ?? "") &&
      typeof input.body === "string" &&
      input.body.trim() &&
      input.body.length <= 5000
    ) {
      const saved = await addChatMessage(
        input.clientId,
        "admin",
        input.id,
        input.body.trim(),
      );
      return saved
        ? privateJson({ ok: true })
        : privateJson({ error: "Сообщение не сохранено." }, 409);
    }
    if (input?.action === "open-slot" && typeof input.startsAt === "string") {
      const startsAt = new Date(input.startsAt);
      if (
        !Number.isFinite(startsAt.getTime()) ||
        startsAt.getTime() <= Date.now() ||
        startsAt.getTime() > Date.now() + 366 * 86400000
      )
        return privateJson(
          { error: "Выберите время в будущем в пределах года." },
          400,
        );
      return privateJson({
        id: await openAppointmentSlot(startsAt.toISOString()),
      });
    }
    if (input?.action === "open-slots") {
      if (
        !Array.isArray(input.startsAts) ||
        !input.startsAts.length ||
        input.startsAts.length > 48 ||
        !input.startsAts.every((value: unknown) => typeof value === "string")
      )
        return privateJson({ error: "Выберите от 1 до 48 часов." }, 400);
      return privateJson({ ids: await openAppointmentSlots(input.startsAts, input.timeZone) });
    }
    if (input?.action === "close-slot" && uuidPattern.test(input.id ?? "")) {
      const closed = await closeAppointmentSlot(input.id);
      return closed
        ? privateJson({ ok: true })
        : privateJson({ error: "Нельзя закрыть забронированный час." }, 409);
    }
    if (
      input?.action === "client-allowance" &&
      uuidPattern.test(input.clientId ?? "") &&
      Number.isInteger(input.hours) &&
      input.hours >= 0 &&
      input.hours <= 1000
    ) {
      const updated = await database().query(
        "UPDATE private_clients SET allowance_hours = $2 WHERE id = $1 AND tier = 'VIP' RETURNING id",
        [input.clientId, input.hours],
      );
      if (!updated.rowCount)
        return privateJson(
          {
            error:
              "Лимит можно менять только для VIP. START — 1 час, PRO — 3 часа.",
          },
          400,
        );
      return privateJson({ ok: true });
    }
    return privateJson({ error: "Проверьте введённые данные." }, 400);
  } catch (error) {
    return privateJson({ error: actionError(error) }, 409);
  }
}
