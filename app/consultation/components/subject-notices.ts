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

type SubjectNotice = {
  title: string;
  reason: { lead?: string; text: string }[];
  exclusion: string;
  recommendation: string;
  recommendStart: boolean;
};

const recommendation = "Рекомендуем рассмотреть другие предметы преподавания, если ваша квалификация позволяет это сделать.";
const exclusion = "Поэтому TeacherNavigator не предоставляет сопровождение по выбранному направлению.";

export const subjectNotices: Record<SubjectNoticeKind, SubjectNotice> = {
  "early-education": {
    title: "Важная информация",
    reason: [
      { text: "Многие международные школы предъявляют повышенные требования к преподавателям дошкольного и начального образования, а также английского языка." },
      { text: "Часто предпочтение отдаётся носителям английского языка или кандидатам с педагогической квалификацией, полученной в англоязычных странах." },
    ],
    exclusion,
    recommendation,
    recommendStart: false,
  },
  languages: {
    title: "Важная информация",
    reason: [
      { text: "Русский, узбекский, казахский и другие национальные языки, как правило, не входят в стандартные учебные программы большинства международных школ." },
      { text: "Вакансии преподавателей этих языков встречаются крайне редко." },
    ],
    exclusion,
    recommendation,
    recommendStart: false,
  },
  mixed: {
    title: "Важная информация",
    reason: [
      { text: "Выбранные вами направления имеют определённые ограничения при поиске работы в международных школах." },
      {
        lead: "Дошкольное, начальное образование и английский язык:",
        text: "многие международные школы предъявляют повышенные требования к уровню английского языка и педагогической квалификации, часто отдавая предпочтение носителям языка или кандидатам с образованием из англоязычных стран.",
      },
      {
        lead: "Русский, узбекский, казахский и другие национальные языки:",
        text: "как правило, не входят в стандартные учебные программы большинства международных школ, поэтому соответствующие вакансии встречаются крайне редко.",
      },
    ],
    exclusion: "Поэтому TeacherNavigator не предоставляет сопровождение по выбранным направлениям.",
    recommendation,
    recommendStart: false,
  },
};
