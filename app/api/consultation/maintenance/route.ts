import { timingSafeEqual } from "node:crypto";
import { removeExpiredApplications } from "../../../../lib/consultation/applications";
import { deliverNotification } from "../../../../lib/consultation/notifications";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const removed = await removeExpiredApplications();
    // Keep each invocation bounded; a scheduler can invoke this every five minutes.
    let processed = 0;
    while (processed < 5 && await deliverNotification()) processed++;
    return Response.json({ removed, processed });
  } catch {
    return Response.json({ error: "Maintenance failed" }, { status: 503 });
  }
}
