import Image from "next/image";
import Link from "next/link";
import GuideIcon from "./guide-icon";

export default function SearchSupport() {
  return (
    <section aria-labelledby="job-search-support" className="grid overflow-hidden rounded-3xl bg-linear-to-br from-brand-50 to-brand-300/20 md:grid-cols-5">
      <div className="relative min-h-64 md:col-span-2">
        <Image src="/images/benefits/relocation.jpg" alt="" fill sizes="(min-width: 1600px) 576px, (min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="relative overflow-hidden p-7 sm:p-10 md:col-span-3">
        <GuideIcon name="globe" className="pointer-events-none absolute -right-10 -bottom-12 size-56 text-brand-500/5" />
        <div className="relative">
          <h2 id="job-search-support" className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Не знаете, с каких стран и школ начать?</h2>
          <p className="mt-4 leading-relaxed text-neutral-600">В рамках START мы поможем оценить ваш профиль, определить подходящие направления и составить понятный план самостоятельного поиска.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/consultation" className="action-gradient rounded-full px-6 py-3 text-sm font-medium text-white">Получить консультацию</Link>
            <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
