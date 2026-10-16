import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { savePaymentCase } from "../../../../lib/payment/cases";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const reply = (body: object, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (!trustedRequestOrigin(request))
    return reply({ error: "Недопустимый запрос." }, 403);
  try {
    const text = await request.text();
    if (text.length > 6000)
      return reply({ error: "Слишком большой запрос." }, 413);
    return reply(await savePaymentCase(JSON.parse(text)));
  } catch (error) {
    return reply(
      {
        error:
          error instanceof Error && !("code" in error)
            ? error.message
            : "Не удалось сохранить заявку. Попробуйте ещё раз.",
      },
      400,
    );
  }
}
