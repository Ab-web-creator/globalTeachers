import SectionHeading from "../section-heading";
import Link from "next/link";
import { preparationSteps } from "./content";

export default function InterviewPractice() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section aria-labelledby="demo-lesson">
        <SectionHeading id="demo-lesson">Demo Lesson</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">В некоторых школах кандидата могут попросить провести короткий пробный урок или представить его план.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Здесь оценивается не только знание предмета. Школа может обращать внимание на структуру урока, взаимодействие с учениками, инструкции, темп, assessment, differentiation и вашу способность адаптироваться к ситуации.</p>
      </section>
      <section aria-labelledby="before-interview">
        <SectionHeading id="before-interview">Перед интервью</SectionHeading>
        <ol className="mt-6 space-y-4">
          {preparationSteps.map((text, index) => <li key={text} className="flex items-baseline gap-4 leading-relaxed text-neutral-600">
            <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
            {text}
          </li>)}
        </ol>
      </section>
      <section aria-labelledby="choosing-school">
        <SectionHeading id="choosing-school">И помните</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">Интервью — это не экзамен, где только школа оценивает вас.</p>
        <p className="mt-4 text-xl font-medium text-brand-600">Вы тоже выбираете школу.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Это возможность узнать больше о руководстве, учениках, условиях работы, профессиональной культуре и понять, действительно ли эта школа подходит вам.</p>
      </section>
      <section aria-labelledby="interview-pro-support" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
        <SectionHeading id="interview-pro-support">Хотите подготовиться к интервью на практике?</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">В программе PRO мы разберём возможные вопросы, подготовим ваши профессиональные примеры и проведём пробное интервью, максимально приближенное к реальному собеседованию.</p>
        <Link href="/programs/pro" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Посмотреть PRO <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
