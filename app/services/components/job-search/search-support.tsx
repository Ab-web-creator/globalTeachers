import SectionLabel from "./section-label";
import Image from "next/image";
import Link from "next/link";
import styles from "./search-support.module.css";

export default function SearchSupport() {
  return (
    <section aria-labelledby="job-search-support" className="grid overflow-hidden rounded-3xl bg-linear-to-br from-brand-50 to-brand-300/20 md:grid-cols-5">
      <div className="relative min-h-64 md:col-span-2">
        <Image src="/images/benefits/relocation.jpg" alt="" fill sizes="(min-width: 1600px) 576px, (min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="relative isolate p-7 sm:p-10 md:col-span-3">
        <div aria-hidden="true" className={styles.ornament} />
        <SectionLabel>Поддержка в поиске</SectionLabel>
        <h2 id="job-search-support" className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Не знаете, с каких стран и школ начать?</h2>
        <p className="mt-4 max-w-[68ch] leading-relaxed text-neutral-600">В рамках START мы поможем оценить ваш профиль, определить подходящие направления и составить понятный план самостоятельного поиска.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/consultation" className="action-gradient rounded-full px-6 py-3 text-sm font-medium text-white">Получить консультацию</Link>
          <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
        </div>
      </div>
    </section>
  );
}
