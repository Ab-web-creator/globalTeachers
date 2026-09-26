"use client";

import { useState } from "react";
import Link from "next/link";
import { faqItems } from "./faq-content";
import FaqItem from "./faq-item";

export default function FaqSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-6 py-10 sm:px-10 sm:py-12 lg:py-20 xl:py-24 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header data-reveal className="mb-10 sm:mb-12 text-left sm:text-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:mb-6 sm:text-base">Полезно знать</p>
          <h2 id="faq-title" className="text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">Часто задаваемые вопросы</h2>
        </header>
        <div id="faq-questions" className="grid items-start gap-3 lg:grid-cols-2 lg:gap-4">
          {faqItems.map((item, index) => (
            <div key={item.question} className={!expanded && index >= 3 ? (index === 3 ? "hidden lg:block" : "hidden") : ""}>
              <FaqItem {...item} />
            </div>
          ))}
        </div>
        {!expanded && (
          <div className="mt-3 pl-6 text-left sm:pl-8">
            <button type="button" aria-expanded={false} aria-controls="faq-questions" onClick={() => setExpanded(true)} className="rounded-none border-0 bg-transparent px-0 py-2.5 sm:py-3 text-base font-medium text-neutral-600 transition hover:text-neutral-800 hover:underline underline-offset-4">
              Показать все вопросы
            </button>
          </div>
        )}
        <div className="mx-auto mt-8 w-full max-w-lg rounded-3xl p-6 text-center sm:p-8" style={{ background: "radial-gradient(ellipse at center, #f8fbff 0%, #e0e7ff 55%, #c4b5fd 100%)" }}>
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
