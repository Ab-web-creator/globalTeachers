import type { Metadata } from "next";
import ClientDirectory from "./components/client-directory";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import {
  getWorkspace,
  listPrivateClients,
} from "../../../lib/client-area/workspace";
import { uuidPattern } from "../../../lib/client-area/types";
import AdminNav from "../components/admin-nav";
import WorkspacePanel from "../../client/components/workspace-panel";

export const metadata: Metadata = {
  title: "Клиенты — TeacherNavigator",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const development = process.env.NODE_ENV === "development";
  if (
    !development &&
    !validSession((await cookies()).get(sessionCookie)?.value)
  )
    redirect("/admin");
  const params = await searchParams;
  const clientId =
    typeof params.client === "string" && uuidPattern.test(params.client)
      ? params.client
      : null;
  const data = await Promise.all([
    listPrivateClients(),
    clientId ? getWorkspace(clientId, true) : Promise.resolve(null),
  ]).catch(() => null);
  return (
    <div className="min-h-dvh bg-brand-50 text-brand-700">
      <AdminNav active="clients" showLogout={!development} />
      <main className="mx-auto max-w-400 px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <h1 className="text-3xl font-semibold">Личные страницы клиентов</h1>
        <p className="mt-7 text-base text-neutral-600">
          Здесь отображаются только клиенты с отметкой «Оплачено». Все заявки
          находятся на странице «Заявки». Ключ от личной страницы отправляется кнопкой Send Key в письме клиента.
        </p>
        {!data ? (
          <p role="alert" className="mt-7 text-base text-red-700">
            Не удалось загрузить данные. Проверьте базу и выполните npm run
            db:migrate.
          </p>
        ) : (
          <>
            <ClientDirectory initial={data[0]} selectedId={clientId}>
              {data[1] && (
                <WorkspacePanel
                  key={data[1].client.id}
                  initial={JSON.parse(JSON.stringify(data[1]))}
                  admin
                />
              )}
            </ClientDirectory>
          </>
        )}
      </main>
    </div>
  );
}
