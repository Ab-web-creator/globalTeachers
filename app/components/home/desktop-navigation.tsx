import Link from "next/link";
import type { PanelProps } from "./content";
import { navigationItems } from "./navigation-items";

export default function DesktopNavigation({ openPanel }: PanelProps) {
  return (
    <nav aria-label="Основная навигация" className="hidden items-center gap-6 whitespace-nowrap text-base text-[#898989] xl:flex 2xl:gap-9">
      <Link href="/" aria-current="page" className="text-brand-500">Главная</Link>
      {navigationItems.map(({ label, panel, expandable }) => (
        <button key={panel} onClick={() => openPanel(panel)} className="flex items-center gap-2 py-3 transition hover:text-brand-500">
          {label}{expandable && <span aria-hidden="true" className="text-xl font-light text-brand-300">+</span>}
        </button>
      ))}
      <button onClick={() => openPanel("Courses")} className="rounded-full bg-brand-100 px-7 py-3.5 font-medium text-brand-500 transition hover:bg-brand-200">Начать свой путь</button>
    </nav>
  );
}
