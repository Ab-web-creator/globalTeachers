/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { isCardExpiryPast } = require('../app/payment/components/card-expiry.ts');

test('expiry validation permits the entire current month and handles year boundaries', () => {
  const now = new Date(2026, 9, 31, 23, 59);
  for (const value of ['09 / 26', '12 / 25', '01 / 00']) assert.equal(isCardExpiryPast(value, now), true);
  for (const value of ['10 / 26', '11 / 26', '01 / 27', '12 / 40', '', '1', '10 / 2']) assert.equal(isCardExpiryPast(value, now), false);
  assert.equal(isCardExpiryPast('12 / 26', new Date(2027, 0, 1)), true);
  assert.equal(isCardExpiryPast('01 / 27', new Date(2027, 0, 31)), false);
});
