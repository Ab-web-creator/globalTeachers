import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { saveDraft } from "../../../../lib/consultation/drafts";

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
    await saveDraft(input);
    return new Response(null, { status: 204 });
  } catch (error) {
    const invalid = error instanceof Error && ['Invalid draft', 'Empty draft'].includes(error.message);
    return new Response(invalid ? "Invalid draft" : "Draft unavailable", { status: invalid ? 400 : 503 });
  }
}
