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
const {
  calendarDay,
  calendarHourStart,
} = require("../lib/client-area/calendar-hours.ts");

test("calendar hours use Amsterdam time independently of the browser timezone", () => {
  assert.equal(calendarHourStart("2026-10-16", 9), "2026-10-16T07:00:00.000Z");
  assert.equal(calendarHourStart("2026-11-16", 9), "2026-11-16T08:00:00.000Z");
  assert.equal(calendarDay(new Date("2026-10-16T22:30:00Z")), "2026-10-17");
});

test("nonexistent daylight-saving hours and invalid dates cannot be selected", () => {
  assert.equal(calendarHourStart("2027-03-28", 2), null);
  assert.equal(calendarHourStart("2027-02-30", 9), null);
  assert.equal(calendarHourStart("", 9), null);
  assert.equal(calendarHourStart("2027-01-01", 24), null);
  const repeated = calendarHourStart("2026-10-25", 2);
  assert.ok(repeated);
  assert.equal(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date(repeated)),
    "02",
  );
});

test("calendar days and full hours follow the administrator time zone", () => {
  assert.equal(calendarHourStart("2026-10-16", 9, "Asia/Bangkok"), "2026-10-16T02:00:00.000Z");
  assert.equal(calendarHourStart("2026-10-16", 9, "America/New_York"), "2026-10-16T13:00:00.000Z");
  assert.equal(calendarHourStart("2026-10-16", 9, "Asia/Kolkata"), "2026-10-16T03:30:00.000Z");
  assert.equal(calendarDay(new Date("2026-10-16T22:30:00Z"), "Asia/Bangkok"), "2026-10-17");
  assert.equal(calendarDay(new Date("2026-10-16T22:30:00Z"), "America/New_York"), "2026-10-16");
  assert.equal(calendarHourStart("2027-03-14", 2, "America/New_York"), null);
});
