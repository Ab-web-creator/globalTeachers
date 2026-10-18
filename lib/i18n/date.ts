const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const shortMonths = ["yan.", "fev.", "mar.", "apr.", "may", "iyun", "iyul", "avg.", "sen.", "okt.", "noy.", "dek."];
const weekdays: Record<string, string> = {
  Monday: "duşanba", Tuesday: "seşanba", Wednesday: "çorşanba", Thursday: "payşanba",
  Friday: "juma", Saturday: "şanba", Sunday: "yakşanba",
};

// Uzbek locale data is absent in some browsers. Format numeric parts using a
// widely supported locale, then supply our own names so SSR and hydration agree.
export function formatUzbekDate(value: Date | number, options: Intl.DateTimeFormatOptions): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: options.timeZone ?? "UTC",
    calendar: "gregory", numberingSystem: "latn", hourCycle: "h23",
    year: "numeric", month: "numeric", day: "numeric", weekday: "long",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value ?? "";
  const month = Number(part("month")) - 1;
  const day = options.day === "2-digit" ? part("day").padStart(2, "0") : String(Number(part("day")));
  const dateStyle = options.dateStyle;
  const date: string[] = [];
  const showDay = Boolean(options.day || dateStyle);
  const showMonth = Boolean(options.month || dateStyle);
  const showYear = Boolean(options.year || dateStyle);
  if (dateStyle === "short" || options.month === "numeric" || options.month === "2-digit") {
    if (showDay) date.push(day.padStart(2, "0"));
    if (showMonth) date.push(part("month").padStart(2, "0"));
    if (showYear) date.push(options.year === "2-digit" ? part("year").slice(-2) : part("year"));
  } else {
    const monthName = options.month === "short" || dateStyle === "medium" ? shortMonths[month] : months[month];
    if (showDay && showMonth) date.push(`${day}-${monthName}`);
    else if (showDay) date.push(day);
    else if (showMonth) date.push(monthName);
    if (showYear) date.push(options.year === "2-digit" ? part("year").slice(-2) : part("year"));
  }
  const numericDate = dateStyle === "short" || options.month === "numeric" || options.month === "2-digit";
  let result = date.join(numericDate ? "." : " ");
  if (options.weekday || dateStyle === "full") {
    const weekday = weekdays[part("weekday")];
    const label = options.weekday === "short" || options.weekday === "narrow" ? weekday.slice(0, 3) : weekday;
    result = result ? `${label}, ${result}` : label;
  }
  if (options.hour || options.minute || options.timeStyle) {
    const time = [part("hour"), part("minute")];
    if (options.second || options.timeStyle === "medium" || options.timeStyle === "long" || options.timeStyle === "full") time.push(part("second"));
    result = result ? `${result}, ${time.join(":")}` : time.join(":");
  }
  return result;
}
