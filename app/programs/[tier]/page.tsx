import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/page-header";
import { programs } from "../../components/home/categories/programs";
import StartDetails from "../start/start-details";
import ProDetails from "../pro/pro-details";
import VipDetails from "../vip/vip-details";

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
  return { title: `${program.tier} — Global Teacher Hub`, description: program.description };
}

export default async function ProgramPage({ params }: Props) {
  const program = await getProgram(params);
  const Details = program.tier === "START" ? StartDetails : program.tier === "PRO" ? ProDetails : VipDetails;
  return (
    <div className="min-h-screen bg-white text-brand-700">
      <PageHeader />
      <Details program={program} />
    </div>
  );
}
