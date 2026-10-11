import { timingSafeEqual } from "node:crypto";
import { removeExpiredApplications } from "../../../../lib/consultation/applications";
import { deliverNotification } from "../../../../lib/consultation/notifications";
import { deliverQualificationFollowup } from "../../../../lib/consultation/qualification-followups";

import { deliverSubjectFollowup } from "../../../../lib/consultation/subject-followups";

import { deliverEducationFollowup } from "../../../../lib/consultation/education-followups";

import { deliverEnglishFollowup } from "../../../../lib/consultation/english-followups";

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
    let followups = 0;
    while (followups < 5 && await deliverQualificationFollowup()) followups++;
    let subjectFollowups = 0;
    while (subjectFollowups < 5 && await deliverSubjectFollowup()) subjectFollowups++;
    let educationFollowups = 0;
    while (educationFollowups < 5 && await deliverEducationFollowup()) educationFollowups++;
    let englishFollowups = 0;
    while (englishFollowups < 5 && await deliverEnglishFollowup()) englishFollowups++;
    return Response.json({ removed, processed, followups, subjectFollowups, educationFollowups, englishFollowups });
  } catch {
    return Response.json({ error: "Maintenance failed" }, { status: 503 });
  }
}
