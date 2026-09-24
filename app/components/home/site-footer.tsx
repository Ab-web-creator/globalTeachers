import Logo from "../Logo";
import type { PanelProps } from "./content";
import FooterBanner from "./footer/footer-banner";
import FooterContact from "./footer/footer-contact";
import FooterLinks from "./footer/footer-links";

export default function SiteFooter({ openPanel }: PanelProps) {
  return (
    <footer className="bg-brand-700 text-white">
      <div className="mx-auto max-w-400 px-6 pt-8 sm:px-10 lg:px-16 xl:px-20">
        <FooterBanner openPanel={openPanel} />
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-8 py-8 sm:gap-x-8 sm:py-10 xl:grid-cols-[1.5fr_0.7fr_0.9fr_1.4fr] xl:gap-10">
          <div className="col-span-2 xl:col-span-1 xl:pt-7">
            <a href="#home" aria-label="GlobalTeacherHub — на главную" className="inline-flex items-center gap-3 rounded-sm">
              <Logo className="w-24 brightness-0 invert sm:w-28" aria-hidden="true" />
            </a>
            <p className="mt-4 max-w-sm text-base leading-normal text-brand-100">
              Ваша работа мечты может быть<br className="hidden sm:block" /> в любой точке мира.<br />
              Найдите её вместе с нами, <br /> с GlobalTeacherHub.
            </p>
          </div>
          <FooterLinks openPanel={openPanel} />
          <FooterContact />
        </div>
        <div className="flex flex-col gap-4 border-t border-brand-300/30 py-5 text-xs leading-normal text-brand-200 lg:flex-row lg:items-center lg:justify-between">
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
