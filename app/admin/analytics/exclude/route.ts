import { NextRequest, NextResponse } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { adminConfigured, analyticsAdminCookie, analyticsExclusionLifetime, createAnalyticsExclusion, sessionCookie, validSession } from "../../../../lib/admin/session";
import { excludeAdminVisitSession } from "../../../../lib/analytics/visits";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!trustedRequestOrigin(request)) return new Response(null, { status: 403, headers });
  const cookieStore = new NextRequest(request.url, { headers: request.headers }).cookies;
  if (process.env.NODE_ENV !== "development" && !validSession(cookieStore.get(sessionCookie)?.value)) return new Response(null, { status: 403, headers });
  let sessionId: string | undefined;
  try {
    if (Number(request.headers.get("content-length")) > 1024) return new Response(null, { status: 413, headers });
    const body = await request.text();
    if (body.length > 1024) return new Response(null, { status: 413, headers });
    const input = JSON.parse(body);
    if (!input || typeof input !== "object") throw new Error("Invalid input");
    if (input.sessionId !== undefined) {
      if (typeof input.sessionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.sessionId)) throw new Error("Invalid session");
      sessionId = input.sessionId;
    }
  } catch { return new Response(null, { status: 400, headers }); }
  let status = 204;
  if (sessionId) {
    try { await excludeAdminVisitSession(sessionId); }
    catch { status = 503; }
  }
  const response = new NextResponse(null, { status, headers });
  if (adminConfigured()) response.cookies.set(analyticsAdminCookie, createAnalyticsExclusion(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: analyticsExclusionLifetime,
  });
  return response;
}
