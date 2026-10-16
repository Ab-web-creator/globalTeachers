import { validTimeZone } from "../admin/timezone";

export function bookingTimeText(startsAt: Date, requestedZone: unknown) {
  const timeZone = validTimeZone(requestedZone);
  const format = (zone: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: zone,
    }).format(startsAt);
  const utc = `${format("UTC")} (UTC)`;
  return timeZone === "UTC"
    ? `${utc}.`
    : `Ваше местное время: ${format(timeZone)} (${timeZone}).\nВремя UTC: ${utc}.`;
}
