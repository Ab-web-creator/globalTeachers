import type { ReactNode } from "react";

const accents: Record<string, string[]> = {
  "Оценка вашего опыта и выявление сильных сторон": ["сильных сторон"],
  "Разбор вопросов о работе в международных школах": ["работе"],
  "Предоставление пошагового чек-листа по поиску работы": ["пошагового"],
  "Ответы на вопросы в течение 7 дней": ["7 дней"],
  "Подготовка профессионального CV для международных школ": ["профессионального CV"],
  "Оформление портфолио с вашим опытом и достижениями": ["вашим опытом", "достижениями"],
  "Подготовка к собеседованиям в международных школах": ["к собеседованиям"],
  "Поддержка и ответы на вопросы в течение 30 дней": ["30 дней"],
  "Разработка индивидуальной стратегии поиска работы": ["индивидуальной стратегии"],
  "Сопровождение на каждом этапе поиска работы": ["на каждом этапе"],
  "Поддержка до получения оффера от школы": ["до получения"],
  "Подготовка к уверенному представлению себя международным школам": ["уверенному"],
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
