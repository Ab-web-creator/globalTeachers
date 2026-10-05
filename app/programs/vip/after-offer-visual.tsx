import Image from "next/image";

export default function AfterOfferVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-4 rounded-full bg-brand-300/15 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-3xl bg-brand-300/10 shadow-xl shadow-brand-500/10">
        <Image src="/images/benefits/visa-passport.jpg" alt="Паспорт и документы для поездки" width={640} height={480} sizes="(min-width: 1024px) 448px, 90vw" className="aspect-4/3 w-full object-cover" />
      </div>
      <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="mt-6 -rotate-3 text-right text-xl italic leading-relaxed text-brand-400">Новый этап.<br />Мы рядом.</p>
    </div>
  );
}
