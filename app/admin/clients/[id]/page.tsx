import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { getWorkspace } from "../../../../lib/client-area/workspace";
import { uuidPattern } from "../../../../lib/client-area/types";
import AdminNav from "../../components/admin-nav";
import WorkspacePanel from "../../../client/components/workspace-panel";
import ClientWorkspaceShell from "../components/client-workspace-shell";

export const metadata: Metadata = {
  title: "Клиент — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  const development = process.env.NODE_ENV === "development";
  if (!development && !validSession((await cookies()).get(sessionCookie)?.value)) redirect("/admin");
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();
  const workspace = await getWorkspace(id, true);
  if (!workspace) notFound();
  const initial = JSON.parse(JSON.stringify(workspace));
  return (
    <div className="relative isolate min-h-dvh bg-white sm:bg-linear-to-br sm:from-sky-100 sm:via-violet-100 sm:to-pink-100 text-brand-700 before:hidden sm:before:block before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-white before:to-transparent">
      <AdminNav backHref="/admin/clients" active="clients" showLogout={!development} />
      <main className="mx-auto max-w-400 px-5 py-6 sm:px-10 lg:px-16 xl:px-20">
        <ClientWorkspaceShell initial={initial.client}>
          <WorkspacePanel key={id} initial={initial} admin />
        </ClientWorkspaceShell>
      </main>
    </div>
  );
}
