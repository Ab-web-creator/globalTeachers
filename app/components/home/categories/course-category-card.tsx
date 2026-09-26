import type { PanelProps } from "../content";

type CourseCategoryCardProps = PanelProps & {
  title: string;
  description: string;
  imageBounds: readonly [number, number, number, number];
};

export default function CourseCategoryCard({ title, description, imageBounds, openPanel }: CourseCategoryCardProps) {
  const [x, y, width, height] = imageBounds;
  const viewportWidth = height * 1.25;
  const viewportX = x + (width - viewportWidth) / 2;

  return (
    <li data-reveal>
      <button onClick={() => openPanel("Courses")} className="group flex h-full w-full flex-row items-center gap-3 rounded-3xl bg-white px-4 py-4 text-left transition hover:shadow-lg motion-safe:hover:-translate-y-1 sm:flex-col sm:items-stretch sm:gap-0 sm:px-7 sm:py-5">
        <svg
          aria-hidden="true"
          viewBox={`${viewportX} ${y} ${viewportWidth} ${height}`}
          className="block aspect-5/4 w-1/3 shrink-0 overflow-hidden sm:mx-auto sm:mt-2 sm:mb-5 sm:w-3/4"
        >
          <image href="/images/course-categories-four-colors.png" width="1254" height="1254" />
        </svg>
        <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xl font-medium tracking-tight group-hover:text-brand-500 xl:text-xl">{title}</span>
        <span className="mt-2 text-base leading-normal text-neutral-600">{description}</span>
        </span>
      </button>
    </li>
  );
}
