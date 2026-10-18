import ru from "./messages/ru.json";
import uz from "./messages/uz.json";
import uzCyrl from "./messages/uz-Cyrl.json";
import { formatUzbekDate } from "./date";
import { uzbekToCyrillic } from "./uzbek-cyrillic";
import type { Language } from "./languages";

export type { Language } from "./languages";
export type MessageKey = keyof typeof ru;
export type MessageValues = Record<string, string | number>;

const russian: Record<string, string> = ru;
const uzbek: Record<string, string> = uz;
const uzbekCyrillic: Record<string, string> = uzCyrl;
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const sourceKeys = new Map(Object.entries(russian).map(([key, text]) => [normalize(text), key]));
const templates = Object.entries(russian)
  .filter(([, text]) => /\{\w+\}/.test(text))
  .map(([key, text]) => {
    const names: string[] = [];
    const pattern = normalize(text).split(/(\{\w+\})/).map(part => {
      if (/^\{\w+\}$/.test(part)) {
        names.push(part.slice(1, -1));
        return "([\\s\\S]+?)";
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
    return { key, names, expression: new RegExp(`^${pattern}$`) };
  });

export function createTranslator(language: Language) {
  const messages = language === "uz-Cyrl" ? uzbekCyrillic : language === "uz" ? uzbek : russian;
  function t(key: MessageKey, values: MessageValues = {}): string {
    const text = messages[key] ?? russian[key];
    return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder));
  }

  // Shared content modules and API errors retain their original values. Translate
  // their display text here without changing submitted answers or stored records.
  function content<T>(value: T): T {
    if (typeof value === "string") {
      const key = Object.hasOwn(russian, value) ? value : sourceKeys.get(normalize(value));
      if (key) {
        const text = t(key as MessageKey);
        const leading = value.match(/^\s*/)?.[0] ?? "";
        const trailing = value.match(/\s*$/)?.[0] ?? "";
        return (leading + text.trim() + trailing) as T;
      }
      for (const template of templates) {
        const match = template.expression.exec(normalize(value));
        if (!match) continue;
        const values = Object.fromEntries(template.names.map((name, i) => [
          name, name === "field" ? content(match[i + 1]) : match[i + 1],
        ]));
        return t(template.key as MessageKey, values) as T;
      }
    }
    if (Array.isArray(value)) return value.map(item => content(item)) as T;
    return value;
  }

  const locale = language === "uz-Cyrl" ? "uz-Cyrl-UZ" : language === "uz" ? "uz-Latn-UZ" : "ru-RU";
  function formatDate(value: Date | number, options: Intl.DateTimeFormatOptions) {
    if (language !== "ru") {
      const date = formatUzbekDate(value, options);
      return language === "uz-Cyrl" ? uzbekToCyrillic(date).replace(/(\d)-(?=[а-яёўғқҳ])/g, "$1 ") : date;
    }
    return new Intl.DateTimeFormat(locale, options).format(value);
  }

  return Object.assign(t, { content, language, locale, formatDate });
}
