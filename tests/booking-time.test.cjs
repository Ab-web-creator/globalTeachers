/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
const { bookingTimeText } = require("../lib/client-area/booking-time.ts");

test("booking confirmation shows local time plus UTC, including day changes and daylight saving", () => {
  const october = bookingTimeText(
    new Date("2026-10-16T11:00:00Z"),
    "Europe/Amsterdam",
  );
  assert.ok(october.includes("13:00 (Europe/Amsterdam)"));
  assert.ok(october.includes("11:00 (UTC)"));
  assert.ok(
    bookingTimeText(
      new Date("2026-11-16T11:00:00Z"),
      "Europe/Amsterdam",
    ).includes("12:00 (Europe/Amsterdam)"),
  );
  assert.ok(
    bookingTimeText(new Date("2026-10-16T23:00:00Z"), "Asia/Tokyo").includes(
      "17 октября 2026",
    ),
  );
});

test("unknown zones safely fall back to UTC", () => {
  const time = new Date("2026-10-16T11:00:00Z");
  assert.equal(bookingTimeText(time, "invalid"), bookingTimeText(time, "UTC"));
  assert.equal(bookingTimeText(time, undefined), bookingTimeText(time, "UTC"));
});
