import { isIP } from "node:net";
import { join } from "node:path";
import { access } from "node:fs/promises";
import { open, type CityResponse, type Reader } from "maxmind";

export type VisitLocation = { country: string | null; city: string | null };
const unknown: VisitLocation = { country: null, city: null };
let reader: Promise<Reader<CityResponse> | null> | null = null;

export function geoDatabasePath() {
  return (
    process.env.ANALYTICS_GEOIP_DATABASE ||
    join(process.cwd(), ".local", "geoip", "city.mmdb")
  );
}

export async function geoDatabaseAvailable() {
  try {
    await access(geoDatabasePath());
    return true;
  } catch {
    return false;
  }
}

export function visitorIp(headers: Headers) {
  // Nginx must overwrite this header, and Next.js must not be publicly reachable.
  const ip = headers
    .get("x-real-ip")
    ?.trim()
    .replace(/^::ffff:/i, "");
  return ip && isIP(ip) ? ip : null;
}

export async function visitorLocation(
  headers: Headers,
): Promise<VisitLocation> {
  const ip = visitorIp(headers);
  if (!ip) return unknown;
  reader ??= open<CityResponse>(geoDatabasePath(), {
    watchForUpdates: true,
    watchForUpdatesNonPersistent: true,
  }).catch(() => {
    reader = null;
    return null;
  });
  try {
    const result = (await reader)?.get(ip);
    const country = result?.country?.iso_code;
    const city = result?.city?.names?.ru || result?.city?.names?.en;
    return {
      country: country && /^[A-Z]{2}$/.test(country) ? country : null,
      city: city ? city.slice(0, 120) : null,
    };
  } catch {
    return unknown;
  }
}
