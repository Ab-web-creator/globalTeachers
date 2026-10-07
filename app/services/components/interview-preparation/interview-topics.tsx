import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import { interviewTopics, interviewTopicsIntroduction, interviewTopicsTakeaway } from "./content";
import TopicCard from "./topic-card";
import ResearchTip from "./research-tip";
import { topicIcons } from "./topic-icons";
import { questionIcons } from "./question-icons";

export default function InterviewTopics() {
  return (
    <section aria-labelledby="interview-topics" className="relative isolate bg-white py-12 sm:py-16 lg:py-20">
      <SectionLabel>Темы интервью</SectionLabel>
      <SectionHeading id="interview-topics">Что могут спросить?</SectionHeading>
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{interviewTopicsIntroduction}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {interviewTopics.map(({ title, text }, index) => (
          <TopicCard key={title} icon={topicIcons[index]} tone={questionIcons[index].tone} title={title} text={text} />
        ))}
      </ul>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ResearchTip label={null}>{interviewTopicsTakeaway}</ResearchTip>
      </div>
    </section>
  );
}
