import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceHero from "../service-hero";
import { introduction } from "./content";
import InterviewConversation from "./interview-conversation";
import InterviewPractice from "./interview-practice";
import InterviewSupport from "./interview-support";

export default function InterviewPreparationDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <ServiceHero image="/images/proPackage.jpeg">
          <SectionLabel>Подготовка к интервью</SectionLabel>
          <PageTitle>Как подготовиться к собеседованию в международной школе?</PageTitle>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">{introduction}</p>
          <p className="mt-4 text-lg font-medium leading-relaxed">Хорошее интервью — это не набор заученных ответов. Это подготовленный профессиональный разговор.</p>
        </ServiceHero>
        <div className="mt-12 max-w-4xl space-y-10 sm:mt-16 sm:space-y-12 lg:mt-20">
          <InterviewConversation />
          <InterviewPractice />
        </div>
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <InterviewSupport />
        </div>
      </article>
    </main>
  );
}
