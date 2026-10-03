import { recruitmentPlatforms } from "./content";
import PlatformCard from "./platform-card";
import PlatformsHeader from "./platforms-header";
import PlatformsBanner from "./platforms-banner";

const cardVisuals = [
  { background: "bg-brand-100", image: "/images/benefits/housing.jpg" },
  { background: "bg-accent-50", image: "/images/benefits/development.jpg" },
  { background: "bg-amber-50", image: "/images/benefits/education-classroom.jpg" },
  { background: "bg-rose-50", image: "/images/benefits/relocation.jpg" },
  { background: "bg-sky-50", image: "/images/benefits/flights.jpg" },
];

export default function RecruitmentPlatforms() {
  return (
    <section aria-labelledby="recruitment-platforms" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-br from-blue-900 via-brand-600 to-violet-900">
      <div className="mx-auto max-w-400 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-20">
        <PlatformsHeader />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8 xl:mt-12 xl:grid-cols-3">
          {recruitmentPlatforms.map((platform, index) => (
            <li key={platform.name} className="flex">
              <PlatformCard {...platform} {...cardVisuals[index]} />
            </li>
          ))}
          <li className="flex">
            <PlatformCard name="И другие" text={"Также стоит проверять платформы конкретных образова\u00ADтельных групп и сетей школ."} href="#vacancy-sources" background="bg-accent-200" ornament />
          </li>
        </ul>
        <PlatformsBanner />
      </div>
    </section>
  );
}
