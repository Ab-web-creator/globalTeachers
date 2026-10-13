import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile, rename, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { open } from "maxmind";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const target =
  process.env.ANALYTICS_GEOIP_DATABASE ||
  join(process.cwd(), ".local", "geoip", "city.mmdb");
const version = new Date().toISOString().slice(0, 7);
const marker = `${target}.version`;
const temporary = `${target}.${process.pid}.tmp`;
await mkdir(dirname(target), { recursive: true });
try {
  if (
    (await readFile(marker, "utf8").catch(() => "")).trim() === version &&
    (await stat(target)
      .then(() => true)
      .catch(() => false))
  ) {
    console.log(`City geolocation database is current (${version}).`);
  } else {
    console.log(
      `Downloading DB-IP city database (${version}); this is server data, not a browser asset.`,
    );
    const response = await fetch(
      `https://download.db-ip.com/free/dbip-city-lite-${version}.mmdb.gz`,
      { signal: AbortSignal.timeout(120000) },
    );
    if (!response.ok || !response.body)
      throw new Error(`Database download failed (${response.status}).`);
    await pipeline(
      Readable.fromWeb(response.body),
      createGunzip(),
      createWriteStream(temporary),
    );
    const database = await open(temporary);
    if (!database.get("8.8.8.8"))
      throw new Error("Downloaded database did not pass lookup validation.");
    await rename(temporary, target);
    await writeFile(marker, `${version}\n`);
    console.log(`City geolocation database updated (${version}).`);
  }
} catch (error) {
  await rm(temporary, { force: true });
  if (
    await stat(target)
      .then(() => true)
      .catch(() => false)
  ) {
    console.warn(
      `Geolocation update failed; keeping the existing database. ${error.message}`,
    );
  } else {
    console.error(`Geolocation is unavailable. ${error.message}`);
    process.exitCode = 1;
  }
}
