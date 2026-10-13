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
    image: "/images/benefits/salary.webp",
    color: "bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-50",
    iconColor: "bg-white text-emerald-700",
    accentColor: "text-emerald-700",
  },
  {
    id: "housing",
    title: "Жильё",
    subtitle: "$800–1,700 / месяц",
    description: "Школа может предоставить жильё или ежемесячную компенсацию за аренду.",
    image: "/images/benefits/housing.webp",
    color: "bg-linear-to-br from-amber-100 via-orange-50 to-yellow-50",
    iconColor: "bg-white text-amber-700",
    accentColor: "text-amber-700",
  },
  {
    id: "visa",
    title: "Виза",
    subtitle: "Оформление документов",
    description: "Международные школы часто самостоятельно оформляют рабочую визу и покрывают все связанные с этим расходы.",
    image: "/images/benefits/visa-passport.jpg",
    color: "bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-50",
    iconColor: "bg-white text-violet-700",
    accentColor: "text-violet-700",
  },
  {
    id: "insurance",
    title: "Страхование",
    subtitle: "Медицинская страховка",
    description: "Международные школы часто предоставляют медицинскую страховку, которая распространяется как на сотрудников, так и на членов их семей.",
    image: "/images/benefits/insurance.webp",
    color: "bg-linear-to-br from-rose-100 via-pink-50 to-orange-50",
    iconColor: "bg-white text-rose-700",
    accentColor: "text-rose-700",
  },
  {
    id: "flights",
    title: "Транспортные расходы",
    subtitle: "Оплата поездок",
    description: "Многие международные школы оплачивают сотрудникам и членам их семей расходы на поездки к месту работы и обратно, включая авиабилеты и билеты на другие виды транспорта.",
    image: "/images/benefits/flights.webp",
    color: "bg-linear-to-br from-sky-100 via-blue-50 to-indigo-50",
    iconColor: "bg-white text-sky-700",
    accentColor: "text-sky-700",
  },
  {
    id: "relocation",
    title: "Переезд",
    subtitle: "Поддержка при релокации",
    description: "Школа может компенсировать расходы на переезд и первоначальное обустройство в новой стране.",
    image: "/images/benefits/relocation.webp",
    color: "bg-linear-to-br from-orange-100 via-amber-50 to-rose-50",
    iconColor: "bg-white text-orange-700",
    accentColor: "text-orange-700",
  },
  {
    id: "education",
    title: "Образование",
    subtitle: "До 100% стоимости",
    description: "Дети сотрудников могут учиться бесплатно или со значительной скидкой  в той же международной школе, где работают их родители.",
    image: "/images/benefits/education-classroom.jpg",
    color: "bg-linear-to-br from-indigo-100 via-violet-50 to-blue-50",
    iconColor: "bg-white text-indigo-700",
    accentColor: "text-indigo-700",
  },
  {
    id: "development",
    title: "Развитие",
    subtitle: "Обучение за счёт школы",
    description: "Многие школы финансируют курсы, тренинги, конференции и программы повышения квалификации сотрудников.",
    image: "/images/benefits/development.webp",
    color: "bg-linear-to-br from-fuchsia-100 via-pink-50 to-violet-50",
    iconColor: "bg-white text-fuchsia-700",
    accentColor: "text-fuchsia-700",
  },
];
