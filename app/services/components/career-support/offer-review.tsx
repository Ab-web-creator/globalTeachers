import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import LineIcon from "../line-icon";
import { offerConditions, offerReview } from "./content";
import { offerIcons, offerTones } from "./icons";

export default function OfferReview() {
  return (
    <section aria-labelledby="support-offer" className="grid items-center gap-10 pb-12 sm:pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-20">
      <div>
        <SectionLabel>Предложение школы</SectionLabel>
        <SectionHeading id="support-offer">Предложение от школы —<br />что дальше?</SectionHeading>
        {offerReview.intro.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <p className="mt-4 text-lg leading-relaxed text-brand-600">{offerReview.help}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:self-end">
        {offerConditions.map((condition, index) => (
          <li key={condition} className="flex items-center gap-3 rounded-2xl bg-brand-50/60 p-4">
            <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-full ${offerTones[index]}`}>
              <LineIcon path={offerIcons[index]} />
            </span>
            <span className="min-w-0 text-sm leading-snug text-neutral-700 first-letter:uppercase">{condition}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
