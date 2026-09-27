import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";
import { prepareDatabaseEnvironment } from "./database-environment.mjs";

const action = process.argv[2];
const compose = ["compose", "--env-file", ".env.local", "-f", "compose.yaml"];

function run(command, args, message) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error || result.status !== 0) throw new Error(message);
}

try {
  if (!["setup", "start", "stop"].includes(action)) throw new Error("Use db:setup, db:start or db:stop.");
  if (!existsSync(".env.local")) {
    if (action !== "setup") throw new Error("Run npm run db:setup first.");
    writeFileSync(".env.local", readFileSync(".env.example", "utf8"), { mode: 0o600 });
  }
  nextEnv.loadEnvConfig(process.cwd());
  if (action === "setup") {
    // Check Docker before modifying a fresh environment. Existing databases are preserved.
    if (!process.env.DATABASE_URL?.trim() || process.env.LOCAL_DATABASE_MANAGED === "docker") {
      run("docker", ["info", "--format", "{{.ServerVersion}}"], "Install/start Docker Desktop, then run npm run db:setup again.");
    }
    const prepared = prepareDatabaseEnvironment(readFileSync(".env.local", "utf8"), process.env);
    writeFileSync(".env.local", prepared.text, { mode: 0o600 });
    Object.assign(process.env, prepared.values);
  }
  if (process.env.LOCAL_DATABASE_MANAGED === "docker") {
    run("docker", [...compose, ...(action === "stop" ? ["stop", "database"] : ["up", "-d", "--wait", "--wait-timeout", "60", "database"])], "Database command failed. Check Docker Desktop and the local database port.");
  } else if (action !== "setup") {
    if (!existsSync(".local/postgres/PG_VERSION")) throw new Error("This connection is externally managed. Start/stop it with your database provider.");
    const args = ["-D", ".local/postgres"];
    if (action === "start") {
      const status = spawnSync("pg_ctl", [...args, "status"], { stdio: "ignore" });
      if (status.status !== 0) run("pg_ctl", [...args, "-l", ".local/postgres.log", "start"], "Could not start local PostgreSQL.");
    } else run("pg_ctl", [...args, "stop"], "Could not stop local PostgreSQL.");
  }
  if (action === "setup") {
    run(process.execPath, ["scripts/migrate.mjs"], "Migration failed. Check DATABASE_URL and database availability.");
    console.log("Database ready. Admin password is in .env.local. Configure Resend there for email testing, then run npm run dev.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
