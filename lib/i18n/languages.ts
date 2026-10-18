export const languageCodes = ["ru", "uz", "uz-Cyrl"] as const;
export type Language = typeof languageCodes[number];

export function isLanguage(value: unknown): value is Language {
  return languageCodes.some(language => language === value);
}
