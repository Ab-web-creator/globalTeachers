import Image from "next/image";
import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import SectionFade from "../cv-portfolio/section-fade";
import AnswerExample from "./answer-example";
import { schoolResearch } from "./content";

export default function SchoolResearch() {
  return (
    <section aria-labelledby="research-school" className="relative isolate grid items-center gap-10 lg:flex lg:justify-between lg:gap-12 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="sky" direction="down" halfHeight />
      <div className="min-w-0 lg:flex-1 lg:max-w-1/2">
        <SectionLabel>Изучите школу</SectionLabel>
        <SectionHeading id="research-school">Почему именно эта школа?</SectionHeading>
        {schoolResearch.paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-5"} max-w-3xl text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <div className="mt-8">
          <AnswerExample>{schoolResearch.weakAnswer}</AnswerExample>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600">{schoolResearch.verdict} {schoolResearch.better}</p>
        <aside className="mt-8 border-l-2 border-brand-300 pl-4">
          <p className="text-lg font-medium leading-relaxed text-brand-600">
            <strong className="font-semibold text-brand-600">Совет:</strong> {schoolResearch.tip}
          </p>
        </aside>
      </div>
      <Image src="/images/school-research-flowers-tall.webp" alt="Педагог изучает сайт международной школы; рядом с ноутбуком стоит ваза с цветами" width={1000} height={1250} sizes="(min-width: 1600px) 576px, 40vw" className="hidden h-112 w-2/5 max-w-xl shrink-0 rounded-3xl object-cover lg:block lg:self-end" />
    </section>
  );
}
