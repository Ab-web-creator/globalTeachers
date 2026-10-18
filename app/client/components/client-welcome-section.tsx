"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
export default function ClientWelcomeSection({
  name,
}: {
  name: string;
}) {
  const t = useTranslations();
  return (
    <section className="relative mb-10 py-4 sm:py-6">
      <header className="min-w-0">
        <h1 className="font-serif text-4xl leading-tight text-brand-950 sm:text-5xl">
          {t("client.clientWelcomeSection.message0121")}{" "}<span data-profile-name className="text-brand-500">{name}!</span>
        </h1>
        <p className="mt-7 w-full text-base leading-relaxed text-neutral-600 lg:w-[calc((100%-1.5rem)/2)]">
          {t("client.clientWelcomeSection.message0122")}</p>
      </header>
    </section>
  );
}
