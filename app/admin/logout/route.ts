import { trustedRequestOrigin } from "../../../lib/request-origin";
import { NextResponse } from "next/server";
import { sessionCookie } from "../../../lib/admin/session";

export async function POST(request: Request) {
  const origin = trustedRequestOrigin(request);
  if (!origin) return new Response("Forbidden", { status: 403 });
  const response = NextResponse.redirect(new URL("/admin", origin), 303);
  // Older sessions were scoped to /admin; clear both so no stale cookie survives logout.
  response.headers.append("Set-Cookie", `${sessionCookie}=; Path=/admin; Max-Age=0; HttpOnly; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  response.cookies.set(sessionCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
