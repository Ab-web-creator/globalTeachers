import Image from "next/image";
import BenefitIcon from "./benefit-icon";
import type { Benefit } from "./benefits-content";

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <li data-reveal className={`relative isolate grid w-full grid-cols-[1fr_3fr] overflow-hidden rounded-3xl text-left @min-[37rem]:block @min-[37rem]:max-w-64 @min-[37rem]:justify-self-center @min-[37rem]:text-center ${benefit.color}`}>
      <div className="relative min-h-32 @min-[37rem]:aspect-5/2 @min-[37rem]:min-h-0">
        <Image
          src={benefit.image}
          alt=""
          fill
          sizes="(max-width: 671px) 25vw, 256px"
          className="object-cover"
        />
      </div>
      <div className="relative min-w-0 p-4 @min-[37rem]:px-6 @min-[37rem]:pt-0 @min-[37rem]:pb-7">
        <div className={`float-right ml-2 flex size-8 items-center justify-center rounded-full shadow-sm [&>svg]:size-5 @min-[37rem]:float-none @min-[37rem]:mx-auto @min-[37rem]:-mt-12 @min-[37rem]:mb-3 @min-[37rem]:size-24 @min-[37rem]:[&>svg]:size-10 ${benefit.iconColor}`}>
          <BenefitIcon name={benefit.id} />
        </div>
        <h3 className="text-lg leading-tight font-bold tracking-tight text-brand-950 @min-[37rem]:text-xl">
          {benefit.title}
        </h3>
        <p className={`mt-2 text-base leading-tight font-bold ${benefit.accentColor}`}>
          {benefit.subtitle}
        </p>
        <p className="mt-3 text-left text-base leading-normal text-neutral-700 @min-[37rem]:mt-5 @min-[37rem]:leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </li>
  );
}
