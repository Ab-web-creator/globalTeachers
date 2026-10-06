import Link from "next/link";
import SupportBanner from "../support-banner";

export default function InterviewSupport() {
  return (
    <SupportBanner
      id="interview-vip-support"
      label="Программа VIP"
      title="Хотите готовиться к интервью в конкретной школе вместе с нами?"
      text="В программе VIP мы готовимся не к абстрактному интервью, а к конкретной школе: изучаем её curriculum, ценности и требования вакансии, разбираем возможные вопросы и выбираем сильные примеры из вашего опыта. После интервью вместе разбираем, как оно прошло и что улучшить перед следующим этапом."
      image="/images/interview-vip-preparation.webp"
      imageClassName="object-top"
    >
      <Link href="/programs/vip" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">Посмотреть VIP <span aria-hidden="true">→</span></Link>
      <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
    </SupportBanner>
  );
}
