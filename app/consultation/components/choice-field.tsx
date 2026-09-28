import RequiredMark from "./required-mark";

type ChoiceFieldProps = {
  name: string;
  label: string;
  options: readonly (string | { value: string; label: string })[];
  value: string;
  multiple?: boolean;
  onChange: (value: string) => void;
};

export default function ChoiceField({ name, label, options, value, multiple = false, onChange }: ChoiceFieldProps) {
  const selected = value ? value.split("; ") : [];
  function choose(option: string) {
    if (!multiple) return onChange(option);
    onChange((selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]).join("; "));
  }
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}<RequiredMark /></legend>
      {multiple && <p className="mt-1 text-xs text-neutral-500">Можно выбрать несколько вариантов.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((item, index) => {
          const option = typeof item === "string" ? { value: item, label: item } : item;
          return (
          <label key={option.value} className="relative cursor-pointer">
            <input type={multiple ? "checkbox" : "radio"} name={name} value={option.value} checked={multiple ? selected.includes(option.value) : value === option.value} required={multiple ? selected.length === 0 && index === 0 : true} onChange={() => choose(option.value)} className="peer sr-only" />
            <span className="block rounded-xl border border-brand-200 px-3 py-2 text-sm peer-checked:border-brand-500 peer-checked:outline-1 peer-checked:-outline-offset-3 peer-checked:outline-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-600 peer-focus-visible:outline-1 peer-focus-visible:-outline-offset-3 peer-focus-visible:outline-brand-500">{option.label}</span>
          </label>
          );
        })}
      </div>
    </fieldset>
  );
}
