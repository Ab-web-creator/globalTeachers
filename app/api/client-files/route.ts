import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { database } from "../../../lib/consultation/database";
import { adminAllowed, privateJson, smallJson } from "../../../lib/client-area/http";
import { clientFromSession, clientSessionCookie } from "../../../lib/client-area/access";
import { uuidPattern } from "../../../lib/client-area/types";
import { trustedRequestOrigin } from "../../../lib/request-origin";
import { fileContentType, maxFileBytes } from "../../../lib/client-area/file-validation";

export const runtime = "nodejs";
async function access(request: NextRequest) {
  const supplied = request.nextUrl.searchParams.get("client");
  const admin = supplied !== null;
  if (admin && (!uuidPattern.test(supplied!) || !adminAllowed(request))) return null;
  const id = admin ? supplied : await clientFromSession(request.cookies.get(clientSessionCookie)?.value);
  if (!id) return null;
  const result = await database().query("SELECT active, paid_at FROM private_clients WHERE id = $1", [id]);
  if (!result.rowCount) return null;
  return { id, admin, writable: admin || Boolean(result.rows[0].active && result.rows[0].paid_at) };
}
export async function GET(request: NextRequest) {
  try {
    const user = await access(request);
    if (!user) return privateJson({ error: "Нет доступа." }, 401);
    const fileId = request.nextUrl.searchParams.get("file");
    if (fileId) {
      if (!uuidPattern.test(fileId)) return privateJson({ error: "Invalid file" }, 400);
      const result = await database().query("SELECT name, content_type, content FROM private_client_files WHERE id=$1 AND client_id=$2", [fileId, user.id]);
      const file = result.rows[0];
      if (!file) return privateJson({ error: "Файл не найден." }, 404);
      const inline = request.nextUrl.searchParams.get("view") === "1" && (file.content_type === "application/pdf" || file.content_type.startsWith("image/"));
      return new Response(new Uint8Array(file.content), { headers: {
        "Content-Type": file.content_type,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="download"; filename*=UTF-8''${encodeURIComponent(file.name).replace(/'/g, "%27")}`,
        "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "sandbox",
      } });
    }
    const [folders, files] = await Promise.all([
      database().query("SELECT id,name FROM private_file_folders WHERE client_id=$1 ORDER BY created_at,id", [user.id]),
      database().query("SELECT id,folder_id,author,name,content_type,size,created_at FROM private_client_files WHERE client_id=$1 ORDER BY created_at DESC,id DESC", [user.id]),
    ]);
    return privateJson({ folders: folders.rows, files: files.rows });
  } catch { return privateJson({ error: "Не удалось загрузить файлы." }, 503); }
}
export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return privateJson({ error: "Forbidden" }, 403);
  try {
    const user = await access(request);
    if (!user) return privateJson({ error: "Нет доступа." }, 401);
    if (!user.writable) return privateJson({ error: "Загрузка доступна после подтверждения оплаты." }, 403);
    const action = request.nextUrl.searchParams.get("action");
    if (action === "upload") {
      const name = (request.nextUrl.searchParams.get("name") ?? "").replace(/[\\/\x00-\x1f\x7f]/g, "_").trim();
      const folder = request.nextUrl.searchParams.get("folder") || null;
      if (!name || name.length > 200 || (folder && !uuidPattern.test(folder))) return privateJson({ error: "Проверьте имя файла и папку." }, 400);
      if (folder && !(await database().query("SELECT 1 FROM private_file_folders WHERE id=$1 AND client_id=$2", [folder,user.id])).rowCount) return privateJson({ error: "Папка не найдена." }, 404);
      const reader = request.body?.getReader();
      if (!reader) return privateJson({ error: "Выберите файл." }, 400);
      const parts: Uint8Array[] = []; let size = 0;
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > maxFileBytes) { await reader.cancel(); return privateJson({ error: "Размер файла — не более 10 МБ." }, 413); }
        parts.push(chunk.value);
      }
      const bytes = Buffer.concat(parts);
      const type = fileContentType(name, bytes);
      if (!size || !type) return privateJson({ error: "Разрешены PDF, DOC, DOCX, JPG, PNG, WebP и GIF." }, 400);
      const saved = await database().query("INSERT INTO private_client_files(id,client_id,folder_id,author,name,content_type,size,content) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,folder_id,author,name,content_type,size,created_at", [randomUUID(),user.id,folder,user.admin ? "admin" : "client",name,type,size,bytes]);
      return privateJson({ ok: true, file: saved.rows[0] });
    }
    const input = await smallJson(request);
    if (action === "folder" && user.admin) {
      const name = typeof input?.name === "string" ? input.name.trim() : "";
      if (!name || name.length > 80) return privateJson({ error: "Название папки — от 1 до 80 символов." }, 400);
      const result = await database().query("INSERT INTO private_file_folders(id,client_id,name) VALUES($1,$2,$3) ON CONFLICT(client_id,name) DO NOTHING RETURNING id", [randomUUID(),user.id,name]);
      return result.rowCount ? privateJson({ ok: true }) : privateJson({ error: "Такая папка уже есть." }, 409);
    }
    if (action === "delete" && uuidPattern.test(input?.id ?? "")) {
      const result = await database().query("DELETE FROM private_client_files WHERE id=$1 AND client_id=$2 AND ($3::boolean OR author='client') RETURNING id", [input.id,user.id,user.admin]);
      return result.rowCount ? privateJson({ ok: true }) : privateJson({ error: "Файл не найден или удаление недоступно." }, 404);
    }
    if (action === "move" && user.admin && uuidPattern.test(input?.id ?? "") && (input.folder === null || uuidPattern.test(input.folder ?? ""))) {
      if (input.folder && !(await database().query("SELECT 1 FROM private_file_folders WHERE id=$1 AND client_id=$2", [input.folder,user.id])).rowCount) return privateJson({ error: "Папка не найдена." }, 404);
      const result = await database().query("UPDATE private_client_files SET folder_id=$3 WHERE id=$1 AND client_id=$2 RETURNING id", [input.id,user.id,input.folder]);
      return result.rowCount ? privateJson({ ok: true }) : privateJson({ error: "Файл не найден." }, 404);
    }
    return privateJson({ error: "Действие недоступно." }, 403);
  } catch { return privateJson({ error: "Не удалось сохранить изменения." }, 503); }
}
