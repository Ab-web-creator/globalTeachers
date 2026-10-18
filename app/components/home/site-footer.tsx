"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { BrandLogo } from "@/app/components/svg";
import Link from "next/link";
import styles from "./footer/footer-background.module.css";
import FooterLinks from "./footer/footer-links";

export default function SiteFooter() {
  const t = useTranslations();
  return (
    <footer id="footer" className={`${styles.background} relative isolate overflow-hidden scroll-mt-16 text-white`}>
      <div aria-hidden="true" className={styles.ornament} />
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-3 lg:gap-x-24 lg:gap-y-10">
          <div className="max-w-md xl:flex xl:flex-col xl:items-start">
            <Link href="/#home" aria-label={t("client.clientAccess.message0054")} className="inline-flex rounded-sm">
              <BrandLogo variant="dark" className="w-20 sm:w-24" aria-hidden="true" />
            </Link>
            <p className="mt-5 max-w-64 text-sm leading-relaxed text-white/90 xl:leading-6.5">
              {t("home.siteFooter.message0451")}</p>
          </div>
          <div className="min-w-0 lg:col-span-2">
            <FooterLinks />
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/25 py-5 text-sm leading-normal text-white/90 lg:flex-row lg:items-center lg:justify-between lg:text-xs">
          <p>© {new Date().getFullYear()} {" "}{t("home.siteFooter.message0452")}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm lg:text-xs">
            <Link href="/privacy" className="underline-offset-4 hover:underline">{t("home.siteFooter.message0453")}</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="underline-offset-4 hover:underline">{t("home.siteFooter.message0454")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
