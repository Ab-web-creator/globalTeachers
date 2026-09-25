import Link from "next/link";
import type { PanelProps } from "./content";
import { navigationItems } from "./navigation-items";

export default function DesktopNavigation({ openPanel, onHero = false }: PanelProps & { onHero?: boolean }) {
  return (
    <nav aria-label="Основная навигация" className={`hidden items-center gap-3 whitespace-nowrap text-sm md:flex lg:gap-6 lg:text-base 2xl:gap-9 ${onHero ? "text-white" : "text-neutral-600"}`}>
      <Link href="/" aria-current="page" className={onHero ? "text-brand-100" : "text-brand-500"}>Главная</Link>
      {navigationItems.map(({ label, panel, expandable }) => (
        <button key={panel} onClick={() => openPanel(panel)} className={`flex items-center gap-2 py-3 transition ${onHero ? "hover:text-brand-200" : "hover:text-brand-500"}`}>
          {label}{expandable && <span aria-hidden="true" className="text-xl font-light text-brand-300">+</span>}
        </button>
      ))}
      <button onClick={() => openPanel("Courses")} className={`rounded-full px-4 py-3.5 font-medium transition lg:px-7 ${onHero ? "bg-transparent text-white hover:text-brand-200" : "bg-brand-100 text-brand-500 hover:bg-brand-200"}`}>Начать свой путь</button>
    </nav>
  );
}
