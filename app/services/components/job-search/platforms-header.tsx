export default function PlatformsHeader() {
  return (
    <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-10">
      <div>
        <p className="flex items-center gap-4 text-xs font-semibold tracking-widest text-white uppercase sm:text-sm">
          Полезные ресурсы
        </p>
        <h2 id="recruitment-platforms" className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl">
          Полезные платформы для поиска вакансий
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brand-200">
          Существует несколько веб-платформ, на которых международные школы из разных стран публикуют вакансии. Используйте их, чтобы найти позиции, которые соответствуют вашему опыту, предмету и желаемой стране.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <aside className="flex flex-1 gap-4 rounded-3xl bg-brand-300 p-6 lg:mb-1 xl:p-8" aria-label="Совет по поиску вакансий">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-200/40 text-brand-600">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7">
              <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Zm4 4v-7m-2-1 2 2 2-2M2 8H1m22 0h-1M5 2 4 1m15 1 1-1" />
            </svg>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-brand-950">Совет</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-800">Создайте профиль на нескольких платформах и настройте уведомления о новых вакансиях — так вы не пропустите подходящие возможности.</p>
          </div>
        </aside>
        <div aria-hidden="true" className="hidden w-28 shrink-0 -rotate-6 self-start text-center font-serif text-xl italic leading-snug text-brand-300 2xl:block">
          Больше возможностей для вашего будущего
          <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mt-2 w-20"><path d="M75 5C80 40 50 65 15 60m12-12L15 60l14 9" /></svg>
        </div>
      </div>
    </div>
  );
}
