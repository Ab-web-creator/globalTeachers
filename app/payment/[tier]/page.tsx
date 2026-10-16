import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/page-header";
import { programs } from "../../components/home/categories/programs";
import ProgramPageLayout from "../../programs/components/program-page-layout";
import PaymentHero from "../components/payment-hero";
import PaymentCheckout from "../components/payment-checkout";
import VipConsultationBenefitsSection from "../components/vip-consultation-benefits-section";

type Props = { params: Promise<{ tier: string }> };

export function generateStaticParams() {
  return programs.map((program) => ({ tier: program.tier.toLowerCase() }));
}

async function getProgram(params: Props["params"]) {
  const { tier } = await params;
  const program = programs.find((item) => item.tier.toLowerCase() === tier);
  if (!program) notFound();
  return program;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = await getProgram(params);
  return {
    title: `Оплата ${program.tier} — TeacherNavigator`,
    description: `Выбранная программа ${program.tier}: стоимость и оформление оплаты.`,
    robots: { index: false, follow: true },
  };
}

export default async function PaymentPage({ params }: Props) {
  const program = await getProgram(params);
  return (
    <div className="min-h-screen bg-white text-brand-700">
      <PageHeader />
      <ProgramPageLayout hero={<PaymentHero program={program} />}>
        {program.tier === "VIP" && <VipConsultationBenefitsSection />}
        <PaymentCheckout program={program} />
      </ProgramPageLayout>
    </div>
  );
}
