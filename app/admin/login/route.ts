import { trustedRequestOrigin } from "../../../lib/request-origin";
import { NextResponse } from "next/server";
import { adminConfigured, createSession, safeAdminPath, sessionCookie, sessionLifetime, validPassword } from "../../../lib/admin/session";

export async function POST(request: Request) {
  const origin = trustedRequestOrigin(request);
  if (!origin) return new Response("Forbidden", { status: 403 });
  if (!adminConfigured()) return new Response("Admin access is not configured", { status: 503 });
  const body = await request.text();
  if (body.length > 2048) return new Response("Bad request", { status: 400 });
  const form = new URLSearchParams(body);
  const password = form.get("password") ?? "";
  const next = safeAdminPath(form.get("next"));
  if (!validPassword(password)) {
    return NextResponse.redirect(new URL(`/admin?${new URLSearchParams({ error: "login", ...(next ? { next } : {}) })}`, origin), 303);
  }
  const response = NextResponse.redirect(new URL(next ?? "/admin", origin), 303);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(sessionCookie, createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: sessionLifetime,
  });
  return response;
}
