export type PersonName = { firstName: string; lastName: string };

// The combined name is what greetings, emails and admin lists display.
export function fullName({ firstName, lastName }: PersonName) {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}
