import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigation-items";

export default function DesktopNavigation({ onHero = false }: { onHero?: boolean }) {
  const pathname = usePathname();
  const underline = `decoration-[3px] underline-offset-8 group-hover:underline group-focus-visible:underline ${onHero ? "decoration-white" : "decoration-brand-500"}`;
  return (
    <nav aria-label="Основная навигация" className={`relative isolate hidden items-center gap-3 whitespace-nowrap text-sm md:flex lg:gap-6 lg:text-base 2xl:gap-9 ${onHero ? "text-white" : "text-brand-700"}`}>
      {onHero && <div aria-hidden="true" className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 bg-radial from-brand-950/70 via-brand-950/30 via-40% to-transparent to-70% blur-xl" />}
      <Link href="/#home" aria-current={pathname === "/" ? "page" : undefined} className={`group ${!onHero && pathname === "/" ? "text-brand-500" : ""}`}><span className={underline}>Главная</span></Link>
      {[...navigationItems, { label: "Начать свой путь", href: "/consultation" }].map(({ label, href }) => (
        <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined} className={`group flex items-center gap-2 py-3 transition ${onHero ? "" : "hover:text-brand-500"} ${!onHero && pathname === href ? "text-brand-500" : ""}`}>
          <span className={underline}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
