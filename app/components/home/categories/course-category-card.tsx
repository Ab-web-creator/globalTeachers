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
    <li>
      <button onClick={() => openPanel("Courses")} className="group flex h-full w-full flex-col rounded-3xl bg-white p-6 text-left transition hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-7">
        <svg
          aria-hidden="true"
          viewBox={`${viewportX} ${y} ${viewportWidth} ${height}`}
          className="mx-auto mt-4 mb-8 block aspect-5/4 w-3/4 overflow-hidden"
        >
          <image href="/images/course-categories.png" width="1254" height="1254" />
        </svg>
        <span className="text-xl font-medium tracking-tight group-hover:text-brand-500 xl:text-xl">{title}</span>
        <span className="mt-3 text-base leading-relaxed text-neutral-600">{description}</span>
      </button>
    </li>
  );
}
