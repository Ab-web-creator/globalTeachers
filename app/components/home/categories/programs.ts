export const programs = [
  {
    tier: "START", title: "Начните правильно", image: "/images/startPackage.jpeg",
    alt: "Педагог планирует международную карьеру за ноутбуком",
    description: "Для педагогов, которые готовы искать работу самостоятельно, но хотят понимать, с чего начать и как избежать типичных ошибок.",
    features: ["Анализ профиля", "Консультация", "Чек-лист", "7 дней поддержки"],
    icons: ["profile", "chat", "document", "support"],
  },
  {
    tier: "PRO", title: "Увеличьте свои шансы", image: "/images/proPackage.jpeg",
    alt: "Специалист за рабочим столом",
    description: "Комплексная подготовка к поиску работы: профессиональное CV, портфолио, LinkedIn, подготовка к интервью и помощь с откликами.",
    features: ["CV", "Портфолио", "Интервью", "30 дней поддержки"],
    icons: ["document", "folder", "profile", "support"],
  },
  {
    tier: "VIP", title: "Сопровождение до оффера", image: "/images/VIPpackage.jpeg",
    alt: "Портрет специалиста",
    description: "Персональная работа с вами на всём пути — от определения стратегии до получения предложения от международной школы.",
    features: ["Индивидуальная стратегия", "Личное сопровождение", "Поддержка до оффера", "Уверенный старт"],
    icons: ["target", "profile", "document", "star"],
  },
];

export type Program = (typeof programs)[number];
