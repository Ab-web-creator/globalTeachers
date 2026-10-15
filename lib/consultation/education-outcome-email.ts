import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

const message = `Здравствуйте!

Благодарим вас за интерес к TeacherNavigator и за заполнение анкеты!

Вы указали, что имеете среднее специальное образование.
Для трудоустройства учителем в большинстве международных школ требуется высшее образование — как минимум степень бакалавра. Это связано не только с требованиями самих школ, но и с условиями оформления рабочих виз во многих странах.

Помимо высшего образования, важно учитывать ещё два основных требования:
**Педагогическая квалификация.** Международные школы обычно требуют профильное педагогическое образование или признанную квалификацию, подтверждающую право преподавать.

**Английский язык.** Большинство международных школ используют английский как основной язык преподавания и профессионального общения. Учителю необходимо уверенно владеть языком, чтобы проводить уроки, общаться с коллегами, учениками и родителями, а также вести школьную документацию. Обычно требуется уровень B2–C1 в зависимости от школы и предмета.

С учётом указанных вами сведений об образовании на данном этапе мы пока не сможем предложить вам полноценное сопровождение в поиске работы.
**Однако это не означает, что международная карьера для вас закрыта.**

Если вы планируете получить высшее образование и хотите заранее подготовиться к работе за рубежом, мы рекомендуем рассмотреть пакет START.

В рамках консультации мы поможем вам:
~ Оценить ваш текущий опыт и сильные стороны.
~ Разобраться в требованиях международных школ.
~ Определить, какие квалификации, документы и навыки вам ещё понадобятся.
~ Составить пошаговый план подготовки, чтобы не терять время и последовательно двигаться к своей цели.

Отсутствие высшего образования сегодня не означает, что международная карьера для вас недоступна в будущем. Главное — понимать требования и заранее готовиться к ним.

{{START_LINK}}

Благодарим за доверие и желаем вам успехов в профессиональном развитии!
С уважением,
Команда TeacherNavigator`;

export function educationOutcomeContent(origin: string) {
  const link = new URL("/programs/start", origin).href;
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = message.split("\n\n").map((paragraph) => `<p>${escape(paragraph)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")
    .replace("{{START_LINK}}", `<a href="${escape(link)}">Узнать подробнее о пакете START →</a>`)}</p>`).join("\n");
  return {
    text: message.replace(/\*\*/g, "").replace("{{START_LINK}}", `Узнать подробнее о пакете START →\n${link}`),
    html,
  };
}

export async function deliverEducationOutcomeEmail() {
  const claimed = await database().query(`UPDATE consultation_education_emails SET
    lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE id = (SELECT id FROM consultation_education_emails
      WHERE sent_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED)
    RETURNING id, email`);
  if (!claimed.rowCount) return false;
  const job = claimed.rows[0];
  try {
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваше образование и международная карьера — TeacherNavigator", ...educationOutcomeContent(origin) }, `education-outcome-${job.id}`);
    await database().query("UPDATE consultation_education_emails SET sent_at = now(), lease_until = NULL WHERE id = $1", [job.id]);
  } catch {
    await database().query("UPDATE consultation_education_emails SET lease_until = NULL, next_attempt_at = now() + interval '1 minute' WHERE id = $1", [job.id]);
  }
  return true;
}
