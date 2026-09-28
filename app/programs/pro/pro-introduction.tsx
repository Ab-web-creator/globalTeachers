import { presentationProblems } from "./content";

export default function ProIntroduction() {
  return (
    <>
      <div className="space-y-4 leading-relaxed text-neutral-600">
        <p>Вы уже знаете, что хотите работать в международной школе.</p>
        <p className="text-lg font-medium text-brand-700">Теперь главный вопрос — насколько убедительно вы выглядите для работодателя?</p>
        <p>Можно иметь хорошее образование, многолетний опыт и серьёзные профессиональные достижения — и при этом не получать приглашений на интервью.</p>
        <p>Причина не всегда в квалификации.</p>
        <p>Иногда кандидат просто не умеет правильно представить свой опыт.</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-300">
          {presentationProblems.map((problem) => <li key={problem}>{problem}</li>)}
        </ul>
        <p className="font-medium text-brand-700">PRO создан для того, чтобы подготовить вас к международному поиску профессионально.</p>
      </div>
      <section aria-labelledby="pro-approach">
        <h2 id="pro-approach" className="text-2xl font-semibold">Не просто рекомендации — мы готовим вместе с вами</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
          <p>В START вы получаете направление и можете двигаться дальше самостоятельно.</p>
          <p>В PRO мы идём значительно дальше.</p>
          <p>Мы работаем непосредственно над тем, что увидит международная школа:</p>
          <p className="rounded-2xl bg-brand-50 p-5 text-brand-600 sm:p-6">вашим CV → сопроводительным письмом → портфолио → LinkedIn → заявками → подготовкой к интервью.</p>
          <p>В результате у вас появляется не только понимание того, где искать работу, но и готовый профессиональный комплект для выхода на международный рынок.</p>
        </div>
      </section>
    </>
  );
}
