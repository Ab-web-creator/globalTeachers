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
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ title, icon, text }) => (
        <li key={title} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100/60 text-brand-600">
              <LineIcon path={icon} className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-brand-950">{title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
