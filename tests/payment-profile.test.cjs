/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { POST } = require('../app/api/payment/profile/route.ts');
const { paymentSubjects, filterPaymentSubjects } = require('../lib/payment/subjects.ts');
const { subjects } = require('../app/consultation/components/subjects.ts');
const { earlyEducationSubjects, languageSubjects } = require('../app/consultation/components/subject-notices.ts');

function request(body, origin = 'https://example.com') {
  return new Request('https://example.com/api/payment/profile', {
    method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}

test('payment subjects exclude groups A and B, including saved mixed selections', () => {
  assert.deepEqual(paymentSubjects, subjects.filter((subject) => !earlyEducationSubjects.has(subject) && !languageSubjects.has(subject)));
  assert.equal(filterPaymentSubjects('Начальная школа; Математика; Русский язык'), 'Математика');
  assert.equal(filterPaymentSubjects('Начальная школа; Кыргызский язык'), '');
});

test('profile data is returned only after a correct, unexpired, unused code', async () => {
  const savedPool = global.consultationPool;
  const savedEnv = { ...process.env };
  const savedFetch = global.fetch;
  let record, deliveredCode, reads = 0, throttled = false, missing = false;
  let excludedDraft;
  Object.assign(process.env, { DATABASE_URL: 'test', SITE_URL: 'https://example.com', RESEND_API_KEY: 'test', CONSULTATION_EMAIL_FROM: 'info@example.com', CONSULTATION_EMAIL_TO: 'admin@example.com' });
  global.fetch = async (url, init) => {
    assert.equal(url, 'https://api.resend.com/emails');
    const email = JSON.parse(init.body);
    deliveredCode = email.text.match(/код подтверждения: (\d{6})/)[1];
    assert.equal(email.to, 'teacher@example.com');
    assert.equal(email.text.includes('Анна'), false);
    return Response.json({ id: 'email-id' });
  };
  global.consultationPool = { query: async (sql, params) => {
    if (sql.startsWith('SELECT 1')) {
      assert.deepEqual(params, ['teacher@example.com']);
      return { rowCount: missing ? 0 : 1, rows: missing ? [] : [{}] };
    }
    if (sql.includes('INSERT INTO payment_profile_verifications')) {
      assert.match(sql, /requests < 5/);
      assert.match(sql, /interval '1 minute'/);
      assert.match(sql, /interval '10 minutes'/);
      if (throttled) return { rowCount: 0, rows: [] };
      record = { email: params[0], challenge: params[1], code_hash: params[2], attempts: 0, consumed: false, expired: false };
      return { rowCount: 1, rows: [{ challenge: params[1] }] };
    }
    if (sql.includes('SET attempts = attempts + 1')) {
      assert.match(sql, /consumed_at IS NULL AND expires_at > now\(\) AND attempts < 5/);
      if (!record || params[0] !== record.challenge || record.consumed || record.expired || record.attempts >= 5) return { rowCount: 0, rows: [] };
      record.attempts++;
      return { rowCount: 1, rows: [{ code_hash: record.code_hash }] };
    }
    if (sql.includes('SET consumed_at = now()')) {
      assert.match(sql, /consumed_at IS NULL/);
      if (record.consumed) return { rowCount: 0, rows: [] };
      record.consumed = true;
      return { rowCount: 1, rows: [{ email: record.email }] };
    }
    reads++;
    assert.deepEqual(params, excludedDraft ? ['teacher@example.com', excludedDraft] : ['teacher@example.com']);
    if (excludedDraft) assert.match(sql, /AND a.id <> \$2/);
    assert.match(sql, /COALESCE\(p.answers, c.answers, a.answers\)/);
    assert.match(sql, /ORDER BY a.submitted_at DESC/);
    return missing ? { rowCount: 0, rows: [] } : { rowCount: 1, rows: [{ answers: { name: 'Анна', subject: 'Математика; Начальная школа; Кыргызский язык', education: 'Магистр', english: 'Уверенный — могу работать на английском', contact: 'private' } }] };
  } };
  const send = async () => {
    const response = await POST(request({ action: 'request', email: ' Teacher@Example.com ' }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.deepEqual(Object.keys(body), ['challenge']);
    return body.challenge;
  };
  const verify = (challenge, code) => POST(request({ action: 'verify', challenge, code }));
  try {
    assert.equal((await POST(request({ action: 'request', email: 'teacher@example.com' }, 'https://other.example'))).status, 403);
    for (const body of [null, {}, { email: 'teacher@example.com' }, { action: 'request', email: 'invalid' }, { action: 'verify', challenge: 'bad', code: '123456' }]) assert.equal((await POST(request(body))).status, 400);
    assert.deepEqual(await (await POST(request({ action: 'check', email: 'teacher@example.com' }))).json(), { exists: true });
    assert.equal(reads, 0);
    missing = true;
    assert.deepEqual(await (await POST(request({ action: 'check', email: 'teacher@example.com' }))).json(), { exists: false });
    assert.deepEqual(await (await POST(request({ action: 'request', email: 'teacher@example.com' }))).json(), { exists: false });
    assert.equal(record, undefined);
    assert.equal(deliveredCode, undefined);
    missing = false;
    const challenge = await send();
    assert.equal(reads, 0);
    assert.notEqual(record.code_hash, deliveredCode);
    const wrong = deliveredCode === '123456' ? '654321' : '123456';
    assert.equal((await verify(challenge, wrong)).status, 400);
    assert.equal(reads, 0);
    const confirmed = await verify(challenge, deliveredCode);
    const { profile } = await confirmed.json();
    assert.equal(confirmed.status, 200);
    assert.deepEqual(Object.keys(profile).sort(), ['education', 'english', 'name', 'subject']);
    assert.equal(profile.subject, 'Математика');
    assert.equal(profile.name, 'Анна');
    assert.equal((await verify(challenge, deliveredCode)).status, 400);
    const exhausted = await send();
    for (let i = 0; i < 5; i++) assert.equal((await verify(exhausted, deliveredCode === '123456' ? '654321' : '123456')).status, 400);
    assert.equal((await verify(exhausted, deliveredCode)).status, 400);
    const expired = await send();
    record.expired = true;
    assert.equal((await verify(expired, deliveredCode)).status, 400);
    assert.equal(reads, 1);
    const withDraft = await send();
    excludedDraft = '11111111-1111-4111-8111-111111111111';
    const restored = await POST(request({ action: 'verify', challenge: withDraft, code: deliveredCode, excludeDraftId: excludedDraft }));
    assert.equal(restored.status, 200);
    assert.equal((await restored.json()).profile.name, 'Анна');
    excludedDraft = undefined;
    const unknown = await send();
    missing = true;
    assert.deepEqual(await (await verify(unknown, deliveredCode)).json(), { profile: null });
    missing = false;
    throttled = true;
    assert.equal((await POST(request({ action: 'request', email: 'teacher@example.com' }))).status, 429);
  } finally {
    global.consultationPool = savedPool;
    global.fetch = savedFetch;
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
  }
});
