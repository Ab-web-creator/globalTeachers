import Link from "next/link";
import SupportBanner from "../support-banner";

export default function SearchSupport() {
  return (
    <SupportBanner
      id="job-search-support"
      label="Поддержка в поиске"
      title="Не знаете, с каких стран и школ начать?"
      text="В рамках START мы поможем оценить ваш профиль, определить подходящие направления и составить понятный план самостоятельного поиска."
      image="/images/benefits/relocation.webp"
    >
      <Link href="/consultation" className="action-gradient rounded-full px-6 py-3 text-sm font-medium text-white">Получить консультацию</Link>
      <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
    </SupportBanner>
  );
}
