import Image from "next/image";
import type { ReactNode } from "react";
import SectionLabel from "./job-search/section-label";
import styles from "./support-banner.module.css";

type Props = { id: string; label: string; title: string; text: string; image: string; imageClassName?: string; imageContainerClassName?: string; children: ReactNode };

export default function SupportBanner({ id, label, title, text, image, imageClassName = "", imageContainerClassName = "", children }: Props) {
  return (
    <aside aria-labelledby={id} className="-mx-6 -mb-12 grid overflow-hidden bg-linear-to-br from-brand-50 to-brand-300/20 sm:mx-0 sm:mb-0 sm:rounded-3xl md:grid-cols-5">
      <div className={`relative min-h-40 md:col-span-2 ${imageContainerClassName}`}>
        <Image src={image} alt="" fill sizes="(min-width: 1600px) 576px, (min-width: 768px) 40vw, 100vw" className={`object-cover ${imageClassName}`} />
      </div>
      <div className="relative isolate p-5 sm:p-6 md:col-span-3">
        <div aria-hidden="true" className={styles.ornament} />
        <SectionLabel>{label}</SectionLabel>
        <h2 id={id} className="max-w-[36ch] text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-neutral-600">{text}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>
      </div>
    </aside>
  );
}
