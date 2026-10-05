import ProFitCard from "./pro-fit-card";
import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";
import { audience, preparationQuestions, support } from "./content";

// Support, audience and "what you won't have to figure out" as three blocks in a row.
export default function ProFit() {
  return (
    <section aria-labelledby="pro-support pro-audience pro-preparation" className="py-12 sm:py-16 lg:py-20">
      <div className="grid gap-5 lg:grid-cols-3">
        <ProFitCard id="pro-support" title="И вы не остаётесь одни после консультации" icon={icons.chat} note="На каждом этапе вы не одни" variant="support">
          {support.paragraphs.map((text) => <p key={text}>{text}</p>)}
        </ProFitCard>
        <ProFitCard id="pro-audience" title="Кому подходит PRO?" icon={icons.profile} note="Больше, чем подготовка" variant="audience">
          {audience.paragraphs.map((text) => <p key={text}>{text}</p>)}
        </ProFitCard>
        <ProFitCard id="pro-preparation" title={audience.listTitle} icon="M9 18h6 M10 21h4 M8 13a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z" note="Чёткие ответы на важные вопросы" variant="documents">
          <ul className="space-y-3">
            {preparationQuestions.map((text) => (
              <li key={text} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-200/60 text-brand-500">
                  <LineIcon path="m5 12 4 4 10-10" className="size-3.5" />
                </span>
                <p className="first-letter:uppercase">{text.replace(/[;.]$/, "")}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{audience.closing}</p>
        </ProFitCard>
      </div>
    </section>
  );
}
