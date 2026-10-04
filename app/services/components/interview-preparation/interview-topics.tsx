import SectionHeading from "../section-heading";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import { interviewTopics, interviewTopicsIntroduction, interviewTopicsTakeaway } from "./content";
import TopicCard from "./topic-card";
import { topicIcons } from "./topic-icons";

export default function InterviewTopics() {
  return (
    <section aria-labelledby="interview-topics" className="relative isolate pb-12 sm:pb-16 lg:pb-20">
      <SectionFade />
      <SectionLabel>Темы интервью</SectionLabel>
      <SectionHeading id="interview-topics">Что могут спросить?</SectionHeading>
      <p className="mt-4 max-w-3xl text-lg font-medium leading-relaxed text-neutral-600">{interviewTopicsIntroduction}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {interviewTopics.map(({ title, text }, index) => (
          <TopicCard key={title} icon={topicIcons[index]} title={title} text={text} />
        ))}
      </ul>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <figure className="flex items-center gap-5 rounded-3xl border border-brand-300 bg-linear-to-br from-amber-50 to-yellow-50/50 p-5 sm:gap-8 sm:p-6">
          <span aria-hidden="true" className="shrink-0 font-serif text-6xl leading-none text-brand-400">“</span>
          <blockquote className="border-l border-brand-300 pl-5 text-lg leading-relaxed text-brand-600 sm:pl-8">{interviewTopicsTakeaway}</blockquote>
        </figure>
      </div>
    </section>
  );
}
