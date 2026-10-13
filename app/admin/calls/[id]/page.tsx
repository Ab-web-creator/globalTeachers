import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { validSession, sessionCookie } from "../../../../lib/admin/session";
import { findCall } from "../../../../lib/calls/server";
import CallRoom from "../../../components/calls/call-room";
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
  return (
    <>
      <AdminNav />
      <main className="bg-brand-50 px-5 py-10">
        <CallRoom
          id={call.id}
          name={call.name}
          expires={call.expires_at.toISOString()}
        />
      </main>
    </>
  );
}
