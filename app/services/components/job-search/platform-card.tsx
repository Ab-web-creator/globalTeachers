import Image from "next/image";

type PlatformCardProps = {
  name: string;
  text: string;
  href: string;
  logo?: string;
  logoClass?: string;
  background: string;
  image: string;
  imageClass?: string;
};

export default function PlatformCard({ name, text, href, logo, logoClass, background, image, imageClass = "" }: PlatformCardProps) {
  const external = href.startsWith("https://");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={external ? `${name} — открыть платформу в новой вкладке` : name}
      className={`group flex min-h-56 w-full gap-3 rounded-3xl p-4 transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none sm:min-h-60 sm:gap-4 ${background}`}
    >
      <span className="flex min-w-0 flex-1 flex-col items-start py-3 pl-2">
        <span className="flex min-h-12 w-full items-center">
          {logo && name !== "Teacher Horizons" ? (
            <Image src={logo} alt={name} width={240} height={64} className={`max-w-full object-contain object-left ${logoClass} w-auto`} />
          ) : (
            <span className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{name}</span>
          )}
        </span>
        <span className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{text}</span>
        <span aria-hidden="true" className="mt-auto flex size-10 items-center justify-center rounded-full bg-white text-brand-500 shadow-sm sm:size-11">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </span>
      </span>
      <span className="relative w-2/5 shrink-0 overflow-hidden rounded-2xl">
        <Image src={image} alt="" fill sizes="(min-width: 1600px) 180px, (min-width: 1280px) 13vw, (min-width: 768px) 20vw, 40vw" className={`object-cover ${imageClass}`} />
        {name === "Teacher Horizons" && logo && (
          <span className="absolute inset-x-2 top-3 rounded-lg bg-white/90 p-2">
            <Image src={logo} alt="" width={180} height={64} className="h-auto w-full object-contain" />
          </span>
        )}
      </span>
    </a>
  );
}
