import Link from "next/link";
import Logo from "../Logo";
import FooterLinks from "./footer/footer-links";
import styles from "./footer/footer-background.module.css";

export default function SiteFooter() {
  return (
    <footer id="footer" className={`${styles.background} relative isolate overflow-hidden scroll-mt-16 text-white`}>
      <div aria-hidden="true" className={styles.ornament} />
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-3 lg:gap-x-24 lg:gap-y-10">
          <div className="max-w-md xl:flex xl:flex-col xl:items-start">
            <Link href="/#home" aria-label="GlobalTeacherHub — на главную" className="relative -top-3 inline-flex items-center gap-3 rounded-sm">
              <Logo className="w-48 text-white sm:w-52" aria-hidden="true" />
            </Link>
            <p className="mt-4 max-w-64 text-sm leading-relaxed text-white/90 xl:mt-auto xl:pt-4">
              Ваша работа мечты может быть в любой точке мира. Найдите её вместе с нами, вместе с GlobalTeacherHub. Начнём этот путь.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-2">
            <FooterLinks />
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/25 py-5 text-sm leading-normal text-white/90 lg:flex-row lg:items-center lg:justify-between lg:text-xs">
          <p>© {new Date().getFullYear()} GlobalTeacherHub. Все права защищены.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="underline-offset-4 hover:underline">Политика конфиденциальности</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="underline-offset-4 hover:underline">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
