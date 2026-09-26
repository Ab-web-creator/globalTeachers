import Link from "next/link";
import ServiceIllustration from "../../service-illustration";

type CourseCategoryCardProps = {
  slug: string;
  title: string;
  description: string;
  imageBounds: readonly [number, number, number, number];
};

export default function CourseCategoryCard({ title, description, imageBounds, slug }: CourseCategoryCardProps) {
  return (
    <li data-reveal>
      <Link href={`/services/${slug}`} className="group flex h-full w-full flex-row items-center gap-3 rounded-3xl bg-white px-4 py-4 text-left transition hover:shadow-lg motion-safe:hover:-translate-y-1 sm:flex-col sm:items-stretch sm:gap-0 sm:px-7 sm:py-5">
        <ServiceIllustration bounds={imageBounds} className="block aspect-5/4 w-1/4 shrink-0 overflow-hidden sm:mx-auto sm:mt-2 sm:mb-5 sm:w-3/4" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-lg font-medium tracking-tight group-hover:text-brand-500 sm:text-xl">{title}</span>
          <span className="mt-2 text-base leading-normal text-neutral-600">{description}</span>
        </span>
      </Link>
    </li>
  );
}
