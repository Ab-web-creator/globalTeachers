export default function ClientWelcomeSection({
  name,
}: {
  name: string;
}) {
  return (
    <section className="relative mb-10 py-4 sm:py-6">
      <header className="min-w-0">
        <h1 className="font-serif text-4xl leading-tight text-brand-950 sm:text-5xl">
          Здравствуйте, <span data-profile-name className="text-brand-500">{name}!</span>
        </h1>
        <p className="mt-7 w-full text-base leading-relaxed text-neutral-600 lg:w-[calc((100%-1.5rem)/2)]">
          Добро пожаловать на вашу личную страницу. Здесь вы можете общаться с
          нами и выбирать время для консультаций. Страница и переписка доступны
          вам по вашему персональному ключу. Пожалуйста, не передавайте ссылку
          другим людям и сохраните письмо с ключом.
        </p>
      </header>
    </section>
  );
}
