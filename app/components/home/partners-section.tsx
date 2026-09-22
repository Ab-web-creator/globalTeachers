import SchoolCarousel from "./school-carousel";

export default function PartnersSection() {
  return (
    <section aria-labelledby="partners-title" className="mx-auto w-full max-w-400 px-6 pt-10 pb-16 sm:px-10 sm:pt-12 sm:pb-24 lg:px-16 xl:px-20">
      <h2 id="partners-title" className="text-center text-base font-normal text-neutral-600 sm:text-lg">
        Ведущие международные школы мира
      </h2>
      <SchoolCarousel />
    </section>
  );
}
