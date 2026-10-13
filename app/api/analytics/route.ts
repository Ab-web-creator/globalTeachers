import { trustedRequestOrigin } from "../../../lib/request-origin";
import { validatePageView } from "../../../lib/analytics/validation";
import { recordPageView } from "../../../lib/analytics/visits";
import { visitorLocation } from "../../../lib/analytics/location";
import { NextRequest } from "next/server";
import { analyticsAdminCookie, validAnalyticsExclusion } from "../../../lib/admin/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!trustedRequestOrigin(request))
    return new Response(null, { status: 403, headers });
  const cookieStore = new NextRequest(request.url, { headers: request.headers }).cookies;
  if (validAnalyticsExclusion(cookieStore.get(analyticsAdminCookie)?.value))
    return new Response(null, { status: 204, headers });
  if (
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1" ||
    /bot|crawler|spider|headless|preview|slurp|lighthouse/i.test(
      request.headers.get("user-agent") ?? "",
    )
  ) {
    return new Response(null, { status: 204, headers });
  }
  if (Number(request.headers.get("content-length")) > 1024)
    return new Response(null, { status: 413, headers });
  let input;
  try {
    const text = await request.text();
    if (text.length > 1024) return new Response(null, { status: 413, headers });
    input = validatePageView(JSON.parse(text));
  } catch {
    return new Response(null, { status: 400, headers });
  }
  if (!input) return new Response(null, { status: 400, headers });
  try {
    await recordPageView(input, await visitorLocation(request.headers));
    return new Response(null, { status: 204, headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
