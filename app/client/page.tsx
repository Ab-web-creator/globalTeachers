import styles from "./client-theme.module.css";
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
    <div className={`${styles.page} min-h-dvh text-brand-700`}>
      <ClientAccess
        authenticated={Boolean(workspace)}
        accessLink={accessLink}
        name={workspace?.client.name}
        tier={workspace?.client.tier}
        email={workspace?.client.email}
        paid={Boolean(workspace?.client.paid_at)}
        remainingHours={workspace ? Math.max(0, workspace.client.allowance_hours - workspace.client.booked_hours) : undefined}
        hasPhoto={!!workspace?.client.has_profile_photo}
        initialUnread={workspace?.client.client_unread_count ?? 0}
      />
      <main className="mx-auto max-w-400 px-6 py-8 sm:px-10 sm:py-12 lg:px-16 xl:px-20">
        {workspace && (
          <WorkspacePanel initial={JSON.parse(JSON.stringify(workspace))} />
        )}
      </main>
    </div>
  );
}
