/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};
const { validatePageView, analyticsRange } = require('../lib/analytics/validation.ts');
const { POST } = require('../app/api/analytics/route.ts');

test('verified admin browsers are excluded, while forged markers cannot authorize admin access', async () => {
  const { createAnalyticsExclusion, validAnalyticsExclusion, validSession, createSession, analyticsAdminCookie } = require('../lib/admin/session.ts');
  const { POST: exclude } = require('../app/admin/analytics/exclude/route.ts');
  const saved = { ...process.env };
  try {
    process.env.NODE_ENV = 'production';
    process.env.SITE_URL = 'https://example.com';
    process.env.ADMIN_PASSWORD = 'test-password-with-sufficient-length';
    process.env.ADMIN_SESSION_SECRET = 'a'.repeat(64);
    const token = createAnalyticsExclusion();
    assert.equal(validAnalyticsExclusion(token), true);
    assert.equal(validAnalyticsExclusion(token + 'tampered'), false);
    assert.equal(validSession(token), false);
    assert.equal(validAnalyticsExclusion(createSession()), false);
    const request = (cookie = '') => new Request('https://example.com/api/analytics', { method: 'POST', headers: { origin: 'https://example.com', cookie }, body: '{}' });
    assert.equal((await POST(request(`${analyticsAdminCookie}=${token}`))).status, 204);
    assert.equal((await POST(request(`${analyticsAdminCookie}=forged`))).status, 400);
    assert.equal((await exclude(request(`${analyticsAdminCookie}=${token}`))).status, 403);
    const response = await exclude(request(`gth_admin=${createSession()}`));
    assert.equal(response.status, 204);
    assert.match(response.headers.get('set-cookie'), /Path=\//);
    assert.match(response.headers.get('set-cookie'), /HttpOnly/);
    const originalNow = Date.now;
    Date.now = () => originalNow() + 366 * 86400000;
    try { assert.equal(validAnalyticsExclusion(token), false); } finally { Date.now = originalNow; }
  } finally {
    for (const key of ['NODE_ENV', 'SITE_URL', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET']) {
      if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
    }
  }
});

test('analytics accepts public paths only and discards unrelated input', () => {
  const input = { id: randomUUID(), sessionId: randomUUID(), path: '/', email: 'never-store@example.com' };
  assert.deepEqual(validatePageView(input), { id: input.id, sessionId: input.sessionId, path: '/' });
  for (const path of ['/admin', '/admin/mail', '/api/consultation', '/consultation?token=secret', '//external.example', '/unknown']) {
    assert.equal(validatePageView({ ...input, path }), null);
  }
  assert.equal(validatePageView({ ...input, sessionId: 'not-a-uuid' }), null);
  assert.equal(validatePageView(null), null);
});

test('analytics validates actual calendar dates, inclusive date ranges and bounded periods', () => {
  const now = new Date('2026-10-13T12:00:00Z');
  assert.deepEqual(analyticsRange({}, now), { from: '2026-09-14', to: '2026-10-13', group: 'day', invalid: false, timeZone: 'UTC' });
  assert.equal(analyticsRange({ from: '2026-10-13', to: '2026-10-13', group: 'month' }, now).group, 'month');
  assert.equal(analyticsRange({ from: '2026-10-13', to: '2026-10-12' }, now).invalid, true);
  assert.equal(analyticsRange({ from: '2020-01-01' }, now).invalid, true);
  assert.equal(analyticsRange({ to: '2026-10-14' }, now).invalid, true);
  assert.equal(analyticsRange({ from: '2026-02-30' }, now).from, '2026-09-14');
  assert.equal(analyticsRange({ group: "day'); DROP TABLE site_page_views;--" }, now).group, 'day');
});

test('administrator time zones validate safely and local dates follow midnight in each region', () => {
  const { validTimeZone, dateInTimeZone } = require('../lib/admin/timezone.ts');
  assert.equal(validTimeZone('Europe/Amsterdam'), 'Europe/Amsterdam');
  assert.equal(validTimeZone("UTC'; DROP TABLE site_page_views;--"), 'UTC');
  assert.equal(validTimeZone(undefined), 'UTC');
  const midnight = new Date('2026-10-13T00:30:00Z');
  assert.equal(dateInTimeZone(midnight, 'America/Los_Angeles'), '2026-10-12');
  assert.equal(dateInTimeZone(midnight, 'Asia/Tokyo'), '2026-10-13');
  assert.equal(analyticsRange({}, midnight, 'America/Los_Angeles').to, '2026-10-12');
  assert.equal(analyticsRange({}, midnight, 'Europe/Amsterdam').timeZone, 'Europe/Amsterdam');
  assert.equal(analyticsRange({ to: '2026-10-13' }, midnight, 'America/Los_Angeles').invalid, true);
  assert.equal(dateInTimeZone(new Date('2026-03-29T00:30:00Z'), 'Europe/Amsterdam'), '2026-03-29');
});

test('tracking rejects cross-origin, private paths and oversized input; privacy signals and bots skip writes', async () => {
  const previousEnvironment = process.env.NODE_ENV;
  const previousSite = process.env.SITE_URL;
  process.env.NODE_ENV = 'production';
  process.env.SITE_URL = 'https://example.com';
  const request = (input, headers = {}) => new Request('https://example.com/api/analytics', {
    method: 'POST', headers: { origin: 'https://example.com', ...headers }, body: JSON.stringify(input),
  });
  const input = { id: randomUUID(), sessionId: randomUUID(), path: '/' };
  try {
    assert.equal((await POST(request(input, { origin: 'https://attacker.example' }))).status, 403);
    assert.equal((await POST(request({ ...input, path: '/admin' }))).status, 400);
    assert.equal((await POST(request({ ...input, extra: 'x'.repeat(1100) }))).status, 413);
    assert.equal((await POST(request(input, { dnt: '1' }))).status, 204);
    assert.equal((await POST(request(input, { 'sec-gpc': '1' }))).status, 204);
    assert.equal((await POST(request(input, { 'user-agent': 'Googlebot' }))).status, 204);
  } finally {
    if (previousEnvironment === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousEnvironment;
    if (previousSite === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = previousSite;
  }
});

test('recording uses server timestamps, deduplicates event IDs, and rolls back failed writes', async () => {
  const { recordPageView } = require('../lib/analytics/visits.ts');
  const previousPool = globalThis.consultationPool;
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'test-only';
  const queries = [];
  let released = 0;
  const client = { query: async (sql, values) => { queries.push({ sql, values }); return { rows: [] }; }, release: () => { released++; } };
  globalThis.consultationPool = { connect: async () => client };
  const input = { id: randomUUID(), sessionId: randomUUID(), path: '/' };
  try {
    await recordPageView(input);
    const insert = queries.find(({ sql }) => sql.includes('INSERT'));
    assert.deepEqual(insert.values, [input.id, input.sessionId, '/', null, null]);
    assert.match(insert.sql, /ON CONFLICT \(id\) DO NOTHING/);
    assert.match(insert.sql, /< 30/);
    assert.equal(queries.at(-1).sql, 'COMMIT');
    client.query = async (sql) => { queries.push({ sql }); if (sql.includes('INSERT')) throw new Error('Database unavailable'); return { rows: [] }; };
    await assert.rejects(recordPageView(input), /Database unavailable/);
    assert.equal(queries.at(-1).sql, 'ROLLBACK');
    assert.equal(released, 2);
  } finally {
    globalThis.consultationPool = previousPool;
    if (previousUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previousUrl;
  }
});

test('geolocation uses the proxy IP only, validates addresses and ignores client-supplied forwarding chains', () => {
  const { visitorIp } = require('../lib/analytics/location.ts');
  assert.equal(visitorIp(new Headers({ 'x-real-ip': '8.8.8.8' })), '8.8.8.8');
  assert.equal(visitorIp(new Headers({ 'x-real-ip': '::ffff:8.8.8.8' })), '8.8.8.8');
  assert.equal(visitorIp(new Headers({ 'x-real-ip': '2001:4860:4860::8888' })), '2001:4860:4860::8888');
  assert.equal(visitorIp(new Headers({ 'x-forwarded-for': '8.8.8.8, 127.0.0.1' })), null);
  assert.equal(visitorIp(new Headers({ 'x-real-ip': '8.8.8.8, 127.0.0.1' })), null);
  assert.equal(visitorIp(new Headers()), null);
});
