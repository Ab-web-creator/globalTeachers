"use client";

import { BrandLogo, HeaderBackArrowIcon, MenuToggleIcon } from "@/app/components/svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import useCompactHeader from "./use-compact-header";

export default function SiteHeader({ inFlow = false }: { inFlow?: boolean; }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const homepage = pathname === "/";
  const backHref = pathname.startsWith("/services/") ? "/#categories" : pathname.startsWith("/programs/") ? "/#programs" : undefined;
  const headerState = useCompactHeader(headerRef, homepage);
  const compact = !homepage || headerState.compact;
  const hidden = headerState.hidden;
  const hideHeader = hidden && !menuOpen;
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header ref={headerRef} inert={hideHeader} aria-hidden={hideHeader} className={`${inFlow ? "relative shrink-0" : "fixed inset-x-0 top-0"} z-40 isolate transition-opacity duration-200 motion-reduce:transition-none ${compact ? "bg-white text-brand-700 shadow-sm" : !hidden ? "bg-transparent text-white" : "bg-transparent text-white"} ${hideHeader ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <div className={`mx-auto flex max-w-400 items-center justify-between gap-6 px-6 transition-[min-height] duration-200 motion-reduce:transition-none sm:px-10 lg:px-16 xl:px-20 ${compact ? "min-h-14 lg:min-h-16" : "min-h-16 lg:min-h-18"}`}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {backHref && (
            <Link href={backHref} aria-label="Назад" className="flex size-9 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden">
              <HeaderBackArrowIcon />
            </Link>
          )}
          <Link href="/" aria-label="Global Teacher Hub home" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
            <BrandLogo className={`transition-[width] duration-200 motion-reduce:transition-none ${compact ? "w-36 text-brand-500 sm:w-44 lg:w-48" : "w-40 text-white sm:w-48 lg:w-56"}`} aria-hidden="true" />
          </Link>
        </div>
        <DesktopNavigation onHero={!compact} />
        <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen(!menuOpen)} className={`rounded-xl p-3 md:hidden ${compact ? "text-brand-500" : "text-white"}`}>
          <MenuToggleIcon open={menuOpen} />
        </button>
      </div>
      {menuOpen && <MobileNavigation onClose={closeMenu} />}
    </header>
  );
}
