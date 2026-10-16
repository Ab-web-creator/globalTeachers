import { database } from "../consultation/database";
import type { Answers } from "../../app/consultation/components/form-fields";
import { emptyClientProfile } from "./profile-fields";
const emptyAnswers = emptyClientProfile();
import { countries } from "../../app/consultation/components/countries";
import { subjects, MAX_SUBJECTS } from "../../app/consultation/components/subjects";

export async function clientConsultationProfile(clientId: string): Promise<Answers> {
  const client = (await database().query("SELECT name,email,consultation_profile FROM private_clients WHERE id=$1", [clientId])).rows[0];
  if (!client) throw new Error("Клиент не найден.");
  const records = await database().query(
    `SELECT COALESCE(p.answers,c.answers,a.answers) AS answers FROM consultation_attempts a
      LEFT JOIN consultation_pending p ON p.id=a.id LEFT JOIN consultation_applications c ON c.id=a.id
      WHERE lower(a.email)=$1 ORDER BY a.submitted_at,a.id`, [client.email],
  );
  const answers = { ...emptyAnswers };
  for (const record of records.rows) for (const field of Object.keys(emptyAnswers) as (keyof Answers)[]) {
    const value = record.answers?.[field];
    if (typeof value === "string" && value.trim()) answers[field] = value;
  }
  for (const field of Object.keys(emptyAnswers) as (keyof Answers)[]) {
    if (typeof client.consultation_profile[field] === "string") answers[field] = client.consultation_profile[field];
  }
  return { ...answers, name: client.name, email: client.email };
}

export async function saveClientConsultationProfile(clientId: string, input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Проверьте данные анкеты.");
  const values = input as Record<string, unknown>;
  const answers = { ...emptyAnswers };
  for (const field of Object.keys(emptyAnswers) as (keyof Answers)[]) {
    if (field === "email") continue; // Identity changes require separate email verification.
    const value = values[field] ?? "";
    if (typeof value !== "string" || value.length > (field === "goals" ? 1500 : field === "subject" ? 1000 : 300)) throw new Error("Проверьте данные анкеты.");
    answers[field] = value.trim();
  }
  if (!answers.name) throw new Error("Укажите имя.");
  const options: Partial<Record<keyof Answers, readonly string[]>> = {
    country: countries,
    education: ["Среднее специальное", "Бакалавр", "Магистр", "Докторская степень", "Профессор"],
    english: ["Не говорю по-английски", "Базовый — могу общаться на простые темы", "Средний — могу поддерживать разговор", "Уверенный — могу работать на английском"],
    qualification: ["Есть BEd/MEd", "Есть QTS, PGCE", "Нет"],
    packagePreference: ["Start", "Pro", "VIP"],
  };
  for (const [field, allowed] of Object.entries(options)) {
    const value = answers[field as keyof Answers];
    if (value && !allowed.includes(value)) throw new Error("Выберите значения из списка.");
  }
  const selected = answers.subject ? answers.subject.split("; ") : [];
  if (selected.length > MAX_SUBJECTS || new Set(selected).size !== selected.length || !selected.every(subject => subjects.includes(subject))) throw new Error("Выберите не более трёх предметов из списка.");
  const { email: ignoredEmail, ...profile } = answers;
  void ignoredEmail;
  const saved = await database().query(
    "UPDATE private_clients SET name=$2,consultation_profile=$3 WHERE id=$1 AND active RETURNING id",
    [clientId, answers.name, JSON.stringify(profile)],
  );
  if (!saved.rowCount) throw new Error("Нет доступа к личной странице.");
  return clientConsultationProfile(clientId);
}
