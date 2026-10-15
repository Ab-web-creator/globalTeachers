import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { saveDraft } from "../../../../lib/consultation/drafts";

import { sendOutcomeVerification } from "../../../../lib/consultation/outcome-verification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!trustedRequestOrigin(request)) return new Response("Forbidden", { status: 403 });
  let input;
  try {
    const body = await request.text();
    if (body.length > 20000) throw new Error("Too large");
    input = JSON.parse(body);
  } catch { return new Response("Invalid draft", { status: 400 }); }
  try {
    const saved = await saveDraft(input);
    if (["not-enough-education", "not-enough-english"].includes(input.outcome) && input.requestVerification !== false) await sendOutcomeVerification(saved.rows[0].id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Verification cooldown") return new Response("Подождите минуту перед повторной отправкой.", { status: 429 });
    const invalid = error instanceof Error && ['Invalid draft', 'Empty draft'].includes(error.message);
    return new Response(invalid ? "Invalid draft" : "Draft unavailable", { status: invalid ? 400 : 503 });
  }
}
