// Use only for Uzbek system text (for example Intl date output), never for
// names, messages, uploaded files, URLs, or other content supplied by users.
export function revisedUzbek(text: string): string {
  return text
    .replace(/O[‘ʻ’']/g, "Ö").replace(/o[‘ʻ’']/g, "ö")
    .replace(/G[‘ʻ’']/g, "Ğ").replace(/g[‘ʻ’']/g, "ğ")
    .replace(/SH/g, "Ş").replace(/Sh/g, "Ş").replace(/sh/g, "ş")
    .replace(/CH/g, "Ç").replace(/Ch/g, "Ç").replace(/ch/g, "ç");
}

// Accept both spellings in search while displaying the revised alphabet.
export function normalizeUzbekSearch(text: string): string {
  const cyrillic: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "ç", ш: "ş", щ: "şç",
    э: "e", ю: "yu", я: "ya", ў: "ö", қ: "q", ғ: "ğ", ҳ: "h", ъ: "", ь: "",
  };
  const latin = text.toLocaleLowerCase("uz").replace(/[а-яёўқғҳ]/g, letter => cyrillic[letter] ?? letter);
  return revisedUzbek(latin).normalize("NFKD")
    .replace(/\p{M}/gu, "").replace(/[‘ʻ’ʼ']/g, "").trim();
}
