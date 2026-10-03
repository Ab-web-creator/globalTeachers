import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/page-header";
import ServiceDetails from "../components/service-details";
import JobSearchDetails from "../components/job-search/job-search-details";
import CvPortfolioDetails from "../components/cv-portfolio/cv-portfolio-details";
import InterviewPreparationDetails from "../components/interview-preparation/interview-preparation-details";
import CareerSupportDetails from "../components/career-support/career-support-details";
import { services } from "../services";

type Props = { params: Promise<{ slug: string }> };

const detailComponents = {
  "job-search": JobSearchDetails,
  "cv-portfolio": CvPortfolioDetails,
  "interview-preparation": InterviewPreparationDetails,
  "career-support": CareerSupportDetails,
};

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
  const Details = detailComponents[service.slug as keyof typeof detailComponents] ?? ServiceDetails;
  return (
    <div className="min-h-screen bg-white text-brand-700">
      <PageHeader />
      <Details service={service} />
    </div>
  );
}
