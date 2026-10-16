import { NextResponse, type NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import {
  clientSessionCookie,
  clientSessionLifetime,
  endClientSession,
  exchangeClientKey,
} from "../../../../lib/client-area/access";
import { privateJson, smallJson } from "../../../../lib/client-area/http";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  let input;
  try {
    input = await smallJson(request);
  } catch {
    return privateJson({ error: "Invalid request" }, 400);
  }
  try {
    if (input?.action === "logout") {
      await endClientSession(request.cookies.get(clientSessionCookie)?.value);
      const response = NextResponse.json(
        { ok: true },
        { headers: { "Cache-Control": "no-store" } },
      );
      response.cookies.set(clientSessionCookie, "", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
    const session = await exchangeClientKey(input?.key);
    if (!session)
      return privateJson(
        {
          error:
            "Ссылка недействительна. Используйте ключ из письма-приглашения.",
        },
        401,
      );
    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(clientSessionCookie, session, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: clientSessionLifetime,
    });
    return response;
  } catch {
    return privateJson({ error: "Не удалось войти. Попробуйте ещё раз." }, 503);
  }
}
