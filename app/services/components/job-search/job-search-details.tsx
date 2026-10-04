import JobSearchHero from "./job-search-hero";
import SearchGuide from "./search-guide";
import SearchSupport from "./search-support";

export default function JobSearchDetails() {
  return (
    <main className="bg-white text-brand-700">
      <article>
        <JobSearchHero />
        <div className="mx-auto max-w-400 space-y-16 px-6 py-12 sm:space-y-20 sm:px-10 sm:py-16 lg:space-y-24 lg:py-20 lg:px-16 xl:px-20">
          <SearchGuide />
          <SearchSupport />
        </div>
      </article>
    </main>
  );
}
