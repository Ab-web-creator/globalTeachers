import SchoolCarousel from "./school-carousel";

export default function PartnersSection() {
  return (
    <section data-reveal aria-labelledby="partners-title" className="border-y border-brand-200 sm:border-y-0 lg:bg-linear-to-r lg:from-blue-50 lg:to-violet-100">
      <div className="mx-auto w-full max-w-400 px-6 py-6 sm:px-10 sm:pt-8 sm:pb-12 lg:py-5 xl:py-6 lg:px-16 xl:px-20">
        <h2 id="partners-title" className="text-center text-base font-normal text-neutral-600 sm:text-lg">
          Ведущие международные школы мира
        </h2>
        <SchoolCarousel />
      </div>
    </section>
  );
}
