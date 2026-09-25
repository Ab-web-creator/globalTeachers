import Image from "next/image";
import BenefitIcon from "./benefit-icon";
import type { Benefit } from "./benefits-content";

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <li className={`relative isolate w-full max-w-72 justify-self-center overflow-hidden rounded-3xl text-center ${benefit.color}`}>
      <div className="relative aspect-5/3">
        <Image
          src={benefit.image}
          alt=""
          fill
          sizes="288px"
          className="object-cover"
        />
      </div>
      <div className="relative px-6 pb-7">
        <div className={`relative mx-auto -mt-12 mb-3 flex size-24 items-center justify-center rounded-full shadow-sm ${benefit.iconColor}`}>
          <BenefitIcon name={benefit.id} />
        </div>
        <h3 className="text-xl leading-tight font-bold tracking-tight text-brand-950">
          {benefit.title}
        </h3>
        <p className={`mt-2 text-md leading-tight font-bold ${benefit.accentColor}`}>
          {benefit.subtitle}
        </p>
        <p className="mt-5 text-left text-base leading-relaxed text-neutral-700">
          {benefit.description}
        </p>
      </div>
    </li>
  );
}
