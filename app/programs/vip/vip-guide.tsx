import { preparationSections } from "./preparation-content";
import { supportSections } from "./support-content";

export default function VipGuide() {
  return (
    <>
      {[...preparationSections, ...supportSections].map(({ title, paragraphs, items, closing }, index) => (
        <section key={title} aria-labelledby={`vip-section-${index}`}>
          <h2 id={`vip-section-${index}`} className="text-2xl font-semibold">{title}</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
            {paragraphs.map((text) => <p key={text}>{text}</p>)}
            {items && <ul className="list-disc space-y-2 pl-5 marker:text-neutral-300">
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>}
            {closing?.map((text) => <p key={text}>{text}</p>)}
          </div>
        </section>
      ))}
    </>
  );
}
