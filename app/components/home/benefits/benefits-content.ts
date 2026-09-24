export type BenefitIconName = "salary" | "housing" | "flights" | "education" | "insurance";

export type Benefit = {
  id: BenefitIconName;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  iconColor: string;
};

export const benefits: Benefit[] = [
  {
    id: "salary",
    title: "Зарплата",
    subtitle: "$4,000 / месяц",
    description: "Размер зарплаты зависит от образования, квалификации и стажа работы.",
    color: "bg-sky-50",
    iconColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "housing",
    title: "Жильё",
    subtitle: "$800–1,700 / месяц",
    description: "Школа может предоставить жильё или ежемесячную компенсацию за аренду.",
    color: "bg-brand-50",
    iconColor: "bg-brand-100 text-brand-500",
  },
  {
    id: "flights",
    title: "Перелёты",
    subtitle: "Бесплатные билеты",
    description: "Многие школы оплачивают ежегодные перелёты сотруднику и членам его семьи.",
    color: "bg-sky-50",
    iconColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "education",
    title: "Образование",
    subtitle: "До 100% стоимости",
    description: "Дети сотрудников могут учиться бесплатно или со значительной скидкой.",
    color: "bg-amber-50",
    iconColor: "bg-amber-100 text-amber-950",
  },
  {
    id: "insurance",
    title: "Страхование",
    subtitle: "Медицинское покрытие",
    description: "Страховка может распространяться на сотрудника и семью, включая международное покрытие.",
    color: "bg-rose-50",
    iconColor: "bg-rose-100 text-rose-700",
  },
];
