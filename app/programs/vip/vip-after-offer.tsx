import { offerAcceptedCheckIconPath, programIconPaths, StrokeIcon } from "@/app/components/svg";
import Image from "next/image";
import SectionFade from "../../services/components/cv-portfolio/section-fade";
import SectionLabel from "../../services/components/job-search/section-label";
import SectionHeading from "../../services/components/section-heading";
import Prose from "../components/prose";
import { afterOffer } from "./content";

const steps = [
  { title: "Оффер принят", icon: programIconPaths.letter, text: "Предложение принято — начинаем следующий этап вместе." },
  { title: "Документы", icon: programIconPaths.document, tone: "bg-violet-100 text-violet-600", text: "Помогаем разобраться, какие документы подготовить с вашей стороны." },
  { title: "Рабочая виза", icon: programIconPaths.passport, tone: "bg-sky-100 text-sky-600", text: "Объясняем этапы оформления и действия, которые школа ожидает от вас." },
  { title: "Коммуникация со школой", icon: programIconPaths.chat, tone: "bg-rose-100 text-rose-600", text: "Помогаем с вопросами и уточнением следующих шагов." },
  { title: "Подготовка к переезду", icon: programIconPaths.truck, tone: "bg-amber-100 text-amber-700", text: "Обсуждаем практические детали и подготовку к новому этапу." },
];

export default function VipAfterOffer() {
  return (
    <section aria-labelledby="vip-after-offer" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite />
      <div className="grid items-center gap-10 min-[1000px]:grid-cols-12 min-[1000px]:gap-8">
        <div className="min-[1000px]:col-span-7">
          <SectionLabel>После оффера</SectionLabel>
          <SectionHeading id="vip-after-offer">Предложение принято.<br /><span className="text-brand-500">Что дальше?</span></SectionHeading>
          <Prose paragraphs={afterOffer.paragraphs} />
          <p className="mt-6 text-lg font-semibold leading-relaxed text-neutral-600">{afterOffer.closing}</p>
        </div>
        <div className="hidden min-[1000px]:col-span-5 min-[1000px]:block">
          <div className="relative mx-auto w-full max-w-sm">
            <Image src="/images/vip-after-offer-transparent.webp" alt="Документы, паспорт и подготовка к переезду" width={1254} height={1254} sizes="(min-width: 640px) 384px, 90vw" className="h-auto w-full object-contain" />
            <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="absolute bottom-1/8 left-1/4 -rotate-12 rounded-sm bg-brand-500 px-4 py-3 text-left text-sm italic leading-relaxed text-white shadow-md sm:px-5 sm:py-4 sm:text-lg">Новый этап.<br />Мы рядом.</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <ol className="grid gap-6 md:grid-cols-5 md:gap-4">
          {steps.map(({ title, icon, text }, index) => (<li key={title} className="group relative flex items-start gap-4 text-left md:flex-col">
            <div className="relative flex shrink-0 md:w-full">
              {index < steps.length - 1 && <span aria-hidden="true" className="absolute top-8 left-8 hidden h-px w-full bg-brand-200 md:block" />}
              <span aria-hidden="true" className="relative flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-400 transition-colors group-hover:bg-brand-200 group-hover:text-brand-600 motion-reduce:transition-none">
                <StrokeIcon path={icon} className="size-7" />
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-brand-950 transition-colors group-hover:text-brand-600 motion-reduce:transition-none">{title}</h3>
              {index === 0 ? (<span className="mt-3 inline-flex items-center gap-2 text-lg text-brand-600"><StrokeIcon path={offerAcceptedCheckIconPath} className="size-5" />Принято</span>) : (<p className="mt-3 text-lg leading-relaxed text-neutral-600">{text}</p>)}
            </div>
          </li>))}
        </ol>
      </div>
    </section>
  );
}
