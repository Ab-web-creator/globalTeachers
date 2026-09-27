import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env.local before migrating.");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(7142026)");
  await client.query("CREATE TABLE IF NOT EXISTS consultation_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  const directory = fileURLToPath(new URL("../database/migrations/", import.meta.url));
  const applied = await client.query("SELECT name FROM consultation_migrations");
  const names = new Set(applied.rows.map((row) => row.name));
  for (const name of (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort()) {
    if (names.has(name)) continue;
    await client.query(await readFile(`${directory}/${name}`, "utf8"));
    await client.query("INSERT INTO consultation_migrations (name) VALUES ($1)", [name]);
    console.log(`Applied ${name}`);
  }
  await client.query("COMMIT");
  console.log("Database schema is ready.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
