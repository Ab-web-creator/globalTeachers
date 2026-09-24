export type BenefitIconName = "salary" | "housing" | "flights" | "education" | "insurance";

export type Benefit = {
  id: BenefitIconName;
  title: string;
  subtitle?: string;
  label?: string;
  description: string;
  detail?: string;
  color: string;
  iconColor: string;
};

export const benefits: Benefit[] = [
  {
    id: "salary",
    title: "$4,000",
    subtitle: "в месяц",
    label: "Зарплата",
    description: "Размер зарплаты зависит от вашего образования (бакалавр, магистр, доктор) и стажа работы.",
    color: "bg-sky-50",
    iconColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "housing",
    title: "$800–1,700",
    subtitle: "в месяц",
    label: "Жильё или компенсация за аренду",
    description: "Многие международные школы предоставляют жильё или выплачивают ежемесячную компенсацию за аренду.",
    color: "bg-brand-50",
    iconColor: "bg-brand-100 text-brand-500",
  },
  {
    id: "flights",
    title: "Бесплатные перелёты",
    label: "Очень часто для всей семьи.",
    description: "Во многих школах оплачиваются ежегодные перелёты домой для сотрудника и членов его семьи (супруг/супруга и дети).",
    color: "bg-sky-50",
    iconColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "education",
    title: "До 100%",
    subtitle: "обучения детей",
    description: "Во многих школах обучение детей предоставляется бесплатно или со значительной скидкой.",
    color: "bg-amber-50",
    iconColor: "bg-amber-100 text-amber-950",
  },
  {
    id: "insurance",
    title: "Страховка",
    description: "Медицинская страховка для всей семьи и по всему миру (кроме США).",
    detail: "Комплексное медицинское покрытие включает амбулаторное и стационарное лечение. Условия зависят от конкретного контракта.",
    color: "bg-rose-50",
    iconColor: "bg-rose-100 text-rose-700",
  },
];
