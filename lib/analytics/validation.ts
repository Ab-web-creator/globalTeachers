import { dateInTimeZone, validTimeZone } from "../admin/timezone";

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicPaths = new Set([
  "/",
  "/jobs",
  "/consultation",
  "/privacy",
  "/terms",
  "/programs/start",
  "/programs/pro",
  "/programs/vip",
  "/payment/start",
  "/payment/pro",
  "/payment/vip",
  "/services/job-search",
  "/services/cv-portfolio",
  "/services/interview-preparation",
  "/services/career-support",
]);

export function publicAnalyticsPath(path: unknown): path is string {
  return typeof path === "string" && publicPaths.has(path);
}

export function validatePageView(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const { id, sessionId, path } = input as Record<string, unknown>;
  if (
    typeof id !== "string" ||
    !uuid.test(id) ||
    typeof sessionId !== "string" ||
    !uuid.test(sessionId) ||
    !publicAnalyticsPath(path)
  )
    return null;
  return { id, sessionId, path };
}

export function analyticsRange(
  params: Record<string, string | string[] | undefined>,
  now = new Date(),
  requestedTimeZone = "UTC",
) {
  const timeZone = validTimeZone(requestedTimeZone);
  const end = dateInTimeZone(now, timeZone);
  const start = new Date(`${end}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 29);
  const validDate = (value: unknown): value is string =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  const from = validDate(params.from)
    ? params.from
    : start.toISOString().slice(0, 10);
  const to = validDate(params.to) ? params.to : end;
  const days = (Date.parse(to) - Date.parse(from)) / 86400000;
  const invalid = from > to || days > 365 || from < "2020-01-01" || to > end;
  return {
    from: invalid ? start.toISOString().slice(0, 10) : from,
    to: invalid ? end : to,
    group: params.group === "month" ? ("month" as const) : ("day" as const),
    invalid,
    timeZone,
  };
}
