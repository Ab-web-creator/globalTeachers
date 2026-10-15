export function isCardExpiryPast(value: string, now = new Date()): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 4) return false;
  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));
  return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
}
