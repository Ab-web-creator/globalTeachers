import type { ReactNode } from "react";

const accents: Record<string, string[]> = {
  "Оценим ваш опыт и выделим сильные стороны": ["сильные стороны"],
  "Разберём вопросы о работе в международных школах": ["работе"],
  "Дадим пошаговый чек-лист поиска работы": ["пошаговый"],
  "Ответим на вопросы в течение 7 дней": ["7 дней"],
  "Подготовим профессиональное CV для школ": ["профессиональное CV"],
  "Представим ваш опыт и достижения в портфолио": ["ваш опыт", "достижения"],
  "Подготовим к собеседованиям в школах": ["к собеседованиям"],
  "Поддержка и ответы на вопросы — 30 дней": ["30 дней"],
  "Разработаем стратегию поиска под ваши цели": ["стратегию поиска"],
  "Сопроводим на каждом этапе поиска": ["на каждом этапе"],
  "Поддержим до получения оффера от школы": ["до получения"],
  "Поможем уверенно представить себя школам": ["уверенно"],
};

export default function FeatureText({ text }: { text: string }) {
  const phrases = accents[text];
  if (!phrases) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const phrase of phrases) {
    const index = text.indexOf(phrase, cursor);
    if (index === -1) continue;
    parts.push(text.slice(cursor, index));
    parts.push(<strong key={index} className="font-semibold">{phrase}</strong>);
    cursor = index + phrase.length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
