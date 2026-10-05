import ProFitCard from "../../../programs/pro/pro-fit-card";
import { icons } from "../../../programs/components/icons";
import { preparationSteps } from "./content";

export default function InterviewPractice() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <ProFitCard headingLevel="h3" id="demo-lesson" title="Demo Lesson" icon={icons.school} note="Покажите себя в деле" variant="support">
        <p>В некоторых школах кандидата могут попросить провести короткий пробный урок или представить его план.</p>
        <p>Здесь оценивается не только знание предмета. Школа может обращать внимание на структуру урока, взаимодействие с учениками, инструкции, темп, assessment, differentiation и вашу способность адаптироваться к ситуации.</p>
      </ProFitCard>
      <ProFitCard headingLevel="h3" id="before-interview" title="Перед интервью" icon={icons.checklist} note="Спокойствие начинается с подготовки" variant="preparation">
        <ol className="space-y-2">
          {preparationSteps.map((text, index) => (
            <li key={text} className="flex items-baseline gap-4">
              <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
              {text}
            </li>
          ))}
        </ol>
      </ProFitCard>
      <ProFitCard headingLevel="h3" id="choosing-school" title="И помните" icon={icons.compass} note="Вы тоже выбираете" variant="audience">
        <p>Интервью — это не экзамен, где только школа оценивает вас.</p>
        <p>Это возможность узнать больше о руководстве, учениках, условиях работы, профессиональной культуре и понять, действительно ли эта школа подходит вам.</p>
        <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">Вы тоже выбираете школу.</p>
      </ProFitCard>
    </div>
  );
}
