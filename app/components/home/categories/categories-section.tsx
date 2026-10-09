import { ServiceCategoryHoverArt, ServiceCategoryIllustration } from "@/app/components/svg";
import Link from "next/link";
import { services } from "../../../services/services";

type CourseCategoryCardProps = {
  slug: string;
  title: string;
  description: string;
  imageBounds: readonly [
    number,
    number,
    number,
    number
  ];
};

export default function CategoriesSection() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-16 bg-linear-to-br from-sky-100 via-violet-100 to-pink-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <header data-reveal className="text-left sm:text-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">КАК МЫ ПОМОГАЕМ</p>
          <h2 id="categories-title" className="text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">Всё для вашей международной
            <br />
            карьеры</h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-normal text-neutral-600 sm:text-lg">
            Мы сопровождаем педагогов от поиска подходящей вакансии до успешного переезда и начала работы за рубежом. Все необходимые услуги — в одном месте.
          </p>
        </header>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((category) => <CourseCategoryCard key={category.title} {...category} />)}
        </ul>
      </div>
    </section>
  );
}

function CourseCategoryCard({ title, description, imageBounds, slug }: CourseCategoryCardProps) {
  return (
    <li data-reveal>
      <Link href={`/services/${slug}`} className="group flex h-full w-full flex-row items-start gap-3 rounded-3xl bg-white px-4 py-4 text-left transition hover:shadow-lg sm:flex-col sm:items-stretch sm:gap-0 sm:px-7 sm:py-5">
        <ServiceCategoryIllustration bounds={imageBounds} className="mt-2 block aspect-5/4 w-1/4 shrink-0 overflow-hidden sm:mx-auto sm:mb-5 sm:w-3/4">
          <ServiceCategoryHoverArt slug={slug} />
        </ServiceCategoryIllustration>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-medium tracking-tight group-hover:text-brand-500">{title}</span>
          <span className="mt-2 text-base leading-normal text-neutral-600">{description}</span>
        </span>
      </Link>
    </li>
  );
}
