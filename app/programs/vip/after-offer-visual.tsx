import Image from "next/image";

export default function AfterOfferVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xs">
      <Image src="/images/vip-after-offer-illustration.png" alt="Документы, паспорт и подготовка к переезду" width={1254} height={1254} sizes="320px" className="h-auto w-full object-contain mask-r-from-95% mask-b-from-95% mask-l-from-95% mask-t-from-95%" />
      <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="absolute right-0 bottom-0 -rotate-3 text-right text-xl italic leading-relaxed text-brand-500">Новый этап.<br />Мы рядом.</p>
    </div>
  );
}
