import GuideCard from "../job-search/guide-card";
import { preparationSteps } from "./content";

export default function InterviewPractice() {
  return (
    <div className="grid gap-12 lg:grid-cols-13">
      <div className="lg:col-span-4">
        <GuideCard as="div" id="demo-lesson" title="Demo Lesson">
          <p>В некоторых школах кандидата могут попросить провести короткий пробный урок или представить его план.</p>
          <p>Здесь оценивается не только знание предмета. Школа может обращать внимание на структуру урока, взаимодействие с учениками, инструкции, темп, assessment, differentiation и вашу способность адаптироваться к ситуации.</p>
        </GuideCard>
      </div>
      <div className="lg:col-span-5">
        <GuideCard as="div" id="before-interview" title="Перед интервью">
          <ol className="space-y-2">
            {preparationSteps.map((text, index) => (
              <li key={text} className="flex items-baseline gap-4">
                <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
                {text}
              </li>
            ))}
          </ol>
        </GuideCard>
      </div>
      <div className="lg:col-span-4">
        <GuideCard as="div" id="choosing-school" title="И помните">
          <p>Интервью — это не экзамен, где только школа оценивает вас.</p>
          <p>Это возможность узнать больше о руководстве, учениках, условиях работы, профессиональной культуре и понять, действительно ли эта школа подходит вам.</p>
          <p className="text-brand-600">Вы тоже выбираете школу.</p>
        </GuideCard>
      </div>
    </div>
  );
}
