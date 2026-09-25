import timings from "./audio-timing.json";

export const scenes = [
  {
    title: "Ваш опыт открывает новые возможности",
    image: "/images/benefits/education-classroom.jpg",
    alt: "Ученица занимается за партой в классе",
    seconds: timings[0],
    caption: "Ваш опыт нужен за пределами одной страны",
    narration: "Вы учитель и мечтаете работать за рубежом? Ваш опыт может быть востребован в международных школах. Главное — понять, с чего начать.",
  },
  {
    title: "Знакомые сомнения",
    image: "/images/startPackage.jpeg",
    alt: "Педагог за ноутбуком обдумывает следующий шаг",
    seconds: timings[1],
    caption: "С чего начать? Куда отправить резюме?",
    narration: "Где искать вакансии? Как составить резюме? Что говорить на собеседовании? Когда вопросов много, первый шаг кажется самым сложным.",
  },
  {
    title: "Личное обращение",
    image: "/images/about-teacher.png",
    alt: "Основатель GlobalTeacherHub за рабочим столом",
    seconds: timings[2],
    caption: "Вы не одни на этом пути",
    narration: "Я сам прошёл этот путь. Поэтому создал GlobalTeacherHub — чтобы помогать педагогам готовиться к международной карьере с понятным планом и поддержкой.",
  },
  {
    title: "Понятный план",
    image: "/images/proPackage.jpeg",
    alt: "Специалист работает с документами за ноутбуком",
    seconds: timings[3],
    caption: "Ваш опыт → ваши сильные стороны → план действий",
    narration: "Вместе разберём ваш опыт, выделим сильные стороны и определим направления поиска. Вы поймёте, какие шаги делать и в какой последовательности.",
  },
  {
    title: "Подготовка к откликам",
    image: "/images/myOwnImage-education.webp",
    alt: "Педагог с международным опытом",
    seconds: timings[4],
    caption: "CV • Портфолио • Подготовка к интервью",
    narration: "Поможем представить ваши достижения в CV и портфолио, подготовиться к собеседованиям и увереннее откликаться на вакансии международных школ.",
  },
  {
    title: "Поддержка под ваши задачи",
    image: "/images/startPackage.jpeg",
    alt: "Подготовка к самостоятельному поиску работы",
    seconds: timings[5],
    caption: "START — план · PRO — подготовка · VIP — сопровождение",
    narration: "Выберите свою поддержку: START — для самостоятельного поиска, PRO — для комплексной подготовки, VIP — для персонального сопровождения на пути к предложению от школы.",
  },
  {
    title: "Новая глава",
    image: "/images/VIPpackage.jpeg",
    alt: "Семья с багажом в аэропорту",
    seconds: timings[6],
    caption: "Новая страна. Новая школа. Новая глава.",
    narration: "Работа учителем за рубежом реальна. Это возможность познакомиться с новой культурой, развиваться в профессии и открыть новую главу своей жизни.",
  },
  {
    title: "Приглашение к разговору",
    image: "/images/benefits/flights.jpg",
    alt: "Крыло самолёта над облаками",
    seconds: timings[7],
    caption: "GlobalTeacherHub · Начните с консультации",
    narration: "Расскажите нам о своём опыте. Обсудим ваши возможности и следующий шаг. GlobalTeacherHub — возможно, именно сейчас начинается ваша международная история.",
  },
];

export const totalSeconds = scenes.reduce((sum, scene) => sum + scene.seconds, 0);
export const voiceover = scenes.map((scene) => scene.narration).join("\n\n");
export function timestamp(seconds: number) {
  return `${Math.floor(Math.round(seconds) / 60)}:${String(Math.round(seconds) % 60).padStart(2, "0")}`;
}
