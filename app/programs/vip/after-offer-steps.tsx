import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";

const steps = [
  { title: "Оффер принят", icon: icons.letter, text: "Предложение принято — начинаем следующий этап вместе." },
  { title: "Документы", icon: icons.document, tone: "bg-violet-100 text-violet-600", text: "Помогаем разобраться, какие документы подготовить с вашей стороны." },
  { title: "Рабочая виза", icon: icons.passport, tone: "bg-sky-100 text-sky-600", text: "Объясняем этапы оформления и действия, которые школа ожидает от вас." },
  { title: "Коммуникация со школой", icon: icons.chat, tone: "bg-rose-100 text-rose-600", text: "Помогаем с вопросами и уточнением следующих шагов." },
  { title: "Подготовка к переезду", icon: icons.truck, tone: "bg-amber-100 text-amber-700", text: "Обсуждаем практические детали и подготовку к новому этапу." },
];

export default function AfterOfferSteps() {
  return (
    <ol className="grid gap-6 md:grid-cols-5 md:gap-4">
      {steps.map(({ title, icon, text }, index) => (
        <li key={title} className="group relative flex items-start gap-4 md:flex-col md:items-center md:text-center">
          <div className="relative flex shrink-0 md:w-full md:justify-center">
            {index < steps.length - 1 && <span aria-hidden="true" className="absolute top-8 left-1/2 hidden h-px w-full bg-brand-200 md:block" />}
            <span aria-hidden="true" className="relative flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-400 transition-colors group-hover:bg-brand-200 group-hover:text-brand-600 motion-reduce:transition-none">
              <LineIcon path={icon} className="size-7" />
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug text-brand-950 transition-colors group-hover:text-brand-600 motion-reduce:transition-none">{title}</h3>
            {index === 0 ? (
              <span className="mt-3 inline-flex items-center gap-2 text-sm text-brand-600"><LineIcon path="M5 12l4 4L19 6" className="size-5" />Принято</span>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
