/** Validate browser POSTs against the public site, not Next's internal bind address. */
export function trustedRequestOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return null;
  try {
    const incoming = new URL(origin);
    if (!["http:", "https:"].includes(incoming.protocol) || incoming.origin !== origin) return null;
    const server = new URL(request.url);
    const configured = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : null;
    if (process.env.NODE_ENV === "production") {
      return origin === (configured ?? server.origin) ? origin : null;
    }
    // In development, localhost, 127.0.0.1 and LAN access can share the same
    // internal Next URL. Require the browser origin to match the actual Host.
    const host = request.headers.get("host");
    if (host) return incoming.host === host && incoming.protocol === server.protocol ? origin : null;
    return origin === server.origin ? origin : null;
  } catch {
    return null;
  }
}
