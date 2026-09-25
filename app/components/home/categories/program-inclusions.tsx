import type { Program } from "./programs";

export default function ProgramInclusions({ program, detailed = false }: { program: Program; detailed?: boolean }) {
  return (
    <div className="mt-3">
      <p className="text-base lg:text-sm font-semibold text-brand-500">{program.inclusionLabel}</p>
      <p className="mt-1 text-base lg:text-xs leading-normal text-neutral-600">{program.supportSummary}</p>
      {detailed && program.inheritedServices.length > 0 && (
        <div className="mt-3">
          <p className="text-base lg:text-sm font-medium text-neutral-900">Уже включено из предыдущих программ:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base lg:text-sm text-neutral-600">
            {program.inheritedServices.map((service) => <li key={service}>{service}</li>)}
          </ul>
          <p className="mt-3 text-base lg:text-sm font-medium text-neutral-900">Дополнения и расширенные возможности:</p>
        </div>
      )}
    </div>
  );
}
