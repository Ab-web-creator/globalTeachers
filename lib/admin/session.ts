import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const sessionCookie = "gth_admin";
export const sessionLifetime = 8 * 60 * 60;

export function adminConfigured() {
  return (process.env.ADMIN_PASSWORD?.length ?? 0) >= 16 && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}

function equal(left: string, right: string) {
  return timingSafeEqual(createHash("sha256").update(left).digest(), createHash("sha256").update(right).digest());
}

export function validPassword(password: string) {
  return adminConfigured() && equal(password, process.env.ADMIN_PASSWORD!);
}

function signature(payload: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(`admin:${process.env.ADMIN_PASSWORD}:${payload}`).digest("base64url");
}

export function createSession() {
  if (!adminConfigured()) throw new Error("Admin access is not configured");
  const payload = `${Math.floor(Date.now() / 1000) + sessionLifetime}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}

export function validSession(token?: string) {
  if (!adminConfigured() || !token || token.length > 200) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{32}$/.test(parts[1])) return false;
  const expires = Number(parts[0]);
  const now = Math.floor(Date.now() / 1000);
  return expires > now && expires <= now + sessionLifetime && equal(parts[2], signature(`${parts[0]}.${parts[1]}`));
}
