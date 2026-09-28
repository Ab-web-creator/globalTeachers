import RequiredMark from "./required-mark";

type RadioFieldProps = {
  name: string;
  label: string;
  options: readonly (string | { value: string; label: string })[];
  value: string;
  onChange: (value: string) => void;
};

export default function RadioField({ name, label, options, value, onChange }: RadioFieldProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}<RequiredMark /></legend>
      <div className="mt-3 space-y-3">
        {options.map((item) => {
          const option = typeof item === "string" ? { value: item, label: item } : item;
          return (
            <label key={option.value} className={`flex cursor-pointer items-start gap-3 text-sm leading-relaxed transition-colors ${value === option.value ? "text-brand-600" : "hover:text-brand-600"}`}>
              <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} required className="mt-0.5 size-5 shrink-0 accent-brand-500" />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
