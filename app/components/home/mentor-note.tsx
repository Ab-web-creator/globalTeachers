import MentorMessage from "./mentor-message";
import MentorPortrait from "./mentor-portrait";

export default function MentorNote() {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-sky-100 via-blue-50 to-violet-100 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <MentorPortrait />
        <div className="order-first lg:order-none">
          <MentorMessage />
        </div>
      </div>
    </section>
  );
}
