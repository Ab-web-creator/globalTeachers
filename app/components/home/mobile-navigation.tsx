import Link from "next/link";
import type { PanelProps } from "./content";
import PrimaryButton from "./primary-button";
import { navigationItems } from "./navigation-items";

export default function MobileNavigation({ openPanel }: PanelProps) {
  return (
    <nav id="mobile-menu" aria-label="Мобильная навигация" className="grid gap-1 border-t border-black/5 px-6 pb-5 xl:hidden">
      <Link href="/" aria-current="page" className="py-3 text-brand-500">Главная</Link>
      {navigationItems.map(({ label, panel, expandable }) => (
        <button key={panel} onClick={() => openPanel(panel)} className="flex items-center gap-2 py-3 text-left text-[#555]">
          {label}{expandable && <span aria-hidden="true" className="text-xl font-light text-brand-300">+</span>}
        </button>
      ))}
      <PrimaryButton onClick={() => openPanel("Courses")}>Начать свой путь</PrimaryButton>
    </nav>
  );
}
