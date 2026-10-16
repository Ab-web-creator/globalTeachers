import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  clientAccessLink,
  clientFromSession,
  clientSessionCookie,
} from "../../lib/client-area/access";
import { getWorkspace } from "../../lib/client-area/workspace";
import ClientAccess from "./components/client-access";
import WorkspacePanel from "./components/workspace-panel";

export const metadata: Metadata = {
  title: "Личная страница — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

export default async function ClientPage() {
  const id = await clientFromSession(
    (await cookies()).get(clientSessionCookie)?.value,
  );
  const workspace = id ? await getWorkspace(id) : null;
  const accessLink = workspace
    ? await clientAccessLink(workspace.client.id)
    : null;
  return (
    <div className="min-h-dvh bg-linear-to-br from-amber-50/40 via-brand-50 to-violet-50/60 text-brand-700">
      <ClientAccess
        authenticated={Boolean(workspace)}
        accessLink={accessLink}
        name={workspace?.client.name}
        tier={workspace?.client.tier}
        hasPhoto={!!workspace?.client.has_profile_photo}
        initialUnread={workspace?.client.client_unread_count ?? 0}
      />
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
        {workspace && (
          <WorkspacePanel initial={JSON.parse(JSON.stringify(workspace))} />
        )}
      </main>
    </div>
  );
}
