/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness transpiles TypeScript for Node tests. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const { Pool } = require('pg');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const { createToken, hashToken } = require('../lib/consultation/token.ts');
const { POST: submit } = require('../app/api/consultation/route.ts');
const { POST: confirm } = require('../app/api/consultation/confirm/route.ts');
const { GET: maintain } = require('../app/api/consultation/maintenance/route.ts');
const { savePendingApplication, confirmApplication, removeExpiredApplications } = require('../lib/consultation/applications.ts');
const { deliverNotification } = require('../lib/consultation/notifications.ts');
const { listApplications } = require('../lib/admin/applications.ts');
const { subjects } = require('../app/consultation/components/subjects.ts');
const answers = {
  name: 'Test Teacher', country: 'Test', email: 'test@example.com', contact: '',
  subject: subjects[0], experience: 'До 2 лет', education: 'Бакалавр',
  qualification: 'Да', international: 'Нет', english: 'Свободный',
  priority: 'Понять свои шансы', destinations: 'Азия', timing: 'Как можно скорее', goals: '',
};
const request = (body) => new Request('https://example.com/api/consultation', {
  method: 'POST', headers: { origin: 'https://example.com' }, body: JSON.stringify(body),
});

test('tokens are random, contain no answers, and malformed tokens are rejected', () => {
  const token = createToken();
  assert.equal(token.length, 43);
  assert.notEqual(createToken(), token);
  assert.equal(hashToken(token).length, 64);
  assert.notEqual(hashToken(token), token);
  for (const invalid of [null, '', {}, 'invalid', 'x'.repeat(10000)]) assert.throws(() => hashToken(invalid));
});

test('PostgreSQL application lifecycle', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.RESEND_API_KEY = 'test-only';
  process.env.CONSULTATION_EMAIL_FROM = 'noreply@example.com';
  process.env.CONSULTATION_EMAIL_TO = 'team@example.com';
  process.env.SITE_URL = 'https://example.com';
  process.env.CRON_SECRET = 'test-scheduler-secret';
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const schema = `test_consultation_${Date.now()}`;
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}`, max: 5 });
  global.consultationPool = db;
  const originalFetch = global.fetch;
  const calls = [];
  let failEmail = false;
  global.fetch = async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) });
    return failEmail ? new Response('', { status: 503 }) : Response.json({ id: 'mock-email' });
  };
  const count = async (table) => Number((await db.query(`SELECT count(*) FROM ${table}`)).rows[0].count);
  try {
    await db.query(fs.readFileSync('database/migrations/001_consultations.sql', 'utf8'));
    await t.test('save before email, shared cooldown, confirm once under concurrent clicks', async () => {
      assert.equal((await submit(request({ ...answers, subject: 'Custom subject' }))).status, 400);
      assert.equal(calls.length, 0);
      assert.equal((await submit(request(answers))).status, 200);
      assert.equal(await count('consultation_pending'), 1);
      assert.equal(await count('consultation_applications'), 0);
      const pending = (await db.query('SELECT * FROM consultation_pending')).rows[0];
      assert.deepEqual(pending.answers, answers);
      const token = calls[0].body.text.match(/\/confirm#([^\s]+)/)[1];
      assert.equal(pending.token_hash, hashToken(token));
      assert.equal((await submit(request(answers))).status, 429);
      const wrong = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
      assert.equal((await confirm(request({ token: wrong }))).status, 400);
      const responses = await Promise.all([confirm(request({ token })), confirm(request({ token }))]);
      assert.deepEqual(responses.map((r) => r.status), [200, 200]);
      assert.equal(await count('consultation_pending'), 0);
      assert.equal(await count('consultation_applications'), 1);
      assert.equal(calls.length, 2, 'one user email and one team notification');
      assert.equal(calls[1].body.to, 'team@example.com');
      assert.equal((await confirm(request({ token }))).status, 200);
      assert.equal(calls.length, 2, 'repeat confirmation does not resend');
    });
    await t.test('expired pending records are rejected and purged without deleting confirmed data', async () => {
      const token = await savePendingApplication({ ...answers, email: 'expired@example.com' });
      await db.query("UPDATE consultation_pending SET expires_at = now() - interval '1 second'");
      assert.equal((await confirm(request({ token }))).status, 400);
      assert.equal(await removeExpiredApplications(), 1);
      assert.equal(await count('consultation_applications'), 1);
    });
    await t.test('resubmission replaces pending answers and invalidates the old link', async () => {
      const old = await savePendingApplication({ ...answers, email: 'resubmit@example.com' });
      await db.query("UPDATE consultation_pending SET created_at = now() - interval '61 seconds'");
      const fresh = await savePendingApplication({ ...answers, email: 'resubmit@example.com', name: 'Updated' });
      assert.equal(await confirmApplication(hashToken(old)), null);
      const id = await confirmApplication(hashToken(fresh));
      assert.equal((await db.query('SELECT answers FROM consultation_applications WHERE id = $1', [id])).rows[0].answers.name, 'Updated');
    });
    await t.test('transaction rolls back without losing pending data', async () => {
      const token = await savePendingApplication({ ...answers, email: 'rollback@example.com' });
      await db.query("ALTER TABLE consultation_applications ADD CONSTRAINT test_reject CHECK (email <> 'rollback@example.com')");
      await assert.rejects(confirmApplication(hashToken(token)));
      assert.equal((await db.query('SELECT id FROM consultation_pending WHERE token_hash = $1', [hashToken(token)])).rowCount, 1);
      await db.query('ALTER TABLE consultation_applications DROP CONSTRAINT test_reject');
    });
    await t.test('mail failure preserves confirmed record and retries later', async () => {
      failEmail = true;
      const token = await savePendingApplication({ ...answers, email: 'retry@example.com' });
      assert.equal((await confirm(request({ token }))).status, 200);
      const row = (await db.query("SELECT * FROM consultation_applications WHERE email = 'retry@example.com'")).rows[0];
      assert.equal(row.notification_sent_at, null);
      assert.equal(row.notification_attempts, 1);
      failEmail = false;
      await db.query('UPDATE consultation_applications SET notification_next_attempt_at = now() WHERE id = $1', [row.id]);
      assert.equal(await deliverNotification(row.id), true);
      assert.ok((await db.query('SELECT notification_sent_at FROM consultation_applications WHERE id = $1', [row.id])).rows[0].notification_sent_at);
    });
    await t.test('failed initial email leaves only temporary data; database failure sends no email', async () => {
      failEmail = true;
      assert.equal((await submit(request({ ...answers, email: 'send-failed@example.com' }))).status, 503);
      assert.equal((await db.query("SELECT id FROM consultation_pending WHERE email = 'send-failed@example.com'")).rowCount, 1);
      assert.equal((await db.query("SELECT id FROM consultation_applications WHERE email = 'send-failed@example.com'")).rowCount, 0);
      const before = calls.length;
      global.consultationPool = { query: async () => { throw new Error('Database unavailable'); } };
      try { assert.equal((await submit(request({ ...answers, email: 'db-failed@example.com' }))).status, 503); }
      finally { global.consultationPool = db; }
      assert.equal(calls.length, before);
      failEmail = false;
    });
    await t.test('admin listing separates statuses, searches literal text, and excludes tokens', async () => {
      const all = await listApplications('all', '', 1);
      assert.ok(all.counts.pending > 0);
      assert.ok(all.counts.confirmed > 0);
      assert.equal(all.total, all.counts.pending + all.counts.confirmed);
      assert.ok(all.applications.every((row) => !('token_hash' in row)));
      const pending = await listApplications('pending', '', 1);
      assert.ok(pending.applications.every((row) => row.status === 'pending'));
      const confirmed = await listApplications('confirmed', 'RETRY@', 999);
      assert.equal(confirmed.total, 1);
      assert.equal(confirmed.page, 1);
      assert.equal(confirmed.applications[0].email, 'retry@example.com');
      assert.equal((await listApplications('all', "' OR 1=1 --", 1)).total, 0);
      assert.equal((await listApplications('all', '%', 1)).total, 0);
    });
    await t.test('maintenance is authenticated and cannot delete permanent records', async () => {
      assert.equal((await maintain(new Request('https://example.com/api/consultation/maintenance'))).status, 401);
      await db.query("UPDATE consultation_pending SET expires_at = now() - interval '1 second'");
      const before = await count('consultation_applications');
      const response = await maintain(new Request('https://example.com/api/consultation/maintenance', {
        headers: { authorization: 'Bearer test-scheduler-secret' },
      }));
      assert.equal(response.status, 200);
      assert.equal(await count('consultation_pending'), 0);
      assert.equal(await count('consultation_applications'), before);
    });
  } finally {
    global.fetch = originalFetch;
    delete global.consultationPool;
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
