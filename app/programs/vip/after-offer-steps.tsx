import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";

const steps = [
  { title: "Документы", icon: icons.document, text: "Помогаем разобраться, какие документы подготовить с вашей стороны." },
  { title: "Рабочая виза", icon: icons.passport, text: "Объясняем этапы оформления и действия, которые школа ожидает от вас." },
  { title: "Коммуникация со школой", icon: icons.chat, text: "Помогаем с вопросами и уточнением следующих шагов." },
  { title: "Подготовка к переезду", icon: icons.home, text: "Обсуждаем практические детали и подготовку к новому этапу." },
];

export default function AfterOfferSteps() {
  return (
    <div className="rounded-3xl border border-brand-200 bg-white/80 p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-brand-950">Что впереди:</h3>
      <ol className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, icon, text }, index) => (
          <li key={title} className="relative">
            <span aria-hidden="true" className="mb-5 flex size-16 items-center justify-center rounded-full bg-brand-300/15 text-brand-500">
              <LineIcon path={icon} className="size-8" />
            </span>
            {index < steps.length - 1 && <span aria-hidden="true" className="absolute top-4 right-2 hidden text-3xl text-brand-300 lg:block">→</span>}
            <h4 className="text-lg font-semibold leading-snug text-brand-950">{title}</h4>
            <p className="mt-4 leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
