import type { Metadata } from "next";
import PageHeader from "../components/page-header";
import ConsultationDetails from "./consultation-details";

export const metadata: Metadata = {
  title: "Консультация — Global Teacher Hub",
  description: "Обсудите свой педагогический опыт и следующие шаги к работе в международной школе.",
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-violet-50 text-brand-700">
      <PageHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-24">
        <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">Личная консультация</p>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">Ваш следующий шаг к международной карьере</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">Расскажите о своём опыте и целях. Вместе определим, с чего начать и как подготовиться к работе в международной школе.</p>
        <ConsultationDetails />
      </main>
    </div>
  );
}
