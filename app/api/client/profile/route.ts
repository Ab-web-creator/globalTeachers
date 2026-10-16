import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { clientFromSession, clientSessionCookie } from "../../../../lib/client-area/access";
import { privateJson, smallJson, actionError } from "../../../../lib/client-area/http";
import { saveClientConsultationProfile } from "../../../../lib/client-area/profile";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return privateJson({ error: "Forbidden" }, 403);
  try {
    const id = await clientFromSession(request.cookies.get(clientSessionCookie)?.value);
    if (!id) return privateJson({ error: "Нет доступа." }, 401);
    const input = await smallJson(request);
    return privateJson({ profile: await saveClientConsultationProfile(id, input?.profile) });
  } catch (error) {
    return privateJson({ error: actionError(error) }, 400);
  }
}
