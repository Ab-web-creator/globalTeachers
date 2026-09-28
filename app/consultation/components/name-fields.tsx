import RequiredMark from "./required-mark";

export type TeacherName = { firstName: string; lastName: string };

const fields = [
  { name: "firstName", label: "Ваше имя", placeholder: "Анна", autoComplete: "given-name" },
  { name: "lastName", label: "Ваша фамилия", placeholder: "Иванова", autoComplete: "family-name" },
] as const;

export default function NameFields({ value, onChange }: { value: TeacherName; onChange: (value: TeacherName) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <label key={field.name} htmlFor={`consultation-${field.name}`} className="block text-sm font-medium">
          {field.label}<RequiredMark />
          <input id={`consultation-${field.name}`} name={field.name} autoComplete={field.autoComplete} value={value[field.name]} onChange={(event) => onChange({ ...value, [field.name]: event.target.value })} placeholder={field.placeholder} required pattern=".*\S.*" maxLength={100} className="mt-2 w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 focus:border-brand-500" />
        </label>
      ))}
    </div>
  );
}
