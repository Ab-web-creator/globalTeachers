/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};
const { validPassword, validSession, createSession } = require('../lib/admin/session.ts');
const { POST: login } = require('../app/admin/login/route.ts');
const { POST: logout } = require('../app/admin/logout/route.ts');

test('admin sessions reject missing configuration, tampering, expiry and rotated credentials', () => {
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(validPassword(''), false);
  assert.equal(validSession('anything'), false);
  assert.throws(createSession);
  process.env.ADMIN_PASSWORD = 'test-password-with-sufficient-length';
  process.env.ADMIN_SESSION_SECRET = 'a'.repeat(64);
  assert.equal(validPassword('wrong-password'), false);
  assert.equal(validPassword(process.env.ADMIN_PASSWORD), true);
  const token = createSession();
  assert.equal(validSession(token), true);
  assert.equal(validSession(token + 'a'), false);
  assert.equal(validSession(), false);
  const originalNow = Date.now;
  Date.now = () => originalNow() + 9 * 60 * 60 * 1000;
  try { assert.equal(validSession(token), false); } finally { Date.now = originalNow; }
  process.env.ADMIN_PASSWORD = 'changed-password-with-sufficient-length';
  assert.equal(validSession(token), false);
});

test('login and logout enforce origin and set protected scoped cookies', async () => {
  process.env.ADMIN_PASSWORD = 'test-password-with-sufficient-length';
  process.env.ADMIN_SESSION_SECRET = 'a'.repeat(64);
  const req = (password, origin = 'https://example.com') => new Request('https://example.com/admin/login', {
    method: 'POST', headers: { origin }, body: new URLSearchParams({ password }),
  });
  assert.equal((await login(req(process.env.ADMIN_PASSWORD, 'https://attacker.example'))).status, 403);
  const wrong = await login(req('wrong'));
  assert.equal(wrong.headers.get('set-cookie'), null);
  assert.match(wrong.headers.get('location'), /error=login/);
  const good = await login(req(process.env.ADMIN_PASSWORD));
  assert.equal(good.status, 303);
  assert.match(good.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(good.headers.get('set-cookie'), /SameSite=strict/i);
  assert.match(good.headers.get('set-cookie'), /Path=\/admin/i);
  assert.equal(good.headers.get('cache-control'), 'no-store');
  const exited = await logout(req(''));
  assert.match(exited.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal((await logout(req('', 'https://attacker.example'))).status, 403);
});

test('local host aliases work without allowing cross-site login; redirects keep the browser host', async () => {
  const { trustedRequestOrigin } = require('../lib/request-origin.ts');
  const environment = process.env.NODE_ENV;
  const site = process.env.SITE_URL;
  try {
    process.env.NODE_ENV = 'development';
    const request = new Request('http://localhost:3000/admin/login', {
      method: 'POST', headers: { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000' },
      body: new URLSearchParams({ password: process.env.ADMIN_PASSWORD }),
    });
    assert.equal(trustedRequestOrigin(request), 'http://127.0.0.1:3000');
    const result = await login(request);
    assert.equal(result.status, 303);
    assert.equal(result.headers.get('location'), 'http://127.0.0.1:3000/admin');
    assert.equal(trustedRequestOrigin(new Request('http://localhost:3000/admin/login', {
      headers: { host: '127.0.0.1:3000', origin: 'https://attacker.example' },
    })), null);
    assert.equal(trustedRequestOrigin(new Request('http://localhost:3000/admin/login')), null);
    process.env.NODE_ENV = 'production';
    process.env.SITE_URL = 'https://globalteacherhub.com';
    assert.equal(trustedRequestOrigin(new Request('http://localhost:3000/admin/login', {
      headers: { origin: 'https://globalteacherhub.com' },
    })), 'https://globalteacherhub.com');
    assert.equal(trustedRequestOrigin(new Request('http://localhost:3000/admin/login', {
      headers: { origin: 'https://attacker.example', host: 'attacker.example' },
    })), null);
  } finally {
    if (environment === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = environment;
    if (site === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = site;
  }
});
