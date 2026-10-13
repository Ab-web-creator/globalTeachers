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
