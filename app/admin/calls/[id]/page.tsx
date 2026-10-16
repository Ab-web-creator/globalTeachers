import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { validSession, sessionCookie } from "../../../../lib/admin/session";
import { database } from "../../../../lib/consultation/database";
import { findCall } from "../../../../lib/calls/server";
import CallSession from "../../../components/calls/call-session";
import AdminNav from "../../components/admin-nav";
export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (
    process.env.NODE_ENV !== "development" &&
    !validSession((await cookies()).get(sessionCookie)?.value)
  )
    redirect("/admin");
  const call = await findCall((await params).id);
  if (!call) notFound();
  const appointment = call.appointment_slot_id
    ? await database().query("SELECT booked_by FROM appointment_slots WHERE id = $1", [call.appointment_slot_id])
    : null;
  const clientId = appointment?.rows[0]?.booked_by;
  return (
    <>
      <AdminNav />
      <main className="bg-brand-50 px-5 py-10">
        <CallSession
          returnPath={clientId ? `/admin/clients?client=${clientId}` : "/admin"}
          id={call.id}
          name={call.name}
          expires={call.expires_at.toISOString()}
        />
      </main>
    </>
  );
}
