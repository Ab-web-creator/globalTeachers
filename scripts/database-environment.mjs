import { randomBytes } from "node:crypto";

export function prepareDatabaseEnvironment(text, values) {
  const additions = {};
  if (!values.DATABASE_URL?.trim()) {
    const port = values.LOCAL_DATABASE_PORT || "55433";
    if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) {
      throw new Error("LOCAL_DATABASE_PORT must be a port between 1024 and 65535.");
    }
    const password = values.LOCAL_DATABASE_PASSWORD || randomBytes(32).toString("hex");
    additions.LOCAL_DATABASE_PASSWORD = password;
    additions.LOCAL_DATABASE_PORT = port;
    additions.LOCAL_DATABASE_MANAGED = "docker";
    additions.DATABASE_URL = `postgresql://globalteachers:${encodeURIComponent(password)}@127.0.0.1:${port}/globalteachers`;
  }
  for (const key of ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET", "CRON_SECRET"]) {
    if (!values[key]?.trim()) additions[key] = randomBytes(32).toString("hex");
  }
  let lines = text.split(/\r?\n/);
  for (const [key, value] of Object.entries(additions)) {
    lines = lines.filter((line) => !new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`).test(line));
    lines.push(`${key}=${JSON.stringify(value)}`);
  }
  return { text: lines.join("\n").replace(/\n*$/, "\n"), values: { ...values, ...additions } };
}
