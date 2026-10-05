import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";

const steps = [
  { title: "Документы", icon: icons.document, tone: "bg-violet-100 text-violet-600", text: "Помогаем разобраться, какие документы подготовить с вашей стороны." },
  { title: "Рабочая виза", icon: icons.passport, tone: "bg-sky-100 text-sky-600", text: "Объясняем этапы оформления и действия, которые школа ожидает от вас." },
  { title: "Коммуникация со школой", icon: icons.chat, tone: "bg-rose-100 text-rose-600", text: "Помогаем с вопросами и уточнением следующих шагов." },
  { title: "Подготовка к переезду", icon: icons.truck, tone: "bg-amber-100 text-amber-700", text: "Обсуждаем практические детали и подготовку к новому этапу." },
];

const cardTones = [
  "border-violet-200 bg-violet-50 text-violet-800",
  "border-sky-200 bg-sky-50 text-sky-800",
  "border-rose-200 bg-rose-50 text-rose-800",
  "border-amber-200 bg-amber-50 text-amber-900",
];

export default function AfterOfferSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ title, icon, tone, text }, index) => (
        <li key={title} className={`rounded-2xl border p-6 shadow-sm ${cardTones[index]}`}>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
              <LineIcon path={icon} className="size-6" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug">{title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
