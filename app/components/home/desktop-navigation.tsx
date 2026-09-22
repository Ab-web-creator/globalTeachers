import Link from "next/link";
import type { PanelProps } from "./content";

export default function DesktopNavigation({ openPanel }: PanelProps) {
  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-9 text-base text-[#898989] md:flex xl:gap-14">
      <Link href="/" aria-current="page" className="text-[#00566b]">Home</Link>
      {(["About", "Courses", "Pages", "Contact"] as const).map((item) => (
        <button key={item} onClick={() => openPanel(item)} className="flex items-center gap-2 py-3 transition hover:text-[#00566b]">
          {item}{(item === "Courses" || item === "Pages") && <span className="text-xl font-light text-[#8db5c0]">+</span>}
        </button>
      ))}
      <button onClick={() => openPanel("Courses")} className="rounded-full bg-[#d5ebf0] px-7 py-3.5 font-medium text-[#00566b] transition hover:bg-[#c0e1e9]">Get Started</button>
    </nav>
  );
}
