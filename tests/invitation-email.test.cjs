/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
const { hashToken } = require("../lib/consultation/token.ts");
const {
  invitationAccessLink,
  invitationEmailHtml,
} = require("../lib/client-area/invitation-email.ts");
const key = "a".repeat(43);
const body = `Здравствуйте, <script>alert(1)</script>!\n\nВаш ключ:\nhttps://example.com/client#${key}\n\nСохраните письмо.`;

test("invitation email escapes edited content and provides a real access button and readable link", () => {
  const html = invitationEmailHtml(body, hashToken(key), "https://example.com");
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.equal(/<script|onclick=/i.test(html), false);
  assert.ok(html.includes(`href="https://example.com/client#${key}"`));
  assert.ok(html.includes("Открыть личную страницу"));
  assert.ok(html.includes("«Скопировать ключ»"));
});

test("only the key matching this client can be copied and it uses the current site origin", () => {
  const fake = `https://untrusted.example/client#${"b".repeat(43)}`;
  assert.equal(
    invitationAccessLink(
      fake + "\n" + body,
      hashToken(key),
      "https://new.example",
    ),
    `https://new.example/client#${key}`,
  );
  assert.throws(
    () => invitationAccessLink(fake, hashToken(key), "https://example.com"),
    /не найдена/,
  );
});
