import { recruitmentPlatforms } from "./content";
import PlatformCard from "./platform-card";
import PlatformsHeader from "./platforms-header";

const cardVisuals = [
  { background: "bg-linear-to-br from-brand-300 to-violet-100", image: "/images/benefits/housing.jpg" },
  { background: "bg-linear-to-br from-accent-200 to-teal-50", image: "/images/benefits/development.jpg" },
  { background: "bg-linear-to-br from-amber-200 to-orange-50", image: "/images/benefits/education-classroom.jpg" },
  { background: "bg-linear-to-br from-rose-200 to-pink-50", image: "/images/benefits/relocation.jpg" },
  { background: "bg-linear-to-br from-sky-200 to-indigo-50", image: "/images/benefits/flights.jpg" },
];

export default function RecruitmentPlatforms() {
  return (
    <section aria-labelledby="recruitment-platforms" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-t from-violet-50 via-sky-50/60 to-transparent py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <PlatformsHeader />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8 xl:mt-12 xl:grid-cols-3">
          {recruitmentPlatforms.map((platform, index) => (
            <li key={platform.name} className="flex">
              <PlatformCard {...platform} {...cardVisuals[index]} />
            </li>
          ))}
          <li className="flex">
            <PlatformCard name="И другие" text={"Также стоит проверять платформы конкретных образова\u00ADтельных групп и сетей школ."} background="bg-linear-to-br from-accent-300 to-accent-100" ornament />
          </li>
        </ul>
      </div>
    </section>
  );
}
