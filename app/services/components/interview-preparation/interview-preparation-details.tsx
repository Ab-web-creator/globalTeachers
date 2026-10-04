import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceIllustration from "../../../components/service-illustration";
import type { Service } from "../../services";
import { introduction } from "./content";
import InterviewConversation from "./interview-conversation";
import InterviewPractice from "./interview-practice";
import BackLink from "../back-link";

export default function InterviewPreparationDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-8 lg:pb-20 xl:px-20">
      <BackLink />
      <article>
        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionLabel>Подготовка к интервью</SectionLabel>
            <PageTitle>Как подготовиться к собеседованию в международной школе?</PageTitle>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">{introduction}</p>
            <p className="mt-4 text-lg font-medium leading-relaxed">Хорошее интервью — это не набор заученных ответов. Это подготовленный профессиональный разговор.</p>
          </div>
          <div className="rounded-3xl bg-white p-6">
            <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
          </div>
        </header>
        <div className="mt-12 max-w-4xl space-y-10 sm:mt-16 sm:space-y-12 lg:mt-20">
          <InterviewConversation />
          <InterviewPractice />
        </div>
      </article>
    </main>
  );
}
