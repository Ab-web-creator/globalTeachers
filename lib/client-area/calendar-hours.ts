import { appointmentTimeZone } from "./booking-rules";

function parts(value: Date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: appointmentTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(value)
      .map((part) => [part.type, part.value]),
  );
}

export function calendarDay(value: Date) {
  const result = parts(value);
  return `${result.year}-${result.month}-${result.day}`;
}

// Convert a calendar hour without relying on the administrator's device time zone.
// Nonexistent hours at the spring daylight-saving transition return null.
export function calendarHourStart(day: string, hour: number): string | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  )
    return null;
  const target = Date.parse(`${day}T${String(hour).padStart(2, "0")}:00:00Z`);
  if (!Number.isFinite(target)) return null;
  let value = target;
  for (let attempt = 0; attempt < 4; attempt++) {
    const local = parts(new Date(value));
    const represented = Date.parse(
      `${local.year}-${local.month}-${local.day}T${local.hour}:${local.minute}:${local.second}Z`,
    );
    const correction = target - represented;
    if (!correction) {
      const actual = new Date(value);
      return calendarDay(actual) === day && Number(local.hour) === hour
        ? actual.toISOString()
        : null;
    }
    value += correction;
  }
  return null;
}
