import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { findPaymentProfile, paymentProfileExists } from "../../../../lib/payment/profile";
import { requestProfileCode, verifyProfileCode } from "../../../../lib/payment/profile-verification";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers });
  if (!trustedRequestOrigin(request)) return reply({ error: "Недопустимый запрос." }, 403);
  let input;
  try {
    const body = await request.text();
    if (body.length > 1000) throw new Error();
    input = JSON.parse(body);
    if (!input || typeof input !== "object") throw new Error();
  } catch { return reply({ error: "Проверьте введённые данные." }, 400); }
  try {
    if (["check", "request"].includes(input.action) && typeof input.email === "string") {
      const email = input.email.trim().toLowerCase();
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: "Проверьте email." }, 400);
      const exists = await paymentProfileExists(email);
      if (input.action === "check" || !exists) return reply({ exists });
      const challenge = await requestProfileCode(email);
      return challenge ? reply({ challenge }) : reply({ error: "Повторный код можно запросить через минуту, не более пяти раз в час." }, 429);
    }
    if (input.action === "verify" && typeof input.challenge === "string" && /^[A-Za-z0-9_-]{43}$/.test(input.challenge)
      && typeof input.code === "string" && /^\d{6}$/.test(input.code)) {
      const email = await verifyProfileCode(input.challenge, input.code);
      if (!email) return reply({ error: "Код неверен или истёк. После пяти попыток нужно запросить новый код." }, 400);
      return reply({ profile: await findPaymentProfile(email) });
    }
    return reply({ error: "Проверьте введённые данные." }, 400);
  } catch { return reply({ error: "Не удалось загрузить данные. Попробуйте позже или заполните поля вручную." }, 503); }
}
