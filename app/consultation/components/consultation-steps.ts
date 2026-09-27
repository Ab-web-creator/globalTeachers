export const consultationSteps = [
  { title: "О вас", description: "Познакомимся, чтобы лучше понять вашу ситуацию.", fields: ["name", "country"] },
  { title: "Контакты и квалификация", description: "Как мы можем связаться с вами и есть ли у вас педагогическая квалификация?", fields: ["email", "contact", "qualification"] },
  { title: "Ваш опыт", description: "Расскажите, что вы преподаёте и как давно.", fields: ["subject", "experience"] },
  { title: "Образование и международный опыт", description: "Расскажите о вашем образовании и опыте работы в международной школе.", fields: ["education", "international"] },
  { title: "Ваш английский", description: "Как вы оцениваете свой уровень английского?", fields: ["english"] },
  { title: "Ваши планы", description: "Где и когда вы хотели бы начать работать?", fields: ["timing", "destinations"] },
  { title: "Ваши цели", description: "", fields: ["priority", "goals"] },
] as const;
