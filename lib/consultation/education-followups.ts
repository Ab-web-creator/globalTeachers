import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

export function educationFollowupText(origin: string) {
  return `Здравствуйте!

Благодарим вас за интерес к TeacherNavigator и за заполнение анкеты.

Вы указали среднее специальное образование как ваш самый высокий уровень образования.

Для многих преподавательских вакансий в международных школах требуется высшее образование, например степень бакалавра, а также педагогическая квалификация. Требования зависят от школы, страны и должности. Поэтому со средним специальным образованием выбор подходящих вакансий может быть ограничен.

Это не означает, что путь к международной карьере для вас закрыт. Прежде чем выбирать дополнительное образование, важно оценить ваш диплом, опыт преподавания и требования интересующих вас направлений.

С чего начать?

Рекомендуем программу START — первый шаг к международной карьере.

В рамках программы мы:
Проанализируем ваше образование и профессиональный опыт.
Поможем разобраться в требованиях международных школ.
Рассмотрим подходящие направления и возможные альтернативы.
Определим, какое дополнительное образование или педагогическая квалификация могут понадобиться.
Составим индивидуальный план дальнейших действий.

Наша цель — помочь вам принять обоснованное решение и избежать лишних затрат до начала поиска работы или обучения.

Узнать подробнее о программе START →
${new URL("/programs/start", origin).href}

Благодарим за доверие и будем рады помочь вам сделать следующий шаг!

С уважением,
Команда TeacherNavigator`;
}

export async function deliverEducationFollowup() {
  const result = await database().query(`UPDATE consultation_education_followups SET
      lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE email = (
      SELECT email FROM consultation_education_followups
      WHERE sent_at IS NULL AND cancelled_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED
    ) RETURNING id, email, source_id`);
  if (!result.rowCount) return false;
  const job = result.rows[0];
  try {
    const active = await database().query(`SELECT 1 FROM consultation_education_followups f
      JOIN consultation_attempts a ON a.id = f.source_id
      WHERE f.email = $1 AND f.cancelled_at IS NULL AND a.answers->>'education' = 'Среднее специальное'`, [job.email]);
    if (!active.rowCount) return true;
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваше образование и международная карьера — TeacherNavigator", text: educationFollowupText(origin) }, `education-start-${job.id}`);
    await database().query("UPDATE consultation_education_followups SET sent_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
  } catch {
    await database().query("UPDATE consultation_education_followups SET lease_until = NULL, next_attempt_at = now() + interval '5 minutes' WHERE email = $1", [job.email]);
  }
  return true;
}
