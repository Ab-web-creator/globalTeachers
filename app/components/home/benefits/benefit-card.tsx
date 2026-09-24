import Image from "next/image";
import BenefitIcon from "./benefit-icon";
import type { Benefit } from "./benefits-content";

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <li className={`overflow-hidden rounded-3xl text-center ${benefit.color}`}>
      <div className="relative aspect-5/4">
        <Image
          src={`/images/benefits/${benefit.id}.jpg`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover"
        />
      </div>
      <div className="relative px-4 pb-7">
        <div className={`relative mx-auto -mt-10 mb-3 flex size-20 items-center justify-center rounded-full ${benefit.iconColor}`}>
          <BenefitIcon name={benefit.id} />
        </div>
        <h3 className={`leading-tight tracking-tight text-brand-950 ${benefit.subtitle ? "text-3xl font-semibold" : "text-xl font-medium"}`}>
          {benefit.title}
        </h3>
        {benefit.subtitle && (
          <p className="mt-1 text-base font-medium text-brand-950">{benefit.subtitle}</p>
        )}
        {benefit.label && (
          <p className="mt-4 text-lg leading-tight font-medium text-brand-950">{benefit.label}</p>
        )}
        <p className="mt-4 text-base leading-relaxed text-neutral-700">{benefit.description}</p>
        {benefit.detail && (
          <p className="mt-3 text-base leading-relaxed text-neutral-700">{benefit.detail}</p>
        )}
      </div>
    </li>
  );
}
