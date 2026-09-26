import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/page-header";
import ServiceDetails from "../components/service-details";
import { services } from "../services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

async function getService(params: Props["params"]) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params);
  return { title: `${service.title} — Global Teacher Hub`, description: service.description };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params);
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-violet-50 text-brand-700">
      <PageHeader />
      <ServiceDetails service={service} />
    </div>
  );
}
