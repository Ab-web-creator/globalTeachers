import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/page-header";
import { programs } from "../../components/home/categories/programs";
import ProgramDetails from "../program-details";

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
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-violet-50 text-brand-700">
      <PageHeader />
      <ProgramDetails program={program} />
    </div>
  );
}
