import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigation-items";

export default function DesktopNavigation({ onHero = false }: { onHero?: boolean }) {
  const pathname = usePathname();
  const underline = `decoration-[3px] underline-offset-8 group-hover:underline group-focus-visible:underline ${onHero ? "decoration-white" : "decoration-brand-500"}`;
  return (
    <nav aria-label="Основная навигация" className={`hidden items-center gap-3 whitespace-nowrap text-sm md:flex lg:gap-6 lg:text-base 2xl:gap-9 ${onHero ? "text-white" : "text-brand-700"}`}>
      <Link href="/#home" aria-current={pathname === "/" ? "page" : undefined} className={`group ${!onHero && pathname === "/" ? "text-brand-500" : ""}`}><span className={underline}>Главная</span></Link>
      {navigationItems.map(({ label, href }) => (
        <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined} className={`group flex items-center gap-2 py-3 transition ${onHero ? "" : "hover:text-brand-500"} ${!onHero && pathname === href ? "text-brand-500" : ""}`}>
          <span className={underline}>{label}</span>
        </Link>
      ))}
      <Link href="/consultation" className={`group rounded-full border-0 bg-transparent px-4 py-3.5 font-medium transition-colors lg:px-7 ${onHero ? "text-white" : "nav-action-outline text-brand-500 hover:bg-brand-50 hover:text-brand-600"}`}><span className={onHero ? underline : undefined}>Начать свой путь</span></Link>
    </nav>
  );
}
