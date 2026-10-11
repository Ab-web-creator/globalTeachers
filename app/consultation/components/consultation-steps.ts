import type { Answers } from "./form-fields";

type ConsultationStep = {
  title: string;
  description: string;
  fields: readonly [keyof Answers];
};

export const consultationSteps = [
  { title: "Как вас зовут?", description: "Для начала давайте познакомимся. Как к вам обращаться?", fields: ["name"] },
  { title: "Где вы живёте?", description: "Укажите страну вашего текущего проживания. Ваши данные используются только для рассмотрения заявки и связи с вами.", fields: ["country"] },
  { title: "Ваш email", description: "После ввода email ваши ответы автоматически сохраняются, даже если вы не завершите форму. При отправке заявки мы пришлём ссылку для подтверждения email.", fields: ["email"] },
  { title: "Педагогическая квалификация", description: "Укажите, есть ли у вас BEd/MEd или QTS, PGCE. Если этих квалификаций нет, выберите «Нет».", fields: ["qualification"] },
  { title: "Ваш предмет", description: "Выберите предметы, которые соответствуют вашему опыту преподавания.", fields: ["subject"] },
  { title: "Ваше образование", description: "Выберите ваш самый высокий уровень образования.", fields: ["education"] },
  { title: "Ваш английский", description: "Выберите описание, которое ближе всего к вашему уровню. Это поможет нам понять, какие вакансии вам подойдут и нужна ли языковая подготовка.", fields: ["english"] },
  { title: "Хотите выбрать программу?", description: "Если вы уже присмотрели одну из наших программ — Start, Pro или VIP — можете указать её здесь. Выбирать сейчас необязательно: мы можем обсудить подходящий вариант на консультации.", fields: ["packagePreference"] },
] as const satisfies readonly ConsultationStep[];
