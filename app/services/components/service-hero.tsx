import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import BackLink from "./back-link";

type ServiceHeroProps = { image: string; children: ReactNode; imageAspectRatio?: string; backHref?: string; stretchImage?: boolean; imageHeightScale?: number; backLinkClassName?: string };

const imageSizes = "(min-width: 1600px) 688px, (min-width: 1024px) 45vw, 100vw";

// Stacked, the image spans the full width but stays no taller than max-h-130; on lg it sits beside the text,
// at least as tall as the text column, and fades into it.
export default function ServiceHero({ image, children, imageAspectRatio = "1", backHref, stretchImage = true, imageHeightScale = 1, backLinkClassName = "lg:absolute lg:top-10 lg:left-4" }: ServiceHeroProps) {
  return (
    <header className="relative isolate mt-2 grid items-start gap-8 bg-white lg:mt-0 lg:grid-cols-2 lg:gap-16">
      <BackLink href={backHref} className={backLinkClassName} />
      <div className="relative z-10 lg:order-2 lg:py-6">{children}</div>
      <div aria-hidden="true" style={{ "--hero-aspect": imageAspectRatio, clipPath: imageHeightScale === 1 ? undefined : `inset(0 0 ${(1 - imageHeightScale) * 100}% 0)` } as CSSProperties} className={`relative aspect-(--hero-aspect) max-h-130 w-full overflow-hidden lg:order-1 lg:mt-6 lg:max-h-none ${stretchImage ? "lg:self-stretch" : "lg:self-start"}`}>
        <Image src={image} alt="" fill preload sizes={imageSizes} className="object-cover object-center" />
        <div className="absolute inset-0 hidden bg-linear-to-l from-white via-transparent to-transparent lg:block" />
      </div>
    </header>
  );
}
