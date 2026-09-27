/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness transpiles TypeScript for Node tests. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};

const { createToken, readToken } = require('../lib/consultation/token.ts');
const { POST: submit } = require('../app/api/consultation/route.ts');
const { POST: confirm } = require('../app/api/consultation/confirm/route.ts');
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

test('confirmation flow, tampering, expiry, validation, and delivery failures', async () => {
  process.env.CONSULTATION_TOKEN_SECRET = 'ab'.repeat(32);
  process.env.RESEND_API_KEY = 'test-only';
  process.env.CONSULTATION_EMAIL_FROM = 'noreply@example.com';
  process.env.CONSULTATION_EMAIL_TO = 'team@example.com';
  process.env.SITE_URL = 'https://example.com';
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) });
    return Response.json({ id: 'mock-email' });
  };
  try {
    assert.equal((await submit(request({ ...answers, subject: 'Custom subject' }))).status, 400);
    assert.equal(calls.length, 0);
    assert.equal((await submit(request(answers))).status, 200);
    assert.equal(calls[0].body.to, answers.email);
    assert.equal(calls.length, 1, 'team is not notified before confirmation');
    assert.equal((await submit(request(answers))).status, 429);
    const token = calls[0].body.text.match(/\/confirm#([^\s]+)/)[1];
    assert.deepEqual(readToken(token).answers, answers);
    const changed = Buffer.from(token, 'base64url');
    changed[30] ^= 1;
    assert.throws(() => readToken(changed.toString('base64url')));
    assert.equal((await confirm(request({ token: 'invalid' }))).status, 400);
    assert.equal((await confirm(request({ token }))).status, 200);
    assert.equal(calls[1].body.to, 'team@example.com');
    assert.match(calls[1].body.text, /Test Teacher/);
    assert.equal((await confirm(request({ token }))).status, 200);
    assert.equal(calls[1].headers['Idempotency-Key'], calls[2].headers['Idempotency-Key']);
    const originalNow = Date.now;
    Date.now = () => originalNow() + 25 * 60 * 60 * 1000;
    try { assert.throws(() => readToken(token)); } finally { Date.now = originalNow; }
    global.fetch = async () => new Response('', { status: 503 });
    assert.equal((await confirm(request({ token }))).status, 503);
    assert.equal((await submit(request({ ...answers, email: 'another@example.com' }))).status, 503);
    const invalidOrigin = new Request('https://example.com/api/consultation', {
      method: 'POST', headers: { origin: 'https://other.example' }, body: JSON.stringify(answers),
    });
    assert.equal((await submit(invalidOrigin)).status, 403);
    assert.ok(createToken(answers));
  } finally {
    global.fetch = originalFetch;
  }
});
