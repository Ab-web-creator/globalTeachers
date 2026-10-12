/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const crypto = require('node:crypto');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { NextRequest } = require('next/server');
const { validWebhook } = require('../lib/mailbox/signature.ts');
const { POST: inbound } = require('../app/api/mail/inbound/route.ts');
const { POST: send } = require('../app/admin/mail/send/route.ts');
const { createSession } = require('../lib/admin/session.ts');

const secret = `whsec_${Buffer.from('test-signing-key').toString('base64')}`;
function signed(body, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = crypto.createHmac('sha256', Buffer.from('test-signing-key')).update(`msg_1.${timestamp}.${body}`).digest('base64');
  return new Headers({ 'svix-id': 'msg_1', 'svix-timestamp': String(timestamp), 'svix-signature': `v1,invalid v1,${signature}` });
}

async function withEnvironment(run) {
  const savedEnv = { ...process.env };
  const savedPool = global.consultationPool;
  const savedFetch = global.fetch;
  try {
    Object.assign(process.env, {
      NODE_ENV: 'production', SITE_URL: 'https://example.com', DATABASE_URL: 'test-only', RESEND_API_KEY: 're_test',
      RESEND_WEBHOOK_SECRET: secret, CONSULTATION_EMAIL_FROM: 'TeacherNavigator <info@example.com>', CONSULTATION_EMAIL_TO: 'team@example.com',
      ADMIN_PASSWORD: 'test-password-with-sufficient-length', ADMIN_SESSION_SECRET: 'a'.repeat(64),
    });
    await run();
  } finally {
    global.consultationPool = savedPool;
    global.fetch = savedFetch;
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
  }
}

test('webhook signatures require the raw body, a valid key and a fresh timestamp', () => {
  const body = '{"type":"email.received"}';
  assert.equal(validWebhook(body, signed(body), secret), true);
  assert.equal(validWebhook(`${body} `, signed(body), secret), false);
  assert.equal(validWebhook(body, signed(body), `whsec_${Buffer.from('other').toString('base64')}`), false);
  assert.equal(validWebhook(body, signed(body, Math.floor(Date.now() / 1000) - 600), secret), false);
  assert.equal(validWebhook(body, new Headers(), secret), false);
});

test('inbound webhook stores the email once and forwards a copy without looping', async () => withEnvironment(async () => {
  process.env.MAILBOX_FORWARD_TO = 'copy@gmail.com, INFO@example.com';
  const stored = new Map();
  const queries = [];
  global.consultationPool = { query: async (sql, values) => {
    queries.push(sql);
    if (sql.startsWith('SELECT * FROM mailbox_messages')) return { rows: stored.has(values[0]) ? [stored.get(values[0])] : [] };
    if (sql.includes('INSERT INTO mailbox_messages')) {
      stored.set(values[1], { id: values[0], resend_id: values[1], from_address: values[3], to_addresses: values[4], reply_to: values[6],
        subject: values[7], text_body: values[8], html_body: values[9], attachments: JSON.parse(values[10]), created_at: values[11], forwarded_at: null });
      return { rowCount: 1 };
    }
    if (sql.startsWith('UPDATE mailbox_messages SET forwarded_at')) { for (const row of stored.values()) if (row.id === values[0]) row.forwarded_at = new Date(); return { rowCount: 1 }; }
    throw new Error(`Unexpected query ${sql}`);
  } };
  const calls = [];
  let failSend = true;
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.endsWith('/emails/receiving/email-1')) return Response.json({ id: 'email-1', from: 'Teacher <teacher@example.org>', to: ['info@example.com'], subject: 'Hello', text: 'Question', html: null, created_at: '2026-10-12T10:00:00Z', attachments: [{ id: 'a1', filename: 'cv.pdf', content_type: 'application/pdf', size: 10 }] });
    if (url.endsWith('/emails/receiving/email-1/attachments')) return Response.json({ data: [{ id: 'a1', filename: 'cv.pdf', content_type: 'application/pdf', download_url: 'https://files.example/cv.pdf' }] });
    if (url === 'https://api.resend.com/emails') return failSend ? new Response('', { status: 503 }) : Response.json({ id: 'sent-1' });
    throw new Error(`Unexpected fetch ${url}`);
  };
  const body = JSON.stringify({ type: 'email.received', data: { email_id: 'email-1' } });
  const request = (headers = signed(body), payload = body) => new Request('https://example.com/api/mail/inbound', { method: 'POST', headers, body: payload });

  assert.equal((await inbound(request(new Headers()))).status, 401);
  assert.equal(calls.length, 0);
  assert.equal((await inbound(request())).status, 500);
  assert.equal(stored.get('email-1').subject, 'Hello');
  failSend = false;
  assert.equal((await inbound(request())).status, 204);
  assert.equal(calls.filter(({ url }) => url.endsWith('/emails/receiving/email-1')).length, 1);
  const forward = calls.at(-1);
  const message = JSON.parse(forward.options.body);
  assert.deepEqual(message.to, ['copy@gmail.com']);
  assert.equal(message.reply_to, 'Teacher <teacher@example.org>');
  assert.equal(message.subject, 'Fwd: Hello');
  assert.deepEqual(message.attachments, [{ filename: 'cv.pdf', path: 'https://files.example/cv.pdf', content_type: 'application/pdf' }]);
  assert.equal(forward.options.headers['Idempotency-Key'], 'mailbox-forward-email-1');
  const sends = calls.length;
  assert.equal((await inbound(request())).status, 204);
  assert.equal(calls.length, sends);
  const other = JSON.stringify({ type: 'email.sent', data: {} });
  assert.equal((await inbound(request(signed(other), other))).status, 204);
}));

test('admin send route authorizes, validates and sends replies from the mailbox', async () => withEnvironment(async () => {
  const queries = [];
  global.consultationPool = { query: async (sql, values) => {
    queries.push({ sql, values });
    if (sql.startsWith('SELECT message_id')) return { rows: [{ message_id: '<original@example.org>' }] };
    return { rowCount: 1, rows: [] };
  } };
  const calls = [];
  global.fetch = async (url, options) => { calls.push(JSON.parse(options.body)); return Response.json({ id: 'sent-1' }); };
  const token = createSession();
  const id = '22222222-2222-4222-8222-222222222222';
  const original = '33333333-3333-4333-8333-333333333333';
  const mail = { id, to: 'teacher@example.org', cc: '', subject: 'Re: Hello', text: 'Answer', replyTo: original };
  const request = (body, cookie = token, origin = 'https://example.com') => new NextRequest('https://example.com/admin/mail/send', {
    method: 'POST', headers: { origin, cookie: cookie ? `gth_admin=${cookie}` : '' }, body: JSON.stringify(body),
  });
  assert.equal((await send(request(mail, ''))).status, 401);
  assert.equal((await send(request(mail, token, 'https://attacker.example'))).status, 403);
  assert.equal((await send(request({ ...mail, id: 'invalid' }))).status, 400);
  assert.equal((await send(request({ ...mail, to: 'not-an-email' }))).status, 400);
  assert.equal((await send(request({ ...mail, subject: ' ' }))).status, 400);
  assert.equal(calls.length, 0);
  assert.equal((await send(request(mail))).status, 204);
  assert.equal(calls[0].from, 'TeacherNavigator <info@example.com>');
  assert.deepEqual(calls[0].to, ['teacher@example.org']);
  assert.equal(calls[0].headers['In-Reply-To'], '<original@example.org>');
  assert.match(queries.at(-1).sql, /SET resend_id = \$2, sent_at = now\(\)/);
  assert.deepEqual(queries.at(-1).values, [id, 'sent-1']);
}));
