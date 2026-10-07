import Image from "next/image";

export default function AfterOfferVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <Image src="/images/vip-after-offer-transparent.webp" alt="Документы, паспорт и подготовка к переезду" width={1254} height={1254} sizes="(min-width: 768px) 40vw, (min-width: 640px) 512px, 90vw" className="h-auto w-full object-contain" />
      <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="absolute bottom-1/8 left-1/4 -rotate-12 rounded-sm bg-brand-500 px-4 py-3 text-left text-sm italic leading-relaxed text-white shadow-md sm:px-5 sm:py-4 sm:text-lg">Новый этап.<br />Мы рядом.</p>
    </div>
  );
}
