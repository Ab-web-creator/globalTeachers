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

test('unpaid START, PRO and VIP messages share Candidates instead of paid-client folders', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const { Pool } = require('pg');
  const { listMessages, getMessage, folderMessageCounts } = require('../lib/mailbox/messages.ts');
  const savedEnv = { ...process.env }, savedPool = global.consultationPool, savedFetch = global.fetch;
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const schema = `test_payment_folders_${Date.now()}`;
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}` });
  global.consultationPool = db;
  Object.assign(process.env, { DATABASE_URL: process.env.TEST_DATABASE_URL, SITE_URL: 'https://example.com', RESEND_API_KEY: 'test', CONSULTATION_EMAIL_FROM: 'info@example.com', CONSULTATION_EMAIL_TO: 'team@example.com' });
  global.fetch = async () => Response.json({ id: 'mock-email' });
  try {
    for (const name of ['013_mailbox.sql', '035_payment_contact_requests.sql', '037_mailbox_spam.sql', '038_client_area.sql']) {
      await db.query(fs.readFileSync(`database/migrations/${name}`, 'utf8'));
    }
    await db.query("ALTER TABLE private_clients ADD COLUMN paid_at timestamptz, ADD COLUMN frozen_at timestamptz");
    const folders = { START: 'start-clients', PRO: 'pro-clients', VIP: 'vip-clients' };
    for (const [tier, folder] of Object.entries(folders)) {
      const input = { id: require('node:crypto').randomUUID(), name: 'Test Teacher', email: `${tier.toLowerCase()}@example.com`, tier, message: `Payment question for ${tier}` };
      const response = await POST(new Request('https://example.com/api/payment/contact', { method: 'POST', headers: { origin: 'https://example.com' }, body: JSON.stringify(input) }));
      assert.equal(response.status, 200);
      assert.equal((await getMessage(input.id)).folder, "candidates");
      assert.ok((await listMessages("candidates", 1)).messages.some((message) => message.id === input.id));
      assert.equal((await listMessages(folder, 1)).total, 0);
      assert.equal((await listMessages('inbox', 1)).total, 0);
      assert.equal((await listMessages('spam', 1)).total, 0);
    }
    const counts = await folderMessageCounts();
    assert.deepEqual(counts.candidates, { total: 3, unread: 3 });
    for (const folder of Object.values(folders)) {
      assert.equal((await listMessages(folder, 1)).total, 0);
      assert.equal(counts[folder], undefined);
    }
    const proMessage = (await listMessages("candidates", 1)).messages.find(message => message.from_address === "pro@example.com");
    await db.query("INSERT INTO private_clients(email,name,tier,key_hash,paid_at) VALUES('pro@example.com','Test Teacher','PRO','test-hash',now())");
    assert.equal((await getMessage(proMessage.id)).folder, "pro-clients");
    assert.equal((await listMessages("pro-clients", 1)).total, 1);
    assert.equal((await listMessages("candidates", 1)).total, 2);
    await db.query("UPDATE private_clients SET paid_at=NULL WHERE email='pro@example.com'");
    assert.equal((await getMessage(proMessage.id)).folder, "candidates");
    assert.equal((await listMessages("candidates", 1)).total, 3);
    await db.query("UPDATE private_clients SET frozen_at=now() WHERE email='pro@example.com'");
    assert.equal((await getMessage(proMessage.id)).folder, "frozen");
    assert.equal((await listMessages("frozen", 1)).total, 1);
    assert.equal((await listMessages("candidates", 1)).total, 2);
    assert.deepEqual((await folderMessageCounts()).frozen, { total: 1, unread: 1 });
    await db.query("UPDATE private_clients SET paid_at=now(),frozen_at=NULL WHERE email='pro@example.com'");
    assert.equal((await getMessage(proMessage.id)).folder, "pro-clients");
    assert.equal((await listMessages("frozen", 1)).total, 0);


  } finally {
    global.fetch = savedFetch;
    global.consultationPool = savedPool;
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
