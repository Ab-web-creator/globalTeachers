import RequiredMark from "./required-mark";

type ChoiceFieldProps = {
  name: string;
  label: string;
  options: readonly (string | { value: string; label: string })[];
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export default function ChoiceField({ name, label, options, value, required = true, onChange }: ChoiceFieldProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}{required ? <RequiredMark /> : <span className="font-normal text-neutral-500"> (необязательно)</span>}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((item) => {
          const option = typeof item === "string" ? { value: item, label: item } : item;
          return (
          <label key={option.value} className="relative cursor-pointer">
            <input type="radio" name={name} value={option.value} checked={value === option.value} required={required} onChange={() => onChange(option.value)} className="peer sr-only" />
            <span className="block rounded-xl border border-brand-200 px-3 py-2 text-sm peer-checked:border-brand-500 peer-checked:text-brand-600 peer-focus-visible:underline peer-focus-visible:underline-offset-4">{option.label}</span>
            <span aria-hidden="true" className="pointer-events-none absolute inset-1 z-10 rounded-lg opacity-0 inset-ring-2 inset-ring-brand-500 peer-checked:opacity-100" />
          </label>
          );
        })}
      </div>
    </fieldset>
  );
}
