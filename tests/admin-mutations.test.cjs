/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { NextRequest } = require('next/server');
const { POST: remove } = require('../app/admin/delete/route.ts');
const { POST: edit } = require('../app/admin/edit/route.ts');
const { createSession } = require('../lib/admin/session.ts');
const { subjects } = require('../app/consultation/components/subjects.ts');

test('admin mutations authorize, validate and target only the chosen record', async () => {
  const savedEnv = { ...process.env };
  const savedPool = global.consultationPool;
  const calls = [];
  let rowCount = 1;
  let failure;
  try {
    process.env.NODE_ENV = 'production';
    process.env.SITE_URL = 'https://example.com';
    process.env.ADMIN_PASSWORD = 'test-password-with-sufficient-length';
    process.env.ADMIN_SESSION_SECRET = 'a'.repeat(64);
    process.env.DATABASE_URL = 'test-only';
    global.consultationPool = { query: async (sql, values) => {
      calls.push({ sql, values });
      if (failure) throw failure;
      return { rowCount };
    } };
    const token = createSession();
    const id = '11111111-1111-4111-8111-111111111111';
    const answers = { name: 'Test Teacher', email: 'test@example.com', country: 'Test', contact: '', subject: subjects[0], experience: '2–5 лет', education: 'Магистр', qualification: 'Да', international: 'Нет', english: 'Свободный', priority: 'Найти вакансии', destinations: 'Азия', timing: 'Как можно скорее', goals: '' };
    const body = { id, status: 'pending', answers, originalAnswers: answers };
    const request = (body, cookie = token, origin = 'https://example.com') => new NextRequest('https://example.com/admin/edit', {
      method: 'POST', headers: { origin, cookie: cookie ? `gth_admin=${cookie}` : '' }, body: JSON.stringify(body),
    });
    for (const handler of [edit, remove]) {
      assert.equal((await handler(request(body, ''))).status, 401);
      assert.equal((await handler(request(body, token, 'https://attacker.example'))).status, 403);
      assert.equal((await handler(request({ ...body, id: 'invalid' }))).status, 400);
      assert.equal((await handler(request({ ...body, status: 'anything' }))).status, 400);
    }
    assert.equal((await edit(request({ ...body, answers: { ...answers, email: 'invalid' } }))).status, 400);
    assert.equal(calls.length, 0);
    assert.equal((await remove(request(body))).status, 204);
    assert.equal(calls.at(-1).sql, 'DELETE FROM consultation_pending WHERE id = $1');
    assert.deepEqual(calls.at(-1).values, [id]);
    assert.equal((await remove(request({ ...body, status: 'confirmed' }))).status, 204);
    assert.equal(calls.at(-1).sql, 'DELETE FROM consultation_applications WHERE id = $1');
    assert.equal((await edit(request({ ...body, answers: { ...answers, name: "Updated O'Connor" } }))).status, 204);
    assert.match(calls.at(-1).sql, /UPDATE consultation_pending.*WHERE id = \$3 AND answers = \$4::jsonb/);
    assert.equal(JSON.parse(calls.at(-1).values[1]).name, "Updated O'Connor");
    assert.equal(calls.at(-1).values[2], id);
    assert.deepEqual(JSON.parse(calls.at(-1).values[3]), answers);
    assert.equal((await edit(request({ ...body, status: 'confirmed' }))).status, 204);
    assert.match(calls.at(-1).sql, /UPDATE consultation_applications/);
    rowCount = 0;
    assert.equal((await remove(request(body))).status, 404);
    assert.equal((await edit(request(body))).status, 409);
    failure = { code: '23505' };
    assert.equal((await edit(request(body))).status, 409);
    failure = new Error('database unavailable');
    assert.equal((await edit(request(body))).status, 503);
    assert.equal((await remove(request(body))).status, 503);
    failure = undefined;
    rowCount = 1;
    process.env.NODE_ENV = 'development';
    assert.equal((await edit(request(body, ''))).status, 204);
    assert.equal((await remove(request(body, ''))).status, 204);
  } finally {
    global.consultationPool = savedPool;
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
  }
});
