import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

export function qualificationFollowupText(origin: string) {
  return `Здравствуйте!

Благодарим вас за интерес к TeacherNavigator и за заполнение анкеты.

Согласно указанной вами информации, у вас отсутствует педагогическое образование или соответствующий сертификат преподавателя.

Педагогическая квалификация является одним из основных требований для трудоустройства в международных школах. Практически все аккредитованные международные школы требуют её наличия, а во многих странах это также обязательное условие для получения разрешения на преподавание.

К сожалению, без соответствующей квалификации возможности трудоустройства существенно ограничены. Однако это не означает, что международная карьера для вас недоступна.

С чего начать?

Прежде чем инвестировать время и средства в получение дополнительного образования, важно разобраться, какие квалификации признаются международными школами, какие требования действуют в разных странах и какие возможности доступны именно вам.

Для этого мы рекомендуем нашу программу START — первый шаг к международной карьере.

В рамках программы мы:
Проанализируем ваше образование, опыт и профессиональные возможности.
Поможем разобраться в требованиях международных школ.
Определим, какие квалификации или сертификаты могут потребоваться.
Подскажем возможные направления профессионального развития.
Составим индивидуальный план дальнейших действий.

Наша цель — помочь вам избежать лишних затрат и ошибок, прежде чем вы начнёте путь к международной карьере.

После получения необходимой квалификации вы сможете вернуться к вопросу трудоустройства, а мы будем рады помочь вам на следующих этапах.

Узнать подробнее о программе START →
${new URL("/programs/start", origin).href}

Благодарим за доверие и желаем успехов в профессиональном развитии!
С уважением,
Команда TeacherNavigator`;
}

export async function deliverQualificationFollowup() {
  const result = await database().query(`UPDATE consultation_qualification_followups SET
      lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE email = (
      SELECT email FROM consultation_qualification_followups
      WHERE sent_at IS NULL AND cancelled_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED
    ) RETURNING id, email, source_id`);
  if (!result.rowCount) return false;
  const job = result.rows[0];
  try {
    const active = await database().query(`SELECT 1 FROM consultation_qualification_followups f
      JOIN consultation_attempts a ON a.id = f.source_id
      WHERE f.email = $1 AND f.cancelled_at IS NULL AND a.answers->>'qualification' = 'Нет'`, [job.email]);
    if (!active.rowCount) return true;
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваш следующий шаг — программа START от TeacherNavigator", text: qualificationFollowupText(origin) }, `qualification-start-${job.id}`);
    await database().query("UPDATE consultation_qualification_followups SET sent_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
  } catch {
    await database().query("UPDATE consultation_qualification_followups SET lease_until = NULL, next_attempt_at = now() + interval '5 minutes' WHERE email = $1", [job.email]);
  }
  return true;
}
