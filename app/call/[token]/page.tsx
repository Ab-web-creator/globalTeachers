import { translateMetadata } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/server";
import { cookies } from "next/headers";
import { adminCallAllowed, appointmentCallAllowed } from "../../../lib/client-area/appointment-call";
import { clientSessionCookie } from "../../../lib/client-area/access";
import { database } from "../../../lib/consultation/database";
import { tokenHash } from "../../../lib/calls/server";
import CallSession from "../../components/calls/call-session";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  return translateMetadata({
    title: "Видеоконсультация",
    robots: { index: false, follow: false },
    referrer: "no-referrer" as const,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const t = await getTranslations();
  const { token } = await params;
  const result = /^[a-f0-9]{64}$/.test(token)
    ? await database().query(
        "SELECT id,name,expires_at,appointment_slot_id,admin_client_id FROM browser_calls WHERE token_hash=$1 AND expires_at>now()",
        [tokenHash(token)],
      )
    : null;
  let call = result?.rows[0];
  if (call?.appointment_slot_id && !await appointmentCallAllowed(call.appointment_slot_id, (await cookies()).get(clientSessionCookie)?.value)) call = null;
  if (call?.admin_client_id && !await adminCallAllowed(call.admin_client_id, (await cookies()).get(clientSessionCookie)?.value)) call = null;
  return (
    <main className="min-h-dvh bg-white sm:bg-brand-50 sm:px-5 sm:py-12">
      {call ? (
        <CallSession
          id={call.id}
          token={token}
          name={call.name}
          expires={call.expires_at.toISOString()}
        />
      ) : (
        <p className="mx-auto max-w-3xl px-4 py-12 text-xl sm:p-0">
          {t("call.token.page.message0002")}</p>
      )}
    </main>
  );
}
