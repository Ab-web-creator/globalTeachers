import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "../components/page-header";
import ConsultationIntro from "./components/consultation-intro";
import ConsultationForm from "./components/consultation-form";
import ConsultationAside from "./components/consultation-aside";

export const metadata: Metadata = {
  title: "Консультация — Global Teacher Hub",
  description: "Расскажите о своём педагогическом опыте и целях за три простых шага. Начните путь к работе в международной школе.",
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-sky-50 text-brand-700">
      <PageHeader />
      <main className="relative isolate overflow-hidden">
        <Image src="/images/consultation-world.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-left-bottom max-lg:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-linear-to-r from-white/60 via-transparent to-white/20 lg:block" />
        <div className="mx-auto grid max-w-400 items-start gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:px-16 xl:grid-cols-[1.3fr_1fr_0.32fr] xl:gap-8 xl:px-20">
          <div className="relative isolate">
            <Image src="/images/consultation-world.png" alt="" fill sizes="(min-width: 1024px) 1px, 100vw" className="-z-10 object-cover object-left-bottom lg:hidden" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-sky-50/95 via-sky-50/70 to-transparent lg:hidden" />
            <ConsultationIntro />
          </div>
          <ConsultationForm />
          <ConsultationAside />
        </div>
      </main>
    </div>
  );
}
