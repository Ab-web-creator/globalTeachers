import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

export function englishFollowupText(origin: string) {
  return `Здравствуйте!

Благодарим вас за интерес к TeacherNavigator и за заполнение анкеты.

Согласно указанной вами информации, ваш текущий уровень английского языка — начальный либо вы пока не владеете английским.

Знание английского языка является одним из ключевых требований для работы в международных школах.

Большинство международных школ используют английский как основной язык преподавания и профессионального общения. Учителям необходимо не только проводить уроки, но и взаимодействовать с коллегами, администрацией, учениками и родителями, а также участвовать в собеседованиях на английском языке.

Как правило, для успешного трудоустройства требуется уверенное владение английским языком, ориентировочно на уровне B2–C1, в зависимости от школы, страны и преподаваемого предмета.

К сожалению, с вашим текущим уровнем английского языка возможности трудоустройства существенно ограничены, поэтому на данном этапе мы не можем предложить вам услуги карьерного сопровождения.

Однако это не означает, что международная карьера для вас недоступна.

Мы рекомендуем сосредоточиться на повышении уровня английского языка и параллельно подготовиться к будущему выходу на международный рынок труда.

С чего начать?

Для этого мы предлагаем программу START — первый шаг к международной карьере.

В рамках программы мы:
Проанализируем ваше образование, педагогический опыт и профессиональные возможности.
Поможем разобраться в требованиях международных школ к уровню английского языка.
Определим страны и направления, наиболее подходящие вашей квалификации.
Подскажем, на какие профессиональные и языковые навыки стоит обратить внимание.
Составим индивидуальный план подготовки к международному трудоустройству.

Наша цель — помочь вам использовать время изучения английского языка максимально эффективно, чтобы к моменту достижения необходимого уровня вы были готовы к следующим этапам международной карьеры.

После повышения уровня английского языка вы сможете повторно обратиться к нам для оценки готовности к трудоустройству и выбора дальнейшей программы сопровождения.

Узнать подробнее о программе START →
${new URL("/programs/start", origin).href}

Благодарим за доверие и желаем успехов в профессиональном развитии!

С уважением,
Команда TeacherNavigator`;
}

export async function deliverEnglishFollowup() {
  const result = await database().query(`UPDATE consultation_english_followups SET
      lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE email = (
      SELECT email FROM consultation_english_followups
      WHERE sent_at IS NULL AND cancelled_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED
    ) RETURNING id, email, source_id`);
  if (!result.rowCount) return false;
  const job = result.rows[0];
  try {
    const active = await database().query(`SELECT 1 FROM consultation_english_followups f
      JOIN consultation_attempts a ON a.id = f.source_id
      WHERE f.email = $1 AND f.cancelled_at IS NULL AND a.answers->>'english' IN ('Не говорю по-английски', 'Базовый — могу общаться на простые темы')`, [job.email]);
    if (!active.rowCount) return true;
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваш английский и подготовка к международной карьере — TeacherNavigator", text: englishFollowupText(origin) }, `english-start-${job.id}`);
    await database().query("UPDATE consultation_english_followups SET sent_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
  } catch {
    await database().query("UPDATE consultation_english_followups SET lease_until = NULL, next_attempt_at = now() + interval '5 minutes' WHERE email = $1", [job.email]);
  }
  return true;
}
