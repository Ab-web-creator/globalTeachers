import type { PanelProps } from "../content";

type CourseCategoryCardProps = PanelProps & { title: string; position: string };

export default function CourseCategoryCard({ title, position, openPanel }: CourseCategoryCardProps) {
  return (
    <li>
      <button onClick={() => openPanel("Courses")} className="group flex h-full w-full flex-col rounded-3xl bg-white p-6 text-left transition hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-7">
        <span aria-hidden="true" className="mb-8 block aspect-square w-full bg-no-repeat" style={{ backgroundImage: "url('/images/course-categories.png')", backgroundSize: "200% 200%", backgroundPosition: position }} />
        <span className="mt-auto text-xl font-medium tracking-tight group-hover:text-brand-500 xl:text-2xl">{title}</span>
      </button>
    </li>
  );
}
