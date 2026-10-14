import { database } from "../../../lib/consultation/database";
import { tokenHash } from "../../../lib/calls/server";
import CallSession from "../../components/calls/call-session";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Видеоконсультация",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } = await params;
  const result = /^[a-f0-9]{64}$/.test(token)
    ? await database().query(
        "SELECT id,name,expires_at FROM browser_calls WHERE token_hash=$1 AND expires_at>now()",
        [tokenHash(token)],
      )
    : null;
  const call = result?.rows[0];
  return (
    <main className="min-h-screen bg-white sm:bg-brand-50 sm:px-5 sm:py-12">
      {call ? (
        <CallSession
          id={call.id}
          token={token}
          name={call.name}
          expires={call.expires_at.toISOString()}
        />
      ) : (
        <p className="mx-auto max-w-3xl px-4 py-12 text-xl sm:p-0">
          Срок действия приглашения истёк или ссылка недействительна.
        </p>
      )}
    </main>
  );
}
