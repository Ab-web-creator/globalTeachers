"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { ServiceCategoryIllustration } from "@/app/components/svg";
import Link from "next/link";
import type { Service } from "../services";
import BackLink from "./back-link";

export default function ServiceDetails({ service }: { service: Service; }) {
  const t = useTranslations();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <BackLink />
      <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">{t("services.serviceDetails.message1726")}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{t.content(service.title)}</h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">{t.content(service.introduction)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6">
          <ServiceCategoryIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
        </div>
      </header>
      <section aria-labelledby="service-topics" className="py-12 sm:py-16 lg:py-20">
        <h2 id="service-topics" className="text-2xl font-semibold">{t("services.serviceDetails.message1727")}</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {service.topics.map(({ title, text }, index) => <li key={title} className="rounded-3xl border border-brand-100 bg-white p-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-500">{index + 1}</span>
            <h3 className="mt-4 text-xl font-medium">{t.content(title)}</h3>
            <p className="mt-3 leading-relaxed text-neutral-600">{t.content(text)}</p>
          </li>)}
        </ol>
      </section>
      <section aria-labelledby="service-start" className="rounded-3xl bg-white/80 px-6 sm:px-8 py-12 sm:py-16 lg:py-20">
        <h2 id="service-start" className="text-2xl font-semibold">{t("consultation.consultationForm.message0483")}</h2>
        <p className="mt-7 max-w-3xl leading-relaxed text-neutral-600">{t.content(service.preparation)}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/consultation" className="action-gradient rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">{t("home.mobileNavigation.message0446")}</Link>
          <Link href="/#plans" className="action-gradient-outline rounded-2xl px-6 py-3 font-medium sm:rounded-full">{t("programs.programCta.message1112")}</Link>
        </div>
      </section>
    </main>
  );
}
