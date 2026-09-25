import Image from "next/image";
import type { PanelProps } from "../content";

export default function FooterBanner({ openPanel }: PanelProps) {
  return (
    <div data-reveal className="relative isolate overflow-hidden rounded-2xl bg-brand-50 px-6 py-6 sm:px-8 lg:px-10">
      <Image src="/images/benefits/flights.jpg" alt="" fill sizes="(max-width: 1600px) 100vw, 1440px" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-50 via-amber-50/95 to-transparent" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8 lg:pr-48">
        <div>
          <h2 className="text-2xl leading-tight font-semibold tracking-tight text-brand-600">Готовы начать международную карьеру?</h2>
          <p className="mt-2 text-base leading-normal text-neutral-600">Расскажите нам о своём опыте — поможем определить ваши возможности.</p>
        </div>
        <button type="button" onClick={() => openPanel("Consultation")} className="inline-flex shrink-0 items-center justify-center gap-5 self-start rounded-full bg-brand-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-brand-700 lg:self-center">
          Получить консультацию <span aria-hidden="true" className="text-xl leading-none">→</span>
        </button>
      </div>
    </div>
  );
}
