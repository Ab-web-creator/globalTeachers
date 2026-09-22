import Link from "next/link";
import type { PanelProps } from "./content";
import PrimaryButton from "./primary-button";

export default function MobileNavigation({ openPanel }: PanelProps) {
  return (
    <nav id="mobile-menu" aria-label="Mobile navigation" className="grid gap-1 border-t border-black/5 px-6 pb-5 md:hidden">
      <Link href="/" className="py-3 text-[#00566b]">Home</Link>
      {(["About", "Courses", "Pages", "Contact"] as const).map((item) => <button key={item} onClick={() => openPanel(item)} className="py-3 text-left text-[#555]">{item}</button>)}
      <PrimaryButton onClick={() => openPanel("Courses")}>Get Started</PrimaryButton>
    </nav>
  );
}
