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
  assert.equal(message.subject, 'Копия: Hello');
  assert.match(message.html, /<p style="[^"]*font-weight:bold">Это копия письма, которое получил TeacherNavigator<\/p>/);
  assert.match(message.html, /«Question»/);
  assert.match(message.html, new RegExp(`href="https://example.com/admin/mail/view/${stored.get('email-1').id}\\?key=\\d+\\.[\\w-]+"`));
  assert.match(message.text, /Открыть письмо полностью: https:\/\/example.com\/admin\/mail\/view\//);
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

test('admin delete route authorizes, validates and moves only the chosen email to trash', async () => withEnvironment(async () => {
  const { POST: remove } = require('../app/admin/mail/delete/route.ts');
  const calls = [];
  let rowCount = 1;
  global.consultationPool = { query: async (sql, values) => { calls.push({ sql, values }); return { rowCount }; } };
  const token = createSession();
  const id = '44444444-4444-4444-8444-444444444444';
  const request = (body, cookie = token, origin = 'https://example.com') => new NextRequest('https://example.com/admin/mail/delete', {
    method: 'POST', headers: { origin, cookie: cookie ? `gth_admin=${cookie}` : '' }, body: JSON.stringify(body),
  });
  assert.equal((await remove(request({ id }, ''))).status, 401);
  assert.equal((await remove(request({ id }, token, 'https://attacker.example'))).status, 403);
  assert.equal((await remove(request({ id: 'invalid' }))).status, 400);
  assert.equal(calls.length, 0);
  assert.equal((await remove(request({ id }))).status, 204);
  assert.match(calls.at(-1).sql, /UPDATE mailbox_messages SET deleted_at = COALESCE\(deleted_at, now\(\)\) WHERE id = \$1/);
  assert.deepEqual(calls.at(-1).values, [id]);
  rowCount = 0;
  assert.equal((await remove(request({ id }))).status, 404);
}));

test('permanent deletion requires authorization and targets only the chosen trashed email', async () => withEnvironment(async () => {
  const { POST: remove } = require('../app/admin/mail/permanently-delete/route.ts');
  const calls = [];
  let rowCount = 1;
  global.consultationPool = { query: async (sql, values) => { calls.push({ sql, values }); return { rowCount }; } };
  const token = createSession();
  const id = '44444444-4444-4444-8444-444444444444';
  const request = (body, cookie = token, origin = 'https://example.com') => new NextRequest('https://example.com/admin/mail/permanently-delete', {
    method: 'POST', headers: { origin, cookie: cookie ? `gth_admin=${cookie}` : '' }, body: JSON.stringify(body),
  });
  assert.equal((await remove(request({ id }, ''))).status, 401);
  assert.equal((await remove(request({ id }, token, 'https://attacker.example'))).status, 403);
  assert.equal((await remove(request({ id: 'invalid' }))).status, 400);
  assert.equal(calls.length, 0);
  assert.equal((await remove(request({ id }))).status, 204);
  assert.match(calls.at(-1).sql, /DELETE FROM mailbox_messages WHERE id = \$1 AND deleted_at IS NOT NULL/);
  assert.deepEqual(calls.at(-1).values, [id]);
  // A live-folder message or an already removed message cannot be deleted.
  rowCount = 0;
  assert.equal((await remove(request({ id }))).status, 404);
  global.consultationPool.query = async () => { throw new Error('unavailable'); };
  assert.equal((await remove(request({ id }))).status, 503);
}));

test('admin unread route marks only inbound emails as unread', async () => withEnvironment(async () => {
  const { POST: unread } = require('../app/admin/mail/unread/route.ts');
  const calls = [];
  global.consultationPool = { query: async (sql, values) => { calls.push({ sql, values }); return { rowCount: 1 }; } };
  const token = createSession();
  const id = '55555555-5555-4555-8555-555555555555';
  const request = (body, cookie = token) => new NextRequest('https://example.com/admin/mail/unread', {
    method: 'POST', headers: { origin: 'https://example.com', cookie: cookie ? `gth_admin=${cookie}` : '' }, body: JSON.stringify(body),
  });
  assert.equal((await unread(request({ id }, ''))).status, 401);
  assert.equal((await unread(request({ id: 'invalid' }))).status, 400);
  assert.equal(calls.length, 0);
  assert.equal((await unread(request({ id }))).status, 204);
  assert.match(calls.at(-1).sql, /SET read_at = NULL WHERE id = \$1 AND direction = 'inbound'/);
}));

test('admin login returns only to admin pages', () => {
  const { safeAdminPath } = require('../lib/admin/session.ts');
  assert.equal(safeAdminPath('/admin/mail/55555555-5555-4555-8555-555555555555'), '/admin/mail/55555555-5555-4555-8555-555555555555');
  for (const value of ['https://evil.example', '//evil.example', '/admin//evil', '/administrator', '/admin/mail?x=1', null]) assert.equal(safeAdminPath(value), null);
});

test('read-only email links open one email only and expire', () => {
  process.env.ADMIN_PASSWORD = 'test-password-with-sufficient-length';
  process.env.ADMIN_SESSION_SECRET = 'a'.repeat(64);
  const { mailViewUrl, validMailViewKey } = require('../lib/mailbox/view-link.ts');
  const id = '66666666-6666-4666-8666-666666666666';
  const key = new URL(mailViewUrl('https://example.com', id)).searchParams.get('key');
  assert.equal(validMailViewKey(id, key), true);
  assert.equal(validMailViewKey('77777777-7777-4777-8777-777777777777', key), false);
  assert.equal(validMailViewKey(id, `${key}x`), false);
  assert.equal(validMailViewKey(id, `${Number(key.split('.')[0]) + 1}.${key.split('.')[1]}`), false);
  assert.equal(validMailViewKey(id, key, Date.now() + 31 * 24 * 60 * 60 * 1000), false);
  assert.equal(validMailViewKey(id, undefined), false);
  process.env.ADMIN_PASSWORD = 'changed-password-with-sufficient-length';
  assert.equal(validMailViewKey(id, key), false);
});

test('signed delivery events record failures once by webhook ID without creating mailbox copies', async () => withEnvironment(async () => {
  const queries = [];
  global.consultationPool = { query: async (sql, values) => { queries.push({ sql, values }); return { rowCount: 1 }; } };
  const payload = { type: 'email.bounced', created_at: '2026-10-19T10:00:00Z', data: {
    email_id: 'provider-email', bounce: { message: '550 Mailbox does not exist' },
  } };
  const request = (event, authenticated = true) => {
    const body = JSON.stringify(event);
    return new Request('https://example.com/api/mail/inbound', { method: 'POST', headers: authenticated ? signed(body) : {}, body });
  };
  assert.equal((await inbound(request(payload, false))).status, 401);
  assert.equal(queries.length, 0);
  assert.equal((await inbound(request(payload))).status, 204);
  assert.match(queries[0].sql, /INSERT INTO mail_delivery_events/);
  assert.match(queries[0].sql, /ON CONFLICT \(id\) DO NOTHING/);
  assert.deepEqual(queries[0].values, ['msg_1', 'provider-email', 'email.bounced', payload.created_at, '550 Mailbox does not exist']);
  for (const [type, detail] of [['email.failed', { failed: { reason: 'Invalid recipient' } }], ['email.suppressed', { suppressed: { message: 'Suppressed address' } }], ['email.delivered', {}], ['email.delivery_delayed', {}]]) {
    assert.equal((await inbound(request({ ...payload, type, data: { email_id: 'provider-email', ...detail } }))).status, 204);
    assert.equal(queries.at(-1).values[2], type);
  }
  const count = queries.length;
  assert.equal((await inbound(request({ ...payload, created_at: 'invalid' }))).status, 400);
  assert.equal((await inbound(request({ ...payload, data: {} }))).status, 400);
  assert.equal(queries.length, count);
  global.consultationPool.query = async () => { throw new Error('database unavailable'); };
  assert.equal((await inbound(request(payload))).status, 500);
}));
