import Image from "next/image";
import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import SectionFade from "../cv-portfolio/section-fade";
import AnswerExample from "./answer-example";
import ResearchTip from "./research-tip";
import { schoolResearch } from "./content";

export default function SchoolResearch() {
  return (
    <section aria-labelledby="research-school" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="sky" direction="down" halfHeight />
      <div className="lg:col-span-3">
        <SectionLabel>Изучите школу</SectionLabel>
        <SectionHeading id="research-school">Почему именно эта школа?</SectionHeading>
        {schoolResearch.paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-5"} max-w-3xl text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <div className="mt-8">
          <AnswerExample>{schoolResearch.weakAnswer}</AnswerExample>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600">{schoolResearch.verdict} {schoolResearch.better}</p>
        <div className="mt-8">
          <ResearchTip>{schoolResearch.tip}</ResearchTip>
        </div>
      </div>
      <Image src="/images/interview-school.png" alt="" width={716} height={1060} sizes="384px" className="hidden h-auto w-full max-w-sm justify-self-center self-end [mask-image:radial-gradient(ellipse_closest-side,black_72%,transparent)] lg:col-span-2 lg:block" />
    </section>
  );
}
