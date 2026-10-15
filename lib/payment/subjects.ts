import { subjects } from "../../app/consultation/components/subjects";
import { earlyEducationSubjects, languageSubjects } from "../../app/consultation/components/subject-notices";

export const paymentSubjects = subjects.filter((subject) => !earlyEducationSubjects.has(subject) && !languageSubjects.has(subject));

export function filterPaymentSubjects(value: string) {
  return value.split("; ").filter((subject) => paymentSubjects.includes(subject)).join("; ");
}
