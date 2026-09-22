import type { PanelProps } from "../content";
import CourseCategoryCard from "./course-category-card";

const categories = [
  {
    title: "Поиск работы за рубежом",
    description: "Где и как искать вакансии в международных школах.",
    imageBounds: [79, 43, 495, 535] as const,
  },
  {
    title: "CV и портфолио",
    description: "Профессиональная подача вашего опыта для международных школ.",
    imageBounds: [665, 81, 550, 496] as const,
  },
  {
    title: "Подготовка к интервью",
    description: "Вопросы, стратегии и практика перед собеседованием.",
    imageBounds: [63, 662, 508, 528] as const,
  },
  {
    title: "Карьерное сопровождение",
    description: "Поддержка от первого поиска до получения оффера.",
    imageBounds: [644, 693, 579, 493] as const,
  },
];

export default function CategoriesSection({ openPanel }: PanelProps) {
  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-brand-50">
      <div className="mx-auto max-w-400 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
        <header className="text-center">
          <p className="mb-6 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">КАК МЫ ПОМОГАЕМ</p>
          <h2 id="categories-title" className="text-5xl leading-tight font-semibold tracking-tight 2xl:text-6xl">Всё для вашей международной карьеры</h2>
        </header>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {categories.map((category) => <CourseCategoryCard key={category.title} {...category} openPanel={openPanel} />)}
        </ul>
      </div>
    </section>
  );
}
