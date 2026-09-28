import Link from "next/link";
import ServiceIllustration from "../../../components/service-illustration";
import type { Service } from "../../services";
import { introduction } from "./content";
import InterviewConversation from "./interview-conversation";
import InterviewPractice from "./interview-practice";

export default function InterviewPreparationDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#categories" className="text-brand-500 underline-offset-4 hover:underline">← Как мы помогаем</Link>
      <article>
        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">Подготовка к интервью</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Как подготовиться к собеседованию в международной школе?</h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">{introduction}</p>
            <p className="mt-4 text-lg font-medium leading-relaxed">Хорошее интервью — это не набор заученных ответов. Это подготовленный профессиональный разговор.</p>
          </div>
          <div className="rounded-3xl bg-white p-6">
            <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
          </div>
        </header>
        <div className="mx-auto mt-12 max-w-3xl space-y-10 sm:space-y-12">
          <InterviewConversation />
          <InterviewPractice />
        </div>
      </article>
    </main>
  );
}
