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
      <button onClick={() => openPanel("Courses")} className="group flex h-full w-full flex-col rounded-3xl bg-white px-6 py-4 text-left transition hover:shadow-lg motion-safe:hover:-translate-y-1 sm:px-7 sm:py-5">
        <svg
          aria-hidden="true"
          viewBox={`${viewportX} ${y} ${viewportWidth} ${height}`}
          className="mx-auto mt-2 mb-5 block aspect-5/4 w-3/4 overflow-hidden"
        >
          <image href="/images/course-categories-colorful.png" width="1254" height="1254" />
        </svg>
        <span className="text-xl font-medium tracking-tight group-hover:text-brand-500 xl:text-xl">{title}</span>
        <span className="mt-2 text-base leading-normal text-neutral-600">{description}</span>
      </button>
    </li>
  );
}
