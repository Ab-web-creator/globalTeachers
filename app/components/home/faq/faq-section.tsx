"use client";

import { useState } from "react";
import type { PanelProps } from "../content";
import { faqItems } from "./faq-content";
import FaqItem from "./faq-item";

export default function FaqSection({ openPanel }: PanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-6 py-10 sm:px-10 sm:py-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header data-reveal className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:mb-4 sm:text-base">Полезно знать</p>
          <h2 id="faq-title" className="text-4xl leading-none font-semibold tracking-wide sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">Часто задаваемые вопросы</h2>
        </header>
        <div id="faq-questions" className="grid items-start gap-3 lg:grid-cols-2 lg:gap-4">
          {faqItems.map((item, index) => (
            <div key={item.question} className={!expanded && index >= 3 ? (index === 3 ? "hidden lg:block" : "hidden") : ""}>
              <FaqItem {...item} />
            </div>
          ))}
        </div>
        {!expanded && (
          <div className="mt-6 text-center">
            <button type="button" aria-expanded={false} aria-controls="faq-questions" onClick={() => setExpanded(true)} className="rounded-full border border-brand-600 bg-white px-7 py-3 text-base font-medium text-brand-600 transition hover:bg-brand-600 hover:text-white">
              Показать все вопросы
            </button>
          </div>
        )}
        <div className="mx-auto mt-8 w-full max-w-lg rounded-3xl bg-brand-700 p-6 text-center sm:p-8">
          <h3 className="text-xl leading-tight font-semibold text-white">Не нашли ответ на свой вопрос?</h3>
          <p className="mt-3 text-base leading-normal text-brand-100">Расскажите нам о своей ситуации — мы поможем разобраться.</p>
          <button type="button" onClick={() => openPanel("Consultation")} className="mt-5 inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-semibold text-brand-800 transition hover:bg-brand-100">
            Получить консультацию <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
