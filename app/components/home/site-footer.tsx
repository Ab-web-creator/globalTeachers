import Logo from "../Logo";
import type { PanelProps } from "./content";
import FooterLinks from "./footer/footer-links";
import styles from "./footer/footer-background.module.css";

export default function SiteFooter({ openPanel }: PanelProps) {
  return (
    <footer id="footer" className={`${styles.background} relative isolate overflow-hidden scroll-mt-16 text-white`}>
      <div aria-hidden="true" className={styles.ornament} />
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-8 py-10 sm:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-md">
            <a href="#home" aria-label="GlobalTeacherHub — на главную" className="inline-flex items-center gap-3 rounded-sm">
              <Logo className="w-48 text-white sm:w-52" aria-hidden="true" />
            </a>
            <p className="mt-4 text-base leading-normal text-white/90 lg:text-lg">
              Ваша работа мечты может быть в любой точке мира. Найдите её вместе с нами, вместе с GlobalTeacherHub.
            </p>
          </div>
          <FooterLinks openPanel={openPanel} />
        </div>
        <div className="flex flex-col gap-4 border-t border-white/25 py-5 text-sm leading-normal text-white/90 lg:flex-row lg:items-center lg:justify-between lg:text-xs">
          <p>© {new Date().getFullYear()} GlobalTeacherHub. Все права защищены.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Политика конфиденциальности</span>
            <span aria-hidden="true">·</span>
            <span>Пользовательское соглашение</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
