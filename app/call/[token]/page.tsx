import { database } from "../../../lib/consultation/database";
import { tokenHash } from "../../../lib/calls/server";
import CallRoom from "../../components/calls/call-room";
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
    <main className="min-h-screen bg-brand-50 px-5 py-12">
      {call ? (
        <CallRoom
          id={call.id}
          token={token}
          name={call.name}
          expires={call.expires_at.toISOString()}
        />
      ) : (
        <p className="mx-auto max-w-3xl text-xl">
          Срок действия приглашения истёк или ссылка недействительна.
        </p>
      )}
    </main>
  );
}
