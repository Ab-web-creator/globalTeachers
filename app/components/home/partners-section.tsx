import SchoolCarousel from "./school-carousel";

export default function PartnersSection() {
  return (
    <section data-reveal aria-labelledby="partners-title" className="mx-auto w-full max-w-400 border-y border-brand-200 px-6 py-6 sm:border-y-0 sm:px-10 sm:pt-8 sm:pb-12 lg:py-20 xl:py-24 lg:px-16 xl:px-20">
      <h2 id="partners-title" className="text-center text-base font-normal text-neutral-600 sm:text-lg">
        Ведущие международные школы мира
      </h2>
      <SchoolCarousel />
    </section>
  );
}
