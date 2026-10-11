"use client";

import { FaqToggleIcon, FaqTopicIcon, type FaqIconName } from "@/app/components/svg";
import FaqClarityAnimation from "./faq-clarity-animation";
import { useState } from "react";
import { faqItems } from "./faq-content";

type FaqItemProps = {
  question: string;
  answer: string;
  icon: FaqIconName;
};

export default function FaqSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="faq" aria-labelledby="faq-title" style={{ overflowAnchor: "none" }} className="relative isolate scroll-mt-24 overflow-hidden bg-linear-to-t from-white via-brand-50 to-violet-50 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto w-full min-w-0 max-w-400 xl:px-4">
        <FaqClarityAnimation hidden={expanded} />
        <div className={`relative ${expanded ? "" : "lg:w-1/2 lg:pr-8"}`}>
        <header data-reveal className="mb-10 text-left">
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">Полезно знать</p>
          <h2 id="faq-title" className="text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">Часто задаваемые<br />вопросы</h2>
          <p className="mt-7 max-w-[55ch] text-lg font-normal leading-relaxed text-neutral-600">Ответы на основные вопросы о работе в международных школах, подготовке к поиску и нашей поддержке.</p>
        </header>
        <div id="faq-questions" className={`grid grid-cols-1 items-start gap-4 ${expanded ? "md:grid-cols-2" : ""}`}>
          {faqItems.map((item, index) => (<div key={item.question} className={!expanded && index >= 3 ? "hidden" : ""}>
            <FaqItem {...item} />
          </div>))}
        </div>
        {!expanded && (<div className="mt-0 text-left">
          <button type="button" aria-expanded={false} aria-controls="faq-questions" onClick={() => setExpanded(true)} className="rounded-none border-0 bg-transparent px-0 py-2.5 sm:py-3 text-lg font-medium text-neutral-600 transition hover:text-neutral-800 underline underline-offset-4">
            Показать все вопросы
          </button>
        </div>)}
        <div className="mt-8 text-left">
          <p className="max-w-[45ch] border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">Не нашли ответ на свой вопрос? Расскажите нам о своей ситуации — мы поможем разобраться.</p>
        </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, icon }: FaqItemProps) {
  return (
    <details className="group rounded-2xl border border-neutral-200 bg-white transition-colors open:border-brand-500 hover:border-brand-300">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-2 sm:p-4 text-base leading-normal font-semibold text-neutral-900 sm:px-6 sm:text-lg [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center text-brand-500">
          <FaqTopicIcon name={icon} />
        </span>
        <span className="min-w-0 flex-1">{question}</span>
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center text-brand-600">
          <FaqToggleIcon />
        </span>
      </summary>
      <p className="pr-5 pb-5 pl-17 text-base leading-relaxed text-neutral-600 sm:pr-6 sm:pl-18">{answer}</p>
    </details>
  );
}
