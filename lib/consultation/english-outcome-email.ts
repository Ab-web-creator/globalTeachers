import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

const message = `Здравствуйте!

Благодарим вас за интерес к TeacherNavigator и за заполнение анкеты.
Указанный вами уровень английского языка пока не соответствует требованиям большинства международных школ.

**Английский язык** — одно из ключевых требований для международной карьеры. Учителям необходимо уверенно владеть им, чтобы проводить уроки, общаться с учениками, коллегами и родителями, вести документацию и проходить собеседования.
Как правило, требуется уровень B2–C1, в зависимости от школы, страны и преподаваемого предмета.

Помимо английского языка, важно иметь **педагогическую квалификацию**, подтверждающую право преподавать. Наличие высшего образования не всегда означает наличие такой квалификации, однако в некоторых случаях её можно получить дополнительно.

На данном этапе мы рекомендуем сосредоточиться на повышении уровня английского языка и проверке соответствия вашей квалификации требованиям международных школ. Поэтому полноценное сопровождение в поиске работы пока может быть преждевременным.

**Однако это не означает, что международная карьера для вас недоступна!**

**С чего начать?**

Мы предлагаем пакет START, который поможет вам заранее подготовиться к международной карьере.

В рамках пакета мы:
~ Оценим ваш опыт, квалификацию и профессиональные перспективы.
~ Разберём требования международных школ.
~ Определим подходящие страны и направления.
~ Подскажем, какие документы и навыки необходимо подготовить.
~ Составим индивидуальный план дальнейших действий.

**Наша цель** — помочь вам использовать время подготовки максимально эффективно, чтобы после повышения уровня английского языка вы могли уверенно приступить к поиску работы.

{{START_LINK}}

Благодарим за доверие и желаем успехов в профессиональном развитии!
С уважением,
Команда TeacherNavigator`;

export function englishOutcomeContent(origin: string) {
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

export async function deliverEnglishOutcomeEmail() {
  const claimed = await database().query(`UPDATE consultation_english_emails SET
    lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE id = (SELECT id FROM consultation_english_emails
      WHERE sent_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED)
    RETURNING id, email`);
  if (!claimed.rowCount) return false;
  const job = claimed.rows[0];
  try {
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваш английский и международная карьера — TeacherNavigator", ...englishOutcomeContent(origin) }, `english-outcome-${job.id}`);
    await database().query("UPDATE consultation_english_emails SET sent_at = now(), lease_until = NULL WHERE id = $1", [job.id]);
  } catch {
    await database().query("UPDATE consultation_english_emails SET lease_until = NULL, next_attempt_at = now() + interval '1 minute' WHERE id = $1", [job.id]);
  }
  return true;
}
