import type { PanelProps } from "../content";
import CourseCategoryCard from "./course-category-card";

const categories = [
  { title: "Business Marketing", position: "0% 0%" },
  { title: "Digital Marketing", position: "100% 0%" },
  { title: "Software & IT", position: "0% 100%" },
  { title: "General Knowledge", position: "100% 100%" },
];

export default function CategoriesSection({ openPanel }: PanelProps) {
  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-brand-50">
      <div className="mx-auto max-w-400 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24 xl:px-20">
        <header className="text-center">
          <p className="mb-6 text-sm font-semibold tracking-widest text-brand-500 sm:text-base">CATEGORY</p>
          <h2 id="categories-title" className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl xl:text-6xl">Explore Course Categories</h2>
        </header>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {categories.map((category) => <CourseCategoryCard key={category.title} {...category} openPanel={openPanel} />)}
        </ul>
      </div>
    </section>
  );
}
