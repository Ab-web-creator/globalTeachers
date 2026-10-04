import GuideCard from "../../services/components/job-search/guide-card";
import { audience, preparationQuestions, support } from "./content";

// Support, audience and "what you won't have to figure out" as three blocks in a row.
export default function ProFit() {
  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <GuideCard id="pro-support" title="И вы не остаётесь одни после консультации">
        {support.paragraphs.map((text) => <p key={text}>{text}</p>)}
      </GuideCard>
      <GuideCard id="pro-audience" title="Кому подходит PRO?">
        {audience.paragraphs.map((text) => <p key={text}>{text}</p>)}
      </GuideCard>
      <GuideCard id="pro-preparation" title={audience.listTitle}>
        <ul className="space-y-2">
          {preparationQuestions.map((text) => (
            <li key={text} className="flex gap-4">
              <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gray-300" />
              <p className="first-letter:uppercase">{text.replace(/[;.]$/, "")}</p>
            </li>
          ))}
        </ul>
        <p className="text-brand-600">{audience.closing}</p>
      </GuideCard>
    </div>
  );
}
