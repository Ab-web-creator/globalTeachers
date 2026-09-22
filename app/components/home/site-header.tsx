"use client";

import Link from "next/link";
import { useState } from "react";
import BookIcon from "./book-icon";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import type { Panel, PanelProps } from "./content";

export default function SiteHeader({ openPanel }: PanelProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(panel: Panel) {
    setMenuOpen(false);
    openPanel(panel);
  }

  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex min-h-22 max-w-400 items-center justify-between gap-6 px-6 lg:min-h-25 lg:px-9">
        <Link href="/" aria-label="Educine home" className="flex items-center gap-3 text-2xl font-medium tracking-tight">
          <BookIcon className="h-9 w-10 text-[#00566b]" />
          Educine
        </Link>
        <DesktopNavigation openPanel={navigate} />
        <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-3 text-[#00566b] md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={menuOpen ? "M6 6l12 12M6 18 18 6" : "M3 6h18M3 12h18M3 18h18"} /></svg>
        </button>
      </div>
      {menuOpen && <MobileNavigation openPanel={navigate} />}
    </header>
  );
}
