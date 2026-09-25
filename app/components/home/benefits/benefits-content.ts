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
    color: "bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-50",
    iconColor: "bg-emerald-100 text-emerald-700",
    accentColor: "text-emerald-700",
  },
  {
    id: "housing",
    title: "Жильё",
    subtitle: "$800–1,700 / месяц",
    description: "Школа может предоставить жильё или ежемесячную компенсацию за аренду.",
    image: "/images/benefits/housing.jpg",
    color: "bg-linear-to-br from-amber-100 via-orange-50 to-yellow-50",
    iconColor: "bg-amber-100 text-amber-700",
    accentColor: "text-amber-700",
  },
  {
    id: "visa",
    title: "Виза",
    subtitle: "Оформление документов",
    description: "Международные школы часто сами оформляют рабочую визу, а также оплачивают все бумажные расходы.",
    image: "/images/benefits/visa-passport.jpg",
    color: "bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-50",
    iconColor: "bg-violet-100 text-violet-700",
    accentColor: "text-violet-700",
  },
  {
    id: "insurance",
    title: "Страхование",
    subtitle: "Медицинское покрытие",
    description: "Страховка может распространяться на сотрудника и семью, включая международное покрытие.",
    image: "/images/benefits/insurance.jpg",
    color: "bg-linear-to-br from-rose-100 via-pink-50 to-orange-50",
    iconColor: "bg-rose-100 text-rose-700",
    accentColor: "text-rose-700",
  },
  {
    id: "flights",
    title: "Перелёты",
    subtitle: "Бесплатные билеты",
    description: "Многие школы оплачивают ежегодные перелёты сотруднику и членам его семьи.",
    image: "/images/benefits/flights.jpg",
    color: "bg-linear-to-br from-sky-100 via-blue-50 to-indigo-50",
    iconColor: "bg-sky-100 text-sky-700",
    accentColor: "text-sky-700",
  },
  {
    id: "relocation",
    title: "Переезд",
    subtitle: "Поддержка при релокации",
    description: "Школа может компенсировать расходы на переезд и первоначальное обустройство в новой стране.",
    image: "/images/benefits/relocation.jpg",
    color: "bg-linear-to-br from-orange-100 via-amber-50 to-rose-50",
    iconColor: "bg-orange-100 text-orange-700",
    accentColor: "text-orange-700",
  },
  {
    id: "education",
    title: "Образование",
    subtitle: "До 100% стоимости",
    description: "Дети сотрудников могут учиться бесплатно или со значительной скидкой.",
    image: "/images/benefits/education-classroom.jpg",
    color: "bg-linear-to-br from-indigo-100 via-violet-50 to-blue-50",
    iconColor: "bg-indigo-100 text-indigo-700",
    accentColor: "text-indigo-700",
  },
  {
    id: "development",
    title: "Развитие",
    subtitle: "Обучение за счёт школы",
    description: "Многие школы финансируют курсы, тренинги, конференции и программы повышения квалификации сотрудников.",
    image: "/images/benefits/development.jpg",
    color: "bg-linear-to-br from-fuchsia-100 via-pink-50 to-violet-50",
    iconColor: "bg-fuchsia-100 text-fuchsia-700",
    accentColor: "text-fuchsia-700",
  },
];
