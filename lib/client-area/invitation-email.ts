import { hashToken } from "../consultation/token";

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function invitationAccessLink(
  body: string,
  keyHash: string,
  origin: string,
) {
  for (const match of body.matchAll(
    /https?:\/\/[^\s]+\/client#([A-Za-z0-9_-]{43})(?![A-Za-z0-9_-])/g,
  )) {
    if (hashToken(match[1]) === keyHash)
      return `${new URL(origin).origin}/client#${match[1]}`;
  }
  throw new Error("Персональная ссылка в приглашении не найдена.");
}

/** Email-safe tables and inline styles; keep the original text as the plain-text alternative. */
export function invitationEmailHtml(
  body: string,
  keyHash: string,
  origin: string,
) {
  const link = invitationAccessLink(body, keyHash, origin);
  const paragraphs = body
    .split(/\n\n+/)
    .map((paragraph, index) => {
      if (/https?:\/\/[^\s]+\/client#[A-Za-z0-9_-]{43}/.test(paragraph)) {
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e5e2fa;border-radius:16px;background:#f7f6ff;"><tr><td style="padding:24px;">
        <p style="margin:0 0 8px;color:#5750cf;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Ваш персональный ключ</p>
        <p style="margin:0 0 20px;color:#555365;font-size:15px;line-height:1.6;">Сохраните эту ссылку — она открывает вашу личную страницу.</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#5750cf" style="border-radius:12px;"><a href="${escape(link)}" style="display:inline-block;padding:15px 22px;border:1px solid #5750cf;border-radius:12px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;">Открыть личную страницу →</a></td></tr></table>
        <p style="margin:20px 0 6px;color:#777483;font-size:12px;">Ссылка для сохранения или ручного копирования:</p>
        <p style="margin:0;word-break:break-all;overflow-wrap:anywhere;"><a href="${escape(link)}" style="color:#5750cf;font-family:monospace;font-size:12px;line-height:1.8;text-decoration:underline;">${escape(link)}</a></p>
      </td></tr></table>`;
      }
      const safe = escape(paragraph).replace(/\n/g, "<br>");
      return `<p style="margin:0 0 ${index === 0 ? 20 : 16}px;color:${index === 0 ? "#242134" : "#555365"};font-size:${index === 0 ? 23 : 16}px;font-weight:${index === 0 ? 700 : 400};line-height:1.7;">${safe}</p>`;
    })
    .join("\n");
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ваша личная страница TeacherNavigator</title></head>
  <body style="margin:0;padding:0;background:#f5f5fa;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;">Ваш личный чат, консультации и персональный ключ доступа.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f5fa"><tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        <tr><td style="padding:0 8px 24px;"><span style="color:#5750cf;font-size:22px;font-weight:700;letter-spacing:-0.5px;">TeacherNavigator</span><p style="margin:6px 0 0;color:#898597;font-size:12px;">Ваш следующий шаг к международной карьере</p></td></tr>
        <tr><td bgcolor="#ffffff" style="padding:28px 24px;border:1px solid #e9e7f2;border-radius:20px;">
          <p style="margin:0 0 20px;color:#5750cf;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Ваша личная страница готова</p>
          ${paragraphs}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid #eeedf5;"><tr><td style="padding-top:20px;color:#898597;font-size:13px;line-height:1.7;">Хотите сохранить ключ у себя на компьютере — например, в заметках или менеджере паролей? Откройте личную страницу, нажмите «Скопировать ключ» и вставьте его в нужное приложение.</td></tr></table>
        </td></tr>
        <tr><td align="center" style="padding:20px 12px;color:#9691a3;font-size:12px;line-height:1.7;">Персональное приглашение TeacherNavigator.<br>Храните ключ в безопасности и не передавайте другим людям.</td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

export function personalInvitationBody(name: string, link: string) {
  return `Здравствуйте, ${name}!\n\nМы создали вашу личную страницу на платформе TeacherNavigator.\n\nВаш персональный ключ — ссылка ниже:\n${link}\n\nПожалуйста, сохраните это письмо и не пересылайте ссылку другим людям. Это ваш единственный способ входа на личную страницу. Любой, у кого есть эта ссылка, сможет войти от вашего имени.\n\nСтраница доступна только вам по этой ссылке и администратору TeacherNavigator. Здесь вы сможете конфиденциально общаться с нами в чате и записываться на консультации в рамках доступных часов вашего пакета. Доступное время открывает администратор.\n\nС уважением,\nКоманда TeacherNavigator`;
}
