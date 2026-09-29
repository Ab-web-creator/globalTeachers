import type { Answers } from "./form-fields";
import { MAX_SUBJECTS } from "./subjects";

const requiredMessages: Record<string, string> = {
  firstName: "Укажите ваше имя.",
  lastName: "Укажите вашу фамилию.",
  country: "Выберите страну проживания.",
  email: "Укажите ваш email.",
  qualification: "Выберите вариант ответа о педагогической квалификации.",
  experience: "Выберите ваш педагогический стаж.",
  education: "Выберите ваше образование.",
  international: "Укажите, есть ли у вас опыт работы в международной школе.",
  english: "Выберите ваш уровень английского.",
  timing: "Выберите, когда вы готовы начать работу.",
  priority: "Выберите ваш главный приоритет.",
};

export function validateStep(form: HTMLFormElement, field: keyof Answers, answers: Answers): { field: string; message: string } | null {
  if (field === "subject" && !answers.subject) return { field, message: "Выберите хотя бы один предмет." };
  if (field === "subject" && answers.subject.split("; ").length > MAX_SUBJECTS) return { field, message: `Выберите не более ${MAX_SUBJECTS} предметов.` };
  if (field === "destinations" && !answers.destinations) return { field, message: "Выберите хотя бы один регион." };
  if (field === "email" && answers.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())) {
    return { field, message: "Укажите корректный email, например name@example.com." };
  }

  const controls = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
  const invalid = Array.from(controls).find((control) => control.willValidate && !control.validity.valid);
  if (!invalid) return null;
  if (invalid.validity.valueMissing || invalid.validity.patternMismatch) {
    return { field: invalid.name, message: requiredMessages[invalid.name] ?? "Заполните это поле." };
  }
  if (invalid.name === "email") return { field: invalid.name, message: "Укажите корректный email, например name@example.com." };
  if (invalid.validity.tooLong) return { field: invalid.name, message: "Сократите текст до допустимой длины." };
  return { field: invalid.name, message: "Проверьте введённые данные." };
}
