import ProgramSection from "../components/program-section";
import { important } from "./content";

export default function VipImportant() {
  return (
    <ProgramSection id="vip-important" label="О главном" title="Что важно знать о программе VIP">
      <div className="max-w-2xl">
        {important.paragraphs.map((text) => (
          <p key={text} className="mt-7 text-lg leading-relaxed text-neutral-600">
            {text.split("\n").map((line, index) => (
              <span key={line}>
                {index > 0 && <><br className="hidden xl:block" /><span className="xl:hidden"> </span></>}
                {line}
              </span>
            ))}
          </p>
        ))}
        <p className="mt-6 text-lg font-semibold leading-relaxed text-neutral-600">
          {important.closing.split("\n").map((line, index) => (
            <span key={line}>
              {index > 0 && <><br className="hidden xl:block" /><span className="xl:hidden"> </span></>}
              {line}
            </span>
          ))}
        </p>
        <p className="mt-6 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{important.note}</p>
      </div>
    </ProgramSection>
  );
}
