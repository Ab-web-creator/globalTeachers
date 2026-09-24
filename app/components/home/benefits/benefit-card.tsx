import Image from "next/image";
import BenefitIcon from "./benefit-icon";
import type { Benefit } from "./benefits-content";

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <li className={`w-full max-w-64 justify-self-center overflow-hidden rounded-3xl text-center ${benefit.color}`}>
      <div className="relative aspect-5/4">
        <Image
          src={`/images/benefits/${benefit.id}.jpg`}
          alt=""
          fill
          sizes="256px"
          className="object-cover"
        />
      </div>
      <div className="relative px-4 pb-5">
        <div className={`relative mx-auto -mt-10 mb-3 flex size-20 items-center justify-center rounded-full ${benefit.iconColor}`}>
          <BenefitIcon name={benefit.id} />
        </div>
        <h3 className="text-2xl leading-tight font-semibold tracking-tight text-brand-950 lg:text-xl">
          {benefit.title}
        </h3>
        {benefit.subtitle && (
          <p className="mt-2 text-base leading-tight font-medium text-brand-950 lg:text-sm">
            {benefit.subtitle}
          </p>
        )}
        <p className="mt-3 text-left text-base leading-normal text-neutral-700 lg:text-sm">{benefit.description}</p>
      </div>
    </li>
  );
}
