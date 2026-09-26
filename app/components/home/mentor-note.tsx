import type { PanelProps } from "./content";
import MentorMessage from "./mentor-message";

export default function MentorNote({ openPanel }: PanelProps) {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-sky-100 via-blue-50 to-violet-100 px-6 py-10 sm:px-10 sm:py-12 lg:py-20 xl:py-24 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <MentorMessage openPanel={openPanel} />
      </div>
    </section>
  );
}
