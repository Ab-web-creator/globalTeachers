import { Pool } from "pg";

const globalDatabase = globalThis as typeof globalThis & { consultationPool?: Pool };

export function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!globalDatabase.consultationPool) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 10000,
      allowExitOnIdle: true,
    });
    pool.on("error", () => console.error("Consultation database connection failed."));
    globalDatabase.consultationPool = pool;
  }
  return globalDatabase.consultationPool;
}
