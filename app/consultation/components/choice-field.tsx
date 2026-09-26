type ChoiceFieldProps = {
  name: string;
  label: string;
  options: string[];
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
      <legend className="text-sm font-medium">{label}</legend>
      {multiple && <p className="mt-1 text-xs text-neutral-500">Можно выбрать несколько вариантов.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label key={option} className="cursor-pointer">
            <input type={multiple ? "checkbox" : "radio"} name={name} value={option} checked={multiple ? selected.includes(option) : value === option} required={multiple ? selected.length === 0 && index === 0 : true} onChange={() => choose(option)} className="peer sr-only" />
            <span className="block rounded-xl border border-brand-200 px-3 py-2 text-sm peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
