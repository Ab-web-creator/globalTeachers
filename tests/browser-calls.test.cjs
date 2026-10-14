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
const { NextRequest } = require('next/server');
const { GET, POST } = require('../app/api/calls/route.ts');
const { tokenHash, iceServers } = require('../lib/calls/server.ts');

test('calling API rejects unauthenticated administrators and cross-origin mutations before database access', async () => {
  const saved = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    assert.equal((await GET(new NextRequest('https://example.com/api/calls?incoming=1'))).status, 401);
    assert.equal((await GET(new NextRequest('https://example.com/api/calls?id=invalid'))).status, 401);
    assert.equal((await POST(new NextRequest('https://example.com/api/calls', {method:'POST', body:'{}'}))).status, 403);
  } finally { process.env.NODE_ENV = saved; }
});

test('private tokens are hashed and TURN secrets are exchanged for temporary credentials', () => {
  const saved = {...process.env};
  try {
    const token = 'a'.repeat(64);
    assert.notEqual(tokenHash(token), token);
    assert.equal(tokenHash(token).length, 64);
    process.env.CALL_TURN_URL = 'turn:relay.example.com:3478,turns:relay.example.com:5349';
    process.env.CALL_TURN_SECRET = 'private-test-secret';
    const servers = iceServers();
    assert.equal(servers.length, 2);
    assert.equal(servers[1].urls.length, 2);
    assert.notEqual(servers[1].credential, process.env.CALL_TURN_SECRET);
    const expiration = Number(servers[1].username.split(':')[0]);
    assert.ok(expiration > Date.now()/1000);
    assert.ok(expiration < Date.now()/1000 + 3601);
  } finally {
    for (const key of ['CALL_TURN_URL','CALL_TURN_SECRET']) {
      if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
    }
  }
});

test('saved invitations are admin-only and list recoverable and legacy links for the selected user', async () => {
  const dbModule = require('../lib/consultation/database.ts');
  const applications = require('../lib/admin/applications.ts');
  const savedDatabase = dbModule.database;
  const savedApplication = applications.getApplication;
  const savedEnvironment = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    assert.equal((await GET(new NextRequest('https://example.com/api/calls?applicationId=user'))).status, 401);
    process.env.NODE_ENV = 'development';
    applications.getApplication = async (id) => id === 'user' ? { email: 'user@example.com' } : null;
    dbModule.database = () => ({ query: async (sql, params) => {
      assert.deepEqual(params, ['user@example.com']);
      assert.match(sql, /expires_at>now\(\)/);
      assert.match(sql, /state<>'revoked'/);
      assert.match(sql, /lower\(email\)=lower\(\$1\)/);
      return { rows: [
        { id: 'new', invitation_token: 'private-token', email: 'user@example.com', expires_at: '2026-12-01T00:00:00Z' },
        { id: 'legacy', invitation_token: null, email: 'user@example.com', expires_at: '2026-12-01T00:00:00Z' },
      ] };
    } });
    const response = await GET(new NextRequest('https://example.com/api/calls?applicationId=user'));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const invitations = await response.json();
    assert.equal(invitations[0].url, '/call/private-token');
    assert.equal(invitations[1].url, null);
    assert.equal('invitation_token' in invitations[0], false);
    assert.equal((await GET(new NextRequest('https://example.com/api/calls?applicationId=missing'))).status, 404);
  } finally {
    dbModule.database = savedDatabase;
    applications.getApplication = savedApplication;
    process.env.NODE_ENV = savedEnvironment;
  }
});
