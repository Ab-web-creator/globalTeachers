"use client";

import { FaqToggleIcon, FaqTopicIcon, type FaqIconName } from "@/app/components/svg";
import Link from "next/link";
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
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header data-reveal className="mb-10 sm:mb-12 text-left sm:text-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">Полезно знать</p>
          <h2 id="faq-title" className="text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">Часто задаваемые вопросы</h2>
        </header>
        <div id="faq-questions" className="grid items-start gap-3 lg:grid-cols-2 lg:gap-4">
          {faqItems.map((item, index) => (<div key={item.question} className={!expanded && index >= 3 ? (index === 3 ? "hidden lg:block" : "hidden") : ""}>
            <FaqItem {...item} />
          </div>))}
        </div>
        {!expanded && (<div className="mt-0 pl-6 text-left sm:pl-8">
          <button type="button" aria-expanded={false} aria-controls="faq-questions" onClick={() => setExpanded(true)} className="rounded-none border-0 bg-transparent px-0 py-2.5 sm:py-3 text-lg font-medium text-neutral-600 transition hover:text-neutral-800 hover:underline underline-offset-4">
            Показать все вопросы
          </button>
        </div>)}
        <div className="mx-auto mt-8 w-full max-w-lg rounded-3xl bg-linear-to-br from-orange-100 via-sky-50 to-violet-100 p-6 text-center sm:p-8">
          <h3 className="text-xl leading-tight font-semibold text-brand-700">Не нашли ответ на свой вопрос?</h3>
          <p className="mt-3 text-base leading-normal text-neutral-600">Расскажите нам о своей ситуации — мы поможем разобраться.</p>
          <Link href="/consultation" className="mt-5 inline-flex items-center justify-center gap-3 rounded-2xl sm:rounded-full max-lg:action-gradient-outline px-6 py-2.5 sm:py-4 text-base font-semibold text-brand-700 transition hover:shadow-md lg:border-2 lg:border-gray-400 lg:bg-white lg:hover:bg-brand-50">
            Получить консультацию
          </Link>
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
