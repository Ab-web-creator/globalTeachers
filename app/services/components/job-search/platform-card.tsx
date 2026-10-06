import Image from "next/image";
import styles from "./platform-card.module.css";

type PlatformCardProps = {
  name: string;
  text: string;
  href?: string;
  logo?: string;
  logoClass?: string;
  background: string;
  image?: string;
  imageClass?: string;
  ornament?: boolean;
};

export default function PlatformCard({ name, text, href, logo, logoClass, background, image, imageClass = "", ornament = false }: PlatformCardProps) {
  const external = href?.startsWith("https://") ?? false;
  const className = `group relative isolate flex min-h-48 w-full gap-4 overflow-hidden rounded-3xl p-5 sm:min-h-52 sm:gap-5 sm:p-6 ${background}`;

  const content = (
    <>
      {ornament && <span aria-hidden="true" className={styles.ornament} />}
      <span className="flex min-w-0 flex-1 flex-col items-start py-2">
        <span className="flex min-h-12 w-full items-center">
          {logo && name !== "Teacher Horizons" ? (
            <Image src={logo} alt={name} width={240} height={64} className={`max-w-full object-contain object-left ${logoClass} w-auto`} />
          ) : (
            <span className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{name}</span>
          )}
        </span>
        <span className="mt-3 mb-5 text-base leading-relaxed text-neutral-700">{text}</span>
        {href && (
          <span aria-hidden="true" className="mt-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-500 shadow-sm sm:size-11">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        )}
      </span>
      {image && (
        <span className="relative w-2/5 shrink-0 overflow-hidden rounded-2xl">
          <Image src={image} alt="" fill sizes="(min-width: 1600px) 180px, (min-width: 1280px) 13vw, (min-width: 768px) 20vw, 40vw" className={`object-cover ${imageClass}`} />
          {name === "Teacher Horizons" && logo && (
            <span className="absolute top-3 right-3 aspect-square w-1/3 max-w-12">
              <Image src={logo} alt="" fill sizes="48px" className="object-contain" />
            </span>
          )}
        </span>
      )}
    </>
  );

  if (!href) return <div className={className}>{content}</div>;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={external ? `${name} — открыть платформу в новой вкладке` : name}
      className={`${className} transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none`}
    >
      {content}
    </a>
  );
}
