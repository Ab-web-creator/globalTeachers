export default function ClientWelcomeSection({
  name,
}: {
  name: string;
}) {
  return (
    <section className="relative mb-10 py-4 sm:py-6">
      <header className="min-w-0">
        <h1 className="font-serif text-4xl leading-tight text-brand-950 sm:text-5xl">
          Здравствуйте, <span className="text-brand-500">{name}!</span>
        </h1>
        <p className="mt-7 max-w-[50ch] text-base leading-relaxed text-neutral-600">
          Добро пожаловать на вашу личную страницу. Здесь вы можете общаться с
          нами и выбирать время для консультаций.
        </p>
        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-linear-to-r from-brand-400 to-transparent"
        />
      </header>
    </section>
  );
}
