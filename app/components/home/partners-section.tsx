import { AndersonLogo, BreezyLogo, GoodwellLogo, LondonLogo, NatuskaLogo, RenaisansLogo } from "./partner-logos";

const partners = [
  { name: "London Architect", Logo: LondonLogo },
  { name: "Goodwell Industrial Supply", Logo: GoodwellLogo },
  { name: "Michael Anderson", Logo: AndersonLogo },
  { name: "Renaisans", Logo: RenaisansLogo },
  { name: "Natuska", Logo: NatuskaLogo },
  { name: "Breezy", Logo: BreezyLogo },
];

export default function PartnersSection() {
  return (
    <section aria-labelledby="partners-title" className="mx-auto w-full max-w-400 px-6 pt-10 pb-16 sm:px-10 sm:pt-12 sm:pb-24 lg:px-16 xl:px-20">
      <h2 id="partners-title" className="text-center text-base font-normal text-neutral-600 sm:text-lg">
        Collaborated with over 800+ trusted worldwide partners
      </h2>
      <ul className="mt-12 grid grid-cols-2 items-center gap-x-6 gap-y-10 text-[#89aab5] sm:mt-16 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
        {partners.map(({ name, Logo }) => (
          <li key={name} className="flex min-h-16 items-center justify-center">
            <span className="sr-only">{name}</span>
            <div aria-hidden="true"><Logo /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
