import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "../components/page-header";
import ConsultationIntro from "./components/consultation-intro";
import ConsultationLayout from "./components/consultation-layout";
import ConsultationAside from "./components/consultation-aside";

export const metadata: Metadata = {
  title: "Консультация — Global Teacher Hub",
  description: "Расскажите о своём педагогическом опыте и целях — по одному вопросу за шаг. Начните путь к работе в международной школе.",
};

export default function ConsultationPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white lg:bg-sky-50 text-brand-700">
      <PageHeader inFlow />
      <main className="relative isolate min-h-0 flex-1 overflow-hidden">
        <Image src="/images/consultation-world.png" alt="" fill priority sizes="(min-width: 1024px) 100vw, 0px" className="-z-20 object-cover object-left-bottom max-lg:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-linear-to-r from-white/60 via-transparent to-white/20 lg:block" />
        <ConsultationLayout aside={<ConsultationAside />} intro={<>
            <ConsultationIntro />
        </>} />
      </main>
    </div>
  );
}
