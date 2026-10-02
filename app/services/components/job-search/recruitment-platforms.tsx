import { recruitmentPlatforms, recruitmentPlatformsIntroduction } from "./content";

export default function RecruitmentPlatforms() {
  return (
    <section aria-labelledby="recruitment-platforms">
      <h2 id="recruitment-platforms" className="max-w-2xl text-lg font-normal leading-relaxed text-neutral-600 sm:text-xl">{recruitmentPlatformsIntroduction}</h2>
      <ul className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {recruitmentPlatforms.map(({ name, text, href, logo, logoClass }) => (
          <li key={name} className="flex">
            <a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full w-full overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50">
              <span className="flex min-w-0 flex-1 flex-col justify-center px-6 py-5">
                <span className="block text-lg font-semibold tracking-tight">{name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-neutral-600">{text}</span>
              </span>
              <span className="flex w-2/5 shrink-0 items-center justify-center border-l border-brand-100 px-6 group-hover:border-brand-200">
                <img src={logo} alt="" className={`w-auto max-w-full object-contain ${logoClass}`} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
