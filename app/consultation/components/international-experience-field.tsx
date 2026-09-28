import ChoiceField from "./choice-field";

const options = [
  { value: "Да", label: "Да, есть такой опыт" },
  { value: "Нет", label: "Нет, пока нет такого опыта" },
];

export default function InternationalExperienceField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <ChoiceField name="international" label="Есть ли у вас опыт работы в международной школе?" options={options} value={value} onChange={onChange} />;
}
