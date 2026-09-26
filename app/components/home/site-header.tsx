"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import Logo from "../Logo";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import useCompactHeader from "./use-compact-header";
import { usePathname } from "next/navigation";
import styles from "./site-header.module.css";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const homepage = usePathname() === "/";
  const headerState = useCompactHeader(headerRef);
  const compact = !homepage || headerState.compact;
  const hidden = homepage && headerState.hidden;
  const hideHeader = hidden && !menuOpen;
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header ref={headerRef} inert={hideHeader} aria-hidden={hideHeader} className={`${styles.adobe} fixed inset-x-0 top-0 z-40 bg-transparent transition-opacity duration-200 motion-reduce:transition-none ${hideHeader ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <div className={`mx-auto flex max-w-400 items-center justify-between gap-6 px-6 transition-[min-height] duration-200 motion-reduce:transition-none sm:px-10 lg:px-16 xl:px-20 ${compact ? "min-h-14 lg:min-h-16" : "min-h-16 lg:min-h-18"}`}>
        <Link href="/" aria-label="Global Teacher Hub home" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
          <Logo className={`transition-[width] duration-200 motion-reduce:transition-none ${compact ? "w-36 sm:w-44 lg:w-48" : "w-40 sm:w-48 sm:brightness-0 sm:invert lg:w-56"}`} aria-hidden="true" />
        </Link>
        <DesktopNavigation onHero={!compact} />
        <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen(!menuOpen)} className={`rounded-xl p-3 md:hidden ${compact ? "text-brand-500" : "text-brand-600 sm:text-white"}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={menuOpen ? "M6 6l12 12M6 18 18 6" : "M3 6h18M3 12h18M3 18h18"} /></svg>
        </button>
      </div>
      {menuOpen && <MobileNavigation onClose={closeMenu} />}
    </header>
  );
}
