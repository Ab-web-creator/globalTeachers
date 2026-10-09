import { programIconPaths } from "@/app/components/svg";
import IconCard from "../../services/components/icon-card";
import ProgramSection from "../components/program-section";
import StatCard from "../components/stat-card";
import { practice } from "./content";

export default function ProPractice() {
  return (
    <ProgramSection id="pro-practice" label="Практика и поддержка" title="Когда начинается настоящий поиск">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-100 via-cyan-50/50 via-20% to-sky-100/0 to-50%" />
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{practice.description}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {practice.inclusions.map(({ icon, title, paragraphs }) => (
          <IconCard
            key={title}
            icon={programIconPaths[icon]}
            title={title}
            paragraphs={paragraphs}
            surface="border-brand-100 bg-white hover:border-brand-300/60 hover:bg-brand-300/10"
            tone="bg-brand-300/15 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white"
          />
        ))}
        <li>
          <StatCard value="30 дней" label="ответов на ваши вопросы" />
        </li>
      </ul>
    </ProgramSection>
  );
}
