import { translateMetadata } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/server";
import Link from "next/link";
import PageHeader from "../components/page-header";

export async function generateMetadata() {
  return translateMetadata({
    title: "Вакансии — TeacherNavigator",
    description: "Работа в международных школах: подготовьтесь к поиску вакансий с TeacherNavigator.",
  });
}

export default async function JobsPage() {
  const t = await getTranslations();
  return (
    <div className="min-h-screen bg-white text-brand-700">
      <PageHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-24">
        <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">{t("consultation.consultationAside.message0463")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{t("jobs.page.message0677")}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">{t("jobs.page.message0678")}</p>
        <section aria-labelledby="jobs-status" className="rounded-3xl border border-brand-200/60 bg-white px-8 sm:px-12 py-12 sm:py-16 lg:py-20">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600">{t("jobs.page.message0679")}</span>
          <h2 id="jobs-status" className="mt-6 text-2xl font-semibold sm:text-3xl">{t("jobs.page.message0680")}</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-neutral-600">{t("jobs.page.message0681")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/consultation" className="action-gradient-outline inline-flex rounded-2xl sm:rounded-full px-6 py-2.5 sm:py-4 text-center font-medium">{t("home.mobileNavigation.message0446")}</Link>
            <Link href="/#plans" className="font-medium text-brand-500 underline-offset-8 hover:underline">{t("jobs.page.message0682")}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
