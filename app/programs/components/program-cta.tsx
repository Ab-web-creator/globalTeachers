import Link from "next/link";
import SupportBanner from "../../services/components/support-banner";

type Props = { tier: string; price: number | null; title: string; text: string; image: string };

export default function ProgramCta({ tier, price, title, text, image }: Props) {
  return (
    <SupportBanner id={`${tier.toLowerCase()}-price`} label={`Стоимость ${tier}`} title={title} text={text} image={image}>
      <p className="w-full">
        <span className="text-4xl font-semibold text-brand-500">{price === null ? "Индивидуально" : `$${price}`}</span>
        <span className="ml-3 text-sm text-neutral-500">{price === null ? "стоимость по запросу" : "единоразовая оплата"}</span>
      </p>
      <Link href="/consultation" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">Выбрать {tier} <span aria-hidden="true">→</span></Link>
      <Link href="/#programs" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">Сравнить программы</Link>
    </SupportBanner>
  );
}
