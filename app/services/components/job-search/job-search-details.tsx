import JobSearchHero from "./job-search-hero";
import SearchGuide from "./search-guide";

export default function JobSearchDetails() {
  return (
    <main className="bg-white text-brand-700">
      <article>
        <JobSearchHero />
        <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
          <SearchGuide />
        </div>
      </article>
    </main>
  );
}
