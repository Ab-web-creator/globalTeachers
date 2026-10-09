import { offerReviewIconPaths, offerReviewIconTones, StrokeIcon } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { offerConditions, offerReview } from "./content";

export default function OfferReview() {
  return (
    <section aria-labelledby="support-offer" className="grid items-center gap-10 lg:grid-cols-5 lg:gap-10 py-12 sm:py-16 lg:py-20">
      <div className="w-full min-w-0 max-w-xl lg:col-span-2">
        <SectionLabel>Предложение школы</SectionLabel>
        <SectionHeading id="support-offer">Предложение от школы —<br />что дальше?</SectionHeading>
        {offerReview.intro.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{offerReview.help}</p>
      </div>
      <ul className="grid grid-cols-3 gap-3 lg:col-span-3 lg:self-end">
        {offerConditions.map((condition, index) => (
          <li key={condition} className="flex items-center gap-3 rounded-2xl bg-brand-50/60 p-4">
            <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-full ${offerReviewIconTones[index]}`}>
              <StrokeIcon path={offerReviewIconPaths[index]} />
            </span>
            <span className="min-w-0 text-base font-bold leading-snug text-neutral-700 first-letter:uppercase">{condition}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
