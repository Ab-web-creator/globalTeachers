import { readFile, writeFile } from "node:fs/promises";

// Cyrillic is the editorial source for this conversion. Use the site's existing
// Latin alphabet (ö, ğ, ş, ç); never transliterate user-supplied content.
const letters = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ч: "ç", ш: "ş",
  щ: "şç", э: "e", ю: "yu", я: "ya", ў: "ö", қ: "q", ғ: "ğ", ҳ: "h",
  ъ: "’", ь: "", ы: "i", є: "ye", і: "i",
};
function latinWord(word) {
  const lower = word.toLowerCase();
  const allCaps = word === word.toUpperCase();
  return [...word].map((letter, index) => {
    const character = letter.toLowerCase();
    const previous = lower.slice(0, index).replace(/\u00ad/g, "").slice(-1);
    let result;
    if (character === "е") {
      result = !previous || /[аеиоуўэёюяъь]/.test(previous) ? "ye" : "e";
    } else if (character === "ц") {
      result = previous && !/[аеиоуўэёюя]/.test(previous) ? "s" : "ts";
    } else {
      result = letters[character] ?? letter;
    }
    if (allCaps) return result.toUpperCase();
    return letter !== character ? result.charAt(0).toUpperCase() + result.slice(1) : result;
  }).join("");
}
const source = JSON.parse(await readFile(new URL("../lib/i18n/messages/uz-Cyrl.json", import.meta.url), "utf8"));
const preservedLabels = new Set(["home.menuLanguages.message0438", "home.menuLanguages.message0439"]);
// Match Cyrillic words only: Latin brands, URLs, interpolation tokens, punctuation,
// paragraph breaks, and Markdown emphasis pass through unchanged.
const latin = Object.fromEntries(Object.entries(source).map(([key, value]) => [
  key, preservedLabels.has(key) ? value : value.replace(/[\p{Script=Cyrillic}\u00ad]+/gu, latinWord),
]));
await writeFile(new URL("../lib/i18n/messages/uz.json", import.meta.url), `${JSON.stringify(latin, null, 2)}\n`);
console.log(`Generated ${Object.keys(latin).length} Latin Uzbek translations from the Cyrillic catalog.`);
