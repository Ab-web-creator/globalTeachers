export type BenefitIconName = "salary" | "housing" | "visa" | "relocation" | "flights" | "insurance" | "education" | "development";

export type Benefit = {
  id: BenefitIconName;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  iconColor: string;
  accentColor: string;
};

export const benefits: Benefit[] = [
  {
    id: "salary",
    title: "Зарплата",
    subtitle: "$4,000 / месяц",
    description: "Размер зарплаты зависит от образования, квалификации и стажа работы.",
    image: "/images/benefits/salary.jpg",
    color: "bg-emerald-50",
    iconColor: "bg-emerald-50 text-emerald-700",
    accentColor: "text-emerald-700",
  },
  {
    id: "housing",
    title: "Жильё",
    subtitle: "$800–1,700 / месяц",
    description: "Школа может предоставить жильё или ежемесячную компенсацию за аренду.",
    image: "/images/benefits/housing.jpg",
    color: "bg-amber-50",
    iconColor: "bg-amber-50 text-amber-700",
    accentColor: "text-amber-700",
  },
  {
    id: "visa",
    title: "Виза",
    subtitle: "Оформление документов",
    description: "Многие международные школы берут на себя оформление рабочей визы и необходимых документов и оплачивают связанные расходы.",
    image: "/images/benefits/visa-passport.jpg",
    color: "bg-violet-50",
    iconColor: "bg-violet-50 text-violet-700",
    accentColor: "text-violet-700",
  },
  {
    id: "relocation",
    title: "Переезд",
    subtitle: "Поддержка при релокации",
    description: "Школа может компенсировать расходы на переезд и первоначальное обустройство в новой стране.",
    image: "/images/benefits/relocation.jpg",
    color: "bg-orange-50",
    iconColor: "bg-orange-50 text-orange-700",
    accentColor: "text-orange-700",
  },
  {
    id: "flights",
    title: "Перелёты",
    subtitle: "Бесплатные билеты",
    description: "Многие школы оплачивают ежегодные перелёты сотруднику и членам его семьи.",
    image: "/images/benefits/flights.jpg",
    color: "bg-sky-50",
    iconColor: "bg-sky-50 text-sky-700",
    accentColor: "text-sky-700",
  },
  {
    id: "insurance",
    title: "Страхование",
    subtitle: "Медицинское покрытие",
    description: "Страховка может распространяться на сотрудника и семью, включая международное покрытие.",
    image: "/images/benefits/insurance.jpg",
    color: "bg-rose-50",
    iconColor: "bg-rose-50 text-rose-700",
    accentColor: "text-rose-700",
  },
  {
    id: "education",
    title: "Образование",
    subtitle: "До 100% стоимости",
    description: "Дети сотрудников могут учиться бесплатно или со значительной скидкой.",
    image: "/images/benefits/education-classroom.jpg",
    color: "bg-amber-50",
    iconColor: "bg-amber-50 text-amber-700",
    accentColor: "text-amber-700",
  },
  {
    id: "development",
    title: "Развитие",
    subtitle: "Обучение за счёт школы",
    description: "Многие школы финансируют курсы, тренинги, конференции и программы повышения квалификации сотрудников.",
    image: "/images/benefits/development.jpg",
    color: "bg-emerald-50",
    iconColor: "bg-emerald-50 text-emerald-700",
    accentColor: "text-emerald-700",
  },
];
