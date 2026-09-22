import Link from "next/link";
import type { PanelProps } from "./content";

export default function DesktopNavigation({ openPanel }: PanelProps) {
  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-9 text-base text-[#898989] md:flex xl:gap-14">
      <Link href="/" aria-current="page" className="text-brand-500">Home</Link>
      {(["About", "Courses", "Pages", "Contact"] as const).map((item) => (
        <button key={item} onClick={() => openPanel(item)} className="flex items-center gap-2 py-3 transition hover:text-brand-500">
          {item}{(item === "Courses" || item === "Pages") && <span className="text-xl font-light text-brand-300">+</span>}
        </button>
      ))}
      <button onClick={() => openPanel("Courses")} className="rounded-full bg-brand-100 px-7 py-3.5 font-medium text-brand-500 transition hover:bg-brand-200">Get Started</button>
    </nav>
  );
}
