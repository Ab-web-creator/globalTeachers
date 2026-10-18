import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

// Regenerate the editable Cyrillic catalog after updating the Latin copy or
// spelling exceptions. English keys, placeholders, links, and brands are retained.
const source = await readFile(new URL("../lib/i18n/uzbek-cyrillic.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { uzbekToCyrillic } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const messages = JSON.parse(await readFile(new URL("../lib/i18n/messages/uz.json", import.meta.url), "utf8"));
const cyrillic = Object.fromEntries(Object.entries(messages).map(([key, value]) => [key, uzbekToCyrillic(value)]));
await writeFile(new URL("../lib/i18n/messages/uz-Cyrl.json", import.meta.url), `${JSON.stringify(cyrillic, null, 2)}\n`);
console.log(`Generated ${Object.keys(cyrillic).length} Uzbek Cyrillic translations.`);
