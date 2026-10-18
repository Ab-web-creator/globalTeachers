"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import BackLink from "./back-link";

type ServiceHeroProps = { image: string; children: ReactNode; imageAspectRatio?: string; backHref?: string; stretchImage?: boolean; imageHeightScale?: number; imageTopCrop?: number; matchTextHeight?: boolean; backLinkClassName?: string };

const imageSizes = "(min-width: 1600px) 688px, (min-width: 1024px) 45vw, 100vw";

// Stacked, the image spans the full width but stays no taller than max-h-130; on lg it sits beside the text,
// exactly as tall as the text content, and fades into it.
export default function ServiceHero({ image, children, imageAspectRatio = "1", backHref, imageHeightScale = 1, imageTopCrop = 0, backLinkClassName = "lg:absolute lg:top-10 lg:left-4" }: ServiceHeroProps) {
  const t = useTranslations();
  return (
    <header className="relative isolate mt-2 grid items-start gap-8 pb-12 lg:mt-0 lg:grid-cols-2 lg:gap-16 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[22.5%] w-screen -translate-x-1/2 bg-linear-to-t from-purple-100 via-purple-50/60 to-transparent" />
      <BackLink href={backHref} className={backLinkClassName} />
      <div className="relative z-10 lg:order-2 lg:py-6">{t.content(children)}</div>
      <div aria-hidden="true" style={{ "--hero-aspect": imageAspectRatio, "--hero-clip": imageHeightScale === 1 && imageTopCrop === 0 ? undefined : `inset(${imageTopCrop * 100}% 0 ${(1 - imageHeightScale) * 100}% 0)` } as CSSProperties} className="relative aspect-(--hero-aspect) max-h-130 w-full overflow-hidden [clip-path:var(--hero-clip)] lg:order-1 lg:my-6 lg:aspect-auto lg:min-h-0 lg:max-h-none lg:self-stretch lg:[clip-path:none]">
        <Image src={image} alt="" fill preload sizes={imageSizes} className="object-cover object-center" />
        <div className="absolute inset-0 hidden bg-linear-to-l from-white via-transparent to-transparent lg:block" />
      </div>
    </header>
  );
}
