import type { Program } from "../../components/home/categories/programs";
import ProgramSection from "../../programs/components/program-section";

export default function PaymentIncludedSection({ program }: { program: Program }) {
  return (
    <ProgramSection id="payment-included" label="Состав программы" title={program.title.trim()}>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{program.inclusionLabel}</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {program.features.map((feature, index) => (
          <li key={feature} className="flex items-start gap-5 rounded-3xl border border-brand-100 bg-brand-50/50 p-6 sm:p-8">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-600 shadow-sm">{String(index + 1).padStart(2, "0")}</span>
            <p className="text-lg leading-relaxed text-neutral-700">{feature}</p>
          </li>
        ))}
      </ul>
      <p className="mt-7 text-lg font-medium leading-relaxed text-brand-600">{program.supportSummary}</p>
    </ProgramSection>
  );
}
