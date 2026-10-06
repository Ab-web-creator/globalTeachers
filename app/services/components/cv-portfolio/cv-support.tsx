import Link from "next/link";
import SupportBanner from "../support-banner";

export default function CvSupport() {
  return (
    <SupportBanner
      id="cv-pro-support"
      label="Программа PRO"
      title="Хотите профессионально подготовить CV и портфолио?"
      text="В программе PRO мы поможем представить ваш опыт в формате, понятном международным школам, подготовить профессиональное CV и собрать Teacher Portfolio."
      image="/images/proPackage.webp"
    >
      <Link href="/programs/pro" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">Посмотреть PRO <span aria-hidden="true">→</span></Link>
      <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
    </SupportBanner>
  );
}
