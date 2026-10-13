import { database } from "./database";
import { emailConfig, sendEmail } from "./email";

const qualificationFollowupMarkdown = `Здравствуйте, {{NAME}}!

Благодарим вас за интерес к **TeacherNavigator** и за заполнение анкеты.

На основании ваших ответов мы видим, что у вас **нет педагогического образования или соответствующей преподавательской квалификации**.

## Почему это важно?

**Педагогическая квалификация — одно из ключевых требований международных школ.**

Большинство международных школ требуют профильного образования или признанной преподавательской квалификации. Во многих странах это также необходимо для получения разрешения на работу учителем.

Поэтому **без соответствующей квалификации возможности трудоустройства существенно ограничены**.

Однако это не означает, что путь к международной карьере для вас закрыт.

## С чего начать?

Прежде чем тратить время и деньги на дополнительное образование, важно понять:

- Какие педагогические квалификации признаются международными школами.
- Какие требования действуют в разных странах.
- Какие возможности доступны с вашим текущим образованием.
- Какие шаги необходимо предпринять для дальнейшего развития.

## Как мы можем помочь?

Для этого мы рекомендуем программу **TeacherNavigator START** — персональную консультацию, которая поможет определить вашу отправную точку и составить план дальнейших действий.

**В рамках программы мы:**

- Проанализируем ваше образование и профессиональный опыт.
- Разберём основные требования международных школ.
- Определим, какие квалификации или сертификаты могут вам потребоваться.
- Рассмотрим возможные направления профессионального развития.
- Составим **индивидуальный пошаговый план действий**.

Наша цель — помочь вам **избежать лишних затрат, распространённых ошибок и неоправданных ожиданий**.

После получения необходимой квалификации вы сможете вернуться к вопросу трудоустройства в международных школах.

## Ваш следующий шаг

**Узнать подробнее о программе START →**

{{START_URL}}

---

Благодарим за доверие и желаем успехов в профессиональном развитии!

С уважением,
**Команда TeacherNavigator**`;

export function qualificationFollowupContent(origin: string, name = "") {
  const firstName = name.replaceAll("*", "").trim().split(/\s+/)[0];
  const markdown = qualificationFollowupMarkdown.replace("{{NAME}}", firstName ? `, ${firstName}` : "")
    .replaceAll("{{START_URL}}", new URL("/programs/start", origin).href);
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const inline = (value: string) => escape(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/https?:\/\/[^\s<]+/g, '<a href="$&">$&</a>').replaceAll("\n", "<br>");
  const html = markdown.split("\n\n").map((block) => {
    if (block === "---") return "<hr>";
    if (block.startsWith("## ")) return `<h3>${inline(block.slice(3))}</h3>`;
    if (block.startsWith("- ")) return `<ul>${block.split("\n").map((item) => `<li>${inline(item.slice(2))}</li>`).join("")}</ul>`;
    return `<p>${inline(block)}</p>`;
  }).join("\n");
  const text = markdown.replaceAll("**", "").replace(/^## /gm, "").replace(/^- /gm, "• ").replace(/^---$/m, "—");
  return { text, html };
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
    const active = await database().query(`SELECT a.answers->>'name' AS name FROM consultation_qualification_followups f
      JOIN consultation_attempts a ON a.id = f.source_id
      WHERE f.email = $1 AND f.cancelled_at IS NULL AND a.answers->>'qualification' = 'Нет'
      ORDER BY a.id = $2 DESC, a.submitted_at DESC LIMIT 1`, [job.email, job.source_id]);
    if (!active.rowCount) return true;
    const { origin } = emailConfig();
    await sendEmail({ to: job.email, subject: "Ваш следующий шаг — программа START от TeacherNavigator", ...qualificationFollowupContent(origin, active.rows[0].name ?? "") }, `qualification-start-${job.id}`);
    await database().query("UPDATE consultation_qualification_followups SET sent_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
  } catch {
    await database().query("UPDATE consultation_qualification_followups SET lease_until = NULL, next_attempt_at = now() + interval '5 minutes' WHERE email = $1", [job.email]);
  }
  return true;
}
