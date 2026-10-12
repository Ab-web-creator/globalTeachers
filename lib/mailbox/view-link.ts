import { createHmac, timingSafeEqual } from "node:crypto";
import { adminConfigured } from "../admin/session";

const lifetime = 30 * 24 * 60 * 60;

// Tied to the admin credentials like sessions, so changing the password cancels every link.
function signature(id: string, expires: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(`mail-view:${process.env.ADMIN_PASSWORD}:${id}:${expires}`).digest("base64url");
}

/** A read-only link to one email for the Gmail copies; it never grants an admin session. */
export function mailViewUrl(origin: string, id: string, now = Date.now()) {
  if (!adminConfigured()) return `${origin}/admin/mail/${id}`;
  const expires = String(Math.floor(now / 1000) + lifetime);
  return `${origin}/admin/mail/view/${id}?${new URLSearchParams({ key: `${expires}.${signature(id, expires)}` })}`;
}

export function validMailViewKey(id: string, key: unknown, now = Date.now()) {
  if (!adminConfigured() || typeof key !== "string" || key.length > 100) return false;
  const [expires, received] = key.split(".");
  if (!/^\d+$/.test(expires ?? "") || !received || Number(expires) <= now / 1000) return false;
  const expected = Buffer.from(signature(id, expires));
  const actual = Buffer.from(received);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
