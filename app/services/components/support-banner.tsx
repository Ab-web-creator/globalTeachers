import Image from "next/image";
import type { ReactNode } from "react";
import SectionLabel from "./job-search/section-label";
import SectionHeading from "./section-heading";
import styles from "./support-banner.module.css";

type Props = { id: string; label: string; title: string; text: string; image: string; children: ReactNode };

export default function SupportBanner({ id, label, title, text, image, children }: Props) {
  return (
    <aside aria-labelledby={id} className="-mx-6 -mb-12 grid overflow-hidden bg-linear-to-br from-brand-50 to-brand-300/20 sm:mx-0 sm:mb-0 sm:rounded-3xl md:grid-cols-5">
      <div className="relative min-h-64 md:col-span-2">
        <Image src={image} alt="" fill sizes="(min-width: 1600px) 576px, (min-width: 768px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="relative isolate p-7 pb-10 sm:p-10 md:col-span-3">
        <div aria-hidden="true" className={styles.ornament} />
        <SectionLabel>{label}</SectionLabel>
        <SectionHeading id={id}>{title}</SectionHeading>
        <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-neutral-600">{text}</p>
        <div className="mt-7 flex flex-wrap gap-3">{children}</div>
      </div>
    </aside>
  );
}
