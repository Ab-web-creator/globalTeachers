import { timingSafeEqual } from "node:crypto";
import { removeExpiredApplications } from "../../../../lib/consultation/applications";

import { deliverEducationOutcomeEmail } from "../../../../lib/consultation/education-outcome-email";

import { deliverEnglishOutcomeEmail } from "../../../../lib/consultation/english-outcome-email";

import { deliverPackageEmail } from "../../../../lib/consultation/package-email";

import { deliverInvitation } from "../../../../lib/client-area/invitations";
import { deliverBookingEmail } from "../../../../lib/client-area/booking-email";

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
    let educationEmails = 0;
    while (educationEmails < 5 && await deliverEducationOutcomeEmail()) educationEmails++;
    let englishEmails = 0;
    while (englishEmails < 5 && await deliverEnglishOutcomeEmail()) englishEmails++;
    let packageEmails = 0;
    while (packageEmails < 5 && await deliverPackageEmail()) packageEmails++;
    let invitations = 0;
    while (invitations < 5 && await deliverInvitation() !== "waiting") invitations++;
    let bookingEmails = 0;
    while (bookingEmails < 5 && await deliverBookingEmail()) bookingEmails++;
    return Response.json({ removed, educationEmails, englishEmails, packageEmails, invitations, bookingEmails });
  } catch {
    return Response.json({ error: "Maintenance failed" }, { status: 503 });
  }
}
