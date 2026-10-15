/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { POST } = require('../app/api/payment/contact/route.ts');

test('contact requests validate, save only contact fields, and avoid duplicate notifications', async () => {
  const env = { ...process.env }, pool = global.consultationPool, fetch = global.fetch;
  Object.assign(process.env, { DATABASE_URL: 'test', SITE_URL: 'https://example.com', RESEND_API_KEY: 'test', CONSULTATION_EMAIL_FROM: 'info@example.com', CONSULTATION_EMAIL_TO: 'team@example.com' });
  let notified = false, writes = 0, sends = 0, mailboxWrites = 0, throttled = false;
  const input = { id: '11111111-1111-4111-8111-111111111111', name: 'Анна', email: 'Teacher@Example.com', tier: 'START', message: 'Как оплатить?', cardNumber: 'must-not-be-stored', cvc: 'must-not-be-stored' };
  global.consultationPool = { query: async (sql, params) => {
    if (sql.includes('INSERT INTO mailbox_messages')) {
      mailboxWrites++;
      assert.deepEqual(params, [input.id, ['team@example.com']]);
      assert.match(sql, /ON CONFLICT \(id\) DO NOTHING/);
      return { rowCount: 1 };
    }
    if (sql.startsWith('INSERT')) {
      writes++;
      assert.deepEqual(params, [input.id, input.name, 'teacher@example.com', 'START', input.message]);
      assert.match(sql, /ON CONFLICT \(id\)/);
      return { rowCount: throttled ? 0 : 1, rows: [{ notified_at: notified ? new Date() : null }] };
    }
    notified = true;
    return { rowCount: 1 };
  } };
  global.fetch = async (url, options) => {
    sends++;
    assert.equal(url, 'https://api.resend.com/emails');
    const email = JSON.parse(options.body);
    assert.deepEqual(email.to, ['team@example.com']);
    assert.equal(email.reply_to, 'teacher@example.com');
    assert.equal(email.text.includes('must-not-be-stored'), false);
    return Response.json({ id: 'mail-id' });
  };
  const send = (body, origin = 'https://example.com') => POST(new Request('https://example.com/api/payment/contact', { method: 'POST', headers: { origin }, body: JSON.stringify(body) }));
  try {
    assert.equal((await send(input, 'https://other.example')).status, 403);
    for (const body of [null, {}, { ...input, email: 'invalid' }, { ...input, tier: 'UNKNOWN' }, { ...input, message: ' ' }]) assert.equal((await send(body)).status, 400);
    assert.equal(writes, 0);
    assert.equal((await send(input)).status, 200);
    assert.equal((await send(input)).status, 200);
    assert.equal(sends, 1);
    assert.equal(mailboxWrites, 2);
    throttled = true;
    assert.equal((await send(input)).status, 429);
  } finally {
    global.consultationPool = pool;
    global.fetch = fetch;
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
  }
});
