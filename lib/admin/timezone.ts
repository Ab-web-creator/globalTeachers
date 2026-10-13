export const adminTimeZoneCookie = "tn_admin_timezone";

export function validTimeZone(value: unknown) {
  if (typeof value !== "string" || value.length > 80) return "UTC";
  try {
    return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions()
      .timeZone;
  } catch {
    return "UTC";
  }
}

export function dateInTimeZone(value: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: string) =>
    parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
