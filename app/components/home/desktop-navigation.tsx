import Link from "next/link";
import type { PanelProps } from "./content";
import { navigationItems } from "./navigation-items";

export default function DesktopNavigation({ openPanel }: PanelProps) {
  return (
    <nav aria-label="Основная навигация" className="hidden items-center gap-3 whitespace-nowrap text-sm text-[#898989] md:flex lg:gap-6 lg:text-base 2xl:gap-9">
      <Link href="/" aria-current="page" className="text-brand-500">Главная</Link>
      {navigationItems.map(({ label, panel, expandable }) => (
        <button key={panel} onClick={() => openPanel(panel)} className="flex items-center gap-2 py-3 transition hover:text-brand-500">
          {label}{expandable && <span aria-hidden="true" className="text-xl font-light text-brand-300">+</span>}
        </button>
      ))}
      <button onClick={() => openPanel("Courses")} className="rounded-full bg-brand-100 px-4 py-3.5 font-medium text-brand-500 transition hover:bg-brand-200 lg:px-7">Начать свой путь</button>
    </nav>
  );
}
