import Link from "next/link";
import SupportBanner from "../support-banner";

export default function CareerSupportBanner() {
  return (
    <SupportBanner
      id="career-vip-support"
      label="Программа VIP"
      title="Хотите пройти весь путь с персональной поддержкой?"
      text="Программа VIP предназначена для педагогов, которым нужна помощь на протяжении всего процесса — от определения стратегии и поиска подходящих вакансий до интервью и получения предложения от международной школы."
      image="/images/career-vip-plan.png"
      imageClassName="object-center"
    >
      <Link href="/programs/vip" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">Посмотреть VIP <span aria-hidden="true">→</span></Link>
      <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
    </SupportBanner>
  );
}
