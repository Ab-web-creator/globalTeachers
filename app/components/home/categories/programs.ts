const startServices = [
  "Оценка вашего опыта и выявление сильных сторон",
  "Разбор вопросов о работе в международных школах",
  "Предоставление пошагового чек-листа по поиску работы",
];
const proServices = [
  "Подготовка профессионального CV для международных школ",
  "Оформление портфолио с вашим опытом и достижениями",
  "Поможем оформить профиль в LinkedIn",
  "Подготовка к собеседованиям в международных школах",
  "Поможем подготовить отклики на вакансии",
];

export const programs = [
  {
    tier: "START", title: "Начните правильно", image: "/images/startPackage.webp",
    price: 99,
    alt: "Педагог планирует международную карьеру за ноутбуком",
    description: "Для самостоятельного поиска работы с понятным планом и без типичных ошибок.",
    inclusionLabel: "В программу входит:",
    inheritedServices: [] as string[],
    supportSummary: "Поддержка в течение 7 дней.",
    features: [...startServices, "Ответы на вопросы в течение 7 дней"],
    icons: ["profile", "chat", "document", "support"],
  },
  {
    tier: "PRO", title: "Увеличьте свои шансы", image: "/images/proPackage.webp",
    price: 299,
    alt: "Специалист за рабочим столом",
    description: "Подготовка к поиску: CV, портфолио, LinkedIn, интервью и отклики.",
    inclusionLabel: "Всё из START, плюс:",
    inheritedServices: startServices,
    supportSummary: "Поддержка расширена с 7 до 30 дней.",
    features: [proServices[0], proServices[1], proServices[3], "Поддержка и ответы на вопросы в течение 30 дней"],
    icons: ["document", "folder", "profile", "support"],
  },
  {
    tier: "VIP", title: "Полное Сопровождение ", image: "/images/VIPpackage.webp",
    price: null,
    alt: "Портрет специалиста",
    description: "Личное сопровождение от стратегии до оффера международной школы.",
    inclusionLabel: "Всё из START и PRO, плюс:",
    inheritedServices: [...startServices, ...proServices],
    supportSummary: "Вместо 30 дней — поддержка до оффера.",
    features: [
      "Разработка индивидуальной стратегии поиска работы",
      "Сопровождение на каждом этапе поиска работы",
      "Поддержка до получения оффера от школы",
      "Подготовка к уверенному представлению себя международным школам",
    ],
    icons: ["target", "profile", "document", "star"],
  },
];

export type Program = (typeof programs)[number];
