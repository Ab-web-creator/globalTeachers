export type SubjectNoticeKind = "early-education" | "languages" | "mixed";

export const earlyEducationSubjects = new Set([
  "Начальная школа",
  "Дошкольное образование",
  "Английский язык и литература",
]);
export const languageSubjects = new Set([
  "Современные языки",
  "Узбекский язык",
  "Русский язык",
  "Казахский язык",
  "Таджикский язык",
  "Туркменский язык",
  "Кыргызский язык",
]);

export function getSubjectNotice(selected: readonly string[]): SubjectNoticeKind | null {
  if (!selected.length || selected.some((subject) => !earlyEducationSubjects.has(subject) && !languageSubjects.has(subject))) return null;
  const earlyEducation = selected.some((subject) => earlyEducationSubjects.has(subject));
  const languages = selected.some((subject) => languageSubjects.has(subject));
  return earlyEducation && languages ? "mixed" : earlyEducation ? "early-education" : "languages";
}

export const subjectNotices = {
  "early-education": {
    title: "Трудоустройство по выбранному направлению может быть затруднено.",
    reason: "Многие международные школы отдают предпочтение носителям английского языка или педагогам с образованием, полученным в Великобритании, США и других англоязычных странах. Это связано с высокими требованиями к языковой подготовке и преподаванию на ранних этапах развития ребёнка.",
    exclusion: "Поэтому мы не предоставляем услуги сопровождения кандидатам по данным направлениям.",
    recommendStart: false,
  },
  languages: {
    title: "Вакансии по выбранному направлению крайне ограничены.",
    reason: "Русский, узбекский, казахский и другие национальные языки редко входят в основные учебные программы международных школ.",
    exclusion: "Поэтому мы не предоставляем услуги сопровождения при трудоустройстве по данным направлениям.",
    recommendStart: true,
  },
  mixed: {
    title: "Трудоустройство по выбранным направлениям может быть затруднено.",
    reason: "Для дошкольного образования, начальной школы и преподавания английского многие международные школы предпочитают носителей английского языка или педагогов с образованием из англоязычных стран. Вакансии для преподавателей других национальных языков крайне ограничены.",
    exclusion: "Поэтому мы не предоставляем услуги сопровождения при трудоустройстве по выбранным направлениям.",
    recommendStart: true,
  },
} satisfies Record<SubjectNoticeKind, { title: string; reason: string; exclusion: string; recommendStart: boolean }>;
