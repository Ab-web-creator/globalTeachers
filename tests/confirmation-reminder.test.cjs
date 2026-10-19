/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { deliverConfirmationReminder } = require('../lib/consultation/confirmation-reminder.ts');
const { hashToken } = require('../lib/consultation/token.ts');

test('reminder uses latest name, valid additional token, and stable delivery on retry', async () => {
  Object.assign(process.env, { DATABASE_URL: 'mock', CRON_SECRET: 'test-secret', RESEND_API_KEY: 'test',
    CONSULTATION_EMAIL_FROM: 'test@example.com', CONSULTATION_EMAIL_TO: 'admin@example.com', SITE_URL: 'https://example.com' });
  const calls = [];
  let empty = false;
  const client = { release() {}, async query(sql, values) {
    calls.push({ sql, values });
    if (sql.startsWith('SELECT id')) return { rowCount: empty ? 0 : 1, rows: [{ id: 'latest', email: 'applicant@example.com',
      answers: { firstName: 'Ольга', lastName: 'Котц', name: 'Ольга Кленина' }, token_hash: hashToken('a'.repeat(43)) }] };
    return { rowCount: 1, rows: [] };
  } };
  global.consultationPool = { connect: async () => client };
  const originalFetch = global.fetch;
  const emails = [];
  global.fetch = async (_url, options) => { emails.push(options); return { ok: true, json: async () => ({ id: 'sent' }) }; };
  try {
    assert.equal(await deliverConfirmationReminder(), true);
    assert.equal(await deliverConfirmationReminder(), true);
    const message = JSON.parse(emails[0].body);
    assert.ok(message.text.startsWith('Здравствуйте Ольга Котц,'));
    assert.ok(message.text.includes('Повторно заполнять анкету не нужно'));
    const token = message.text.match(/confirm#([\w-]+)/)[1];
    assert.equal(calls.find(c => c.sql.includes('SET reminder_token_hash')).values[1], hashToken(token));
    assert.equal(emails[0].headers['Idempotency-Key'], emails[1].headers['Idempotency-Key']);
    assert.equal(emails[0].body, emails[1].body);
    const copy = calls.find(c => c.sql.includes('INSERT INTO mailbox_messages'));
    assert.ok(copy.sql.includes("'outbound'"));
    assert.ok(copy.sql.includes('sent_at'));
    assert.equal(copy.values[1], 'sent');
    assert.deepEqual(copy.values[3], ['applicant@example.com']);
    assert.equal(copy.values[4], message.subject);
    assert.equal(copy.values[5], message.text);
    const selection = calls.find(c => c.sql.startsWith('SELECT id')).sql;
    for (const condition of ["interval '7 hours'", 'reminder_sent_at IS NULL', 'expires_at > clock_timestamp()', 'FOR UPDATE SKIP LOCKED']) assert.ok(selection.includes(condition));
    empty = true;
    assert.equal(await deliverConfirmationReminder(), false);
    assert.equal(emails.length, 2);
    empty = false;
    const copiesBeforeFailure = calls.filter(c => c.sql.includes('INSERT INTO mailbox_messages')).length;
    global.fetch = async () => { throw new Error('delivery unavailable'); };
    await assert.rejects(deliverConfirmationReminder(), /delivery unavailable/);
    assert.equal(calls.at(-1).sql, 'ROLLBACK');
    assert.equal(calls.filter(c => c.sql.includes('INSERT INTO mailbox_messages')).length, copiesBeforeFailure);
  } finally { global.fetch = originalFetch; delete global.consultationPool; }
});
