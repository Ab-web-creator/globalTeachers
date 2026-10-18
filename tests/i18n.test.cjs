/* eslint-disable @typescript-eslint/no-require-imports -- Match the repository's TypeScript test harness. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText,
  filename,
);
const { createTranslator } = require("../lib/i18n/translate.ts");
const { revisedUzbek, normalizeUzbekSearch } = require("../lib/i18n/uzbek-alphabet.ts");
const ru = require("../lib/i18n/messages/ru.json");
const uz = require("../lib/i18n/messages/uz.json");
const uzCyrl = require("../lib/i18n/messages/uz-Cyrl.json");
const { uzbekToCyrillic } = require("../lib/i18n/uzbek-cyrillic.ts");
const { isLanguage } = require("../lib/i18n/languages.ts");

test("all three languages have complete catalogs with English keys and matching placeholders", () => {
  assert.deepEqual(Object.keys(uz).sort(), Object.keys(ru).sort());
  assert.deepEqual(Object.keys(uzCyrl).sort(), Object.keys(ru).sort());
  for (const [key, value] of Object.entries(ru)) {
    assert.match(key, /^[a-zA-Z][a-zA-Z0-9.]*$/);
    assert.ok(uz[key].trim(), `Missing Uzbek translation: ${key}`);
    const placeholders = text => [...text.matchAll(/\{\w+\}/g)].map(match => match[0]).sort();
    assert.deepEqual(placeholders(uz[key]), placeholders(value), key);
    assert.ok(uzCyrl[key].trim(), `Missing Uzbek Cyrillic translation: ${key}`);
    assert.deepEqual(placeholders(uzCyrl[key]), placeholders(value), key);
    if (!/Русский|Кыргызча/.test(uz[key])) assert.doesNotMatch(uz[key], /[А-Яа-яЁё]/, key);
  }
});

test("Uzbek Cyrillic is a distinct persisted language with the same message keys", () => {
  const t = createTranslator("uz-Cyrl");
  assert.equal(isLanguage("uz-Cyrl"), true);
  assert.equal(isLanguage("uz-Latn"), false);
  assert.equal(isLanguage("invalid"), false);
  assert.equal(t("client.profile.save"), "Анкетани сақлаш");
  assert.equal(t("home.hero.eyebrow"), "Педагогнинг халқаро карьераси");
  assert.equal(t("notes.count", { count: 3 }), "Ҳозир сизда 3 та қайд бор");
  assert.equal(t.content("Магистр"), "Магистр");
  assert.equal(t.content("Проверьте поле «Имя»."), "«Исм» майдонини текширинг.");
});

test("Cyrillic conversion handles Uzbek letters, spelling exceptions, and protected tokens", () => {
  assert.equal(uzbekToCyrillic("Öqiş, şaxs, çiroq, ğoya"), "Ўқиш, шахс, чироқ, ғоя");
  assert.equal(uzbekToCyrillic("ta’lim, e’tibor, karyera, kompyuter"), "таълим, эътибор, карьера, компьютер");
  assert.equal(uzbekToCyrillic("TeacherNavigator, LinkedIn, CV, https://example.com/client#key, {count}"), "TeacherNavigator, LinkedIn, CV, https://example.com/client#key, {count}");
  assert.equal(uzbekToCyrillic("aytsangiz"), "айтсангиз");
  assert.equal(normalizeUzbekSearch("Ўқитувчи"), normalizeUzbekSearch("Öqituvçi"));
  assert.equal(normalizeUzbekSearch("Ҳуқуқ"), normalizeUzbekSearch("Huquq"));
  const record = { firstName: "Şuxrat", message: "Yangi xabar" };
  assert.equal(createTranslator("uz-Cyrl").content(record), record);
});

test("Uzbek Cyrillic dates are deterministic and use Cyrillic month and weekday names", () => {
  const t = createTranslator("uz-Cyrl");
  const date = new Date("2026-10-18T12:00:00Z");
  assert.equal(t.formatDate(date, { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }), "18 октябрь 2026, 12:00");
  assert.equal(t.formatDate(date, { weekday: "long", timeZone: "UTC" }), "якшанба");
  assert.equal(t.formatDate(date, { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" }), "17:00");
});

test("keys translate and switching back restores original Russian copy", () => {
  assert.equal(createTranslator("uz")("client.profile.save"), "Anketani saqlaş");
  assert.equal(createTranslator("ru")("client.profile.save"), "Сохранить анкету");
  assert.equal(createTranslator("uz").content("client.profile.save"), "Anketani saqlaş");
});

test("canonical form choices and API errors translate only at display time", () => {
  const t = createTranslator("uz");
  const answers = { education: "Магистр", firstName: "Шухрат", goals: "Сохранить" };
  assert.equal(t.content(answers.education), "Magistr");
  assert.equal(t.content("Укажите ваше имя."), "Ismingizni kiriting.");
  assert.equal(t.content("Проверьте поле «Имя»."), "«Ism» maydonini tekşiring.");
  assert.equal(t.content(answers), answers);
  assert.equal(answers.education, "Магистр");
  assert.equal(answers.firstName, "Шухрат");
  assert.equal(t.content("https://example.com/client#abc"), "https://example.com/client#abc");
});

test("interpolation keeps dynamic values and English product names intact", () => {
  const t = createTranslator("uz");
  assert.equal(t.content("Новых сообщений: 12"), "Yangi xabarlar: 12");
  assert.equal(t.content("Стоимость VIP"), "VIP narxi");
  assert.ok(Object.values(uz).some(value => value.includes("TeacherNavigator")));
  assert.equal(t("notes.count", { count: 3 }), "Hozir sizda 3 ta qayd bor");
});

test("Uzbek system text uses revised letters and search accepts both alphabets", () => {
  assert.equal(revisedUzbek("O‘qish, shaxs, chiroq, g‘oya"), "Öqiş, şaxs, çiroq, ğoya");
  assert.equal(normalizeUzbekSearch("O‘qituvchi"), normalizeUzbekSearch("Öqituvçi"));
  assert.equal(normalizeUzbekSearch("gʻoya"), normalizeUzbekSearch("ğoya"));
  assert.match(createTranslator("uz").formatDate(new Date("2026-10-18T12:00:00Z"), { weekday: "long", timeZone: "UTC" }), /ş/);
});

test("Uzbek dates use consistent month names without relying on browser locale data", () => {
  const t = createTranslator("uz");
  const date = new Date("2026-10-18T12:00:00Z");
  assert.equal(t.formatDate(date, { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }), "18-oktabr 2026, 12:00");
  assert.equal(t.formatDate(date, { dateStyle: "short", timeZone: "UTC" }), "18.10.2026");
  assert.equal(t.formatDate(date, { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" }), "17:00");
});
