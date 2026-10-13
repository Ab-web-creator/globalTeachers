"use client";

import { PlatformExternalLinkIcon } from "@/app/components/svg";
import useScrollReveal from "@/app/components/home/use-scroll-reveal";
import Image from "next/image";
import SectionHeading from "../section-heading";
import { recruitmentPlatforms } from "./content";
import styles from "./platform-card.module.css";
import SectionLabel from "./section-label";

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

const cardVisuals = [
  { background: "bg-linear-to-br from-brand-100 to-violet-100 hover:from-brand-300", image: "/images/platforms/international-school-campus.webp" },
  { background: "bg-linear-to-br from-accent-100 to-teal-50 hover:from-accent-200", image: "/images/benefits/development.webp" },
  { background: "bg-linear-to-br from-amber-100 to-orange-50 hover:from-amber-200", image: "/images/benefits/education-classroom.jpg" },
  { background: "bg-linear-to-br from-rose-100 to-pink-50 hover:from-rose-200", image: "/images/benefits/relocation.webp" },
  { background: "bg-linear-to-br from-sky-100 to-indigo-50 hover:from-sky-200", image: "/images/benefits/flights.webp" },
];

const desktopLogoHeights: Record<string, string> = {
  "h-9": "sm:h-9",
  "h-10": "sm:h-10",
  "h-11": "sm:h-11",
  "h-12": "sm:h-12",
  "h-14": "sm:h-14",
};

export default function RecruitmentPlatforms() {
  useScrollReveal("#recruitment-platform-cards [data-reveal]", true);
  return (
    <section id="job-platforms" aria-labelledby="recruitment-platforms" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-t from-violet-50 via-sky-50/60 to-transparent py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="max-w-3xl">
          <SectionLabel>Полезные ресурсы</SectionLabel>
          <SectionHeading id="recruitment-platforms" className="text-brand-950">
            Полезные платформы для{" "}<br className="hidden sm:block" />поиска вакансий
          </SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">
            Существует несколько веб-платформ, на которых международные школы из разных стран публикуют вакансии. Используйте их, чтобы найти позиции, которые соответствуют вашему опыту, предмету и желаемой стране.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            <strong className="font-semibold text-brand-950">Совет:</strong> создайте профиль на нескольких платформах и настройте уведомления о новых вакансиях — так вы не пропустите подходящие возможности.
          </p>
        </div>
        <ul id="recruitment-platform-cards" className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {recruitmentPlatforms.map((platform, index) => (<li data-reveal key={platform.name} className="flex">
            <PlatformCard {...platform} {...cardVisuals[index]} />
          </li>))}
          <li data-reveal className="flex">
            <PlatformCard name="И другие" text={"Также стоит проверять платформы конкретных образова­тельных групп и сетей школ."} background="bg-linear-to-br from-purple-300 to-purple-200" ornament />
          </li>
        </ul>
      </div>
    </section>
  );
}

function PlatformCard({ name, text, href, logo, logoClass, background, image, imageClass = "", ornament = false }: PlatformCardProps) {
  const external = href?.startsWith("https://") ?? false;
  const className = `group relative isolate grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 overflow-hidden rounded-3xl p-5 sm:flex sm:min-h-52 sm:items-stretch sm:gap-5 sm:p-6 ${background}`;
  const content = (<>
    {ornament && <span aria-hidden="true" className={styles.ornament} />}
    <span className={`col-start-1 row-span-3 row-start-1 flex min-w-0 flex-col items-start sm:flex-1 sm:py-2 ${image ? "" : "col-span-2"}`}>
      <span className={`col-start-1 row-start-1 flex min-w-0 w-full items-center sm:min-h-12 ${image ? "" : "col-span-2"}`}>
        {logo && name !== "Teacher Horizons" ? (<Image src={logo} alt={name} width={240} height={64} className={`h-auto max-h-10 max-w-full object-contain object-left sm:max-h-none ${desktopLogoHeights[logoClass ?? ""] ?? ""} w-auto`} />) : (<span className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{name}</span>)}
      </span>
      <span className="mt-2 text-base leading-normal text-neutral-700 sm:mt-3 sm:mb-5 sm:leading-relaxed">{text}</span>
      {href && (<span aria-hidden="true" className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-500 sm:mt-auto sm:size-11 sm:shrink-0 sm:justify-center sm:rounded-full sm:bg-white sm:shadow-sm">
        <span className="underline underline-offset-4 sm:hidden">Открыть платформу</span>
        <span className="hidden sm:block"><PlatformExternalLinkIcon /></span>
      </span>)}
    </span>
    {image && (<span className="relative col-start-2 row-span-2 row-start-1 size-20 shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:w-2/5">
      <Image src={image} alt="" fill sizes="(min-width: 1600px) 180px, (min-width: 1280px) 13vw, (min-width: 768px) 20vw, (min-width: 640px) 40vw, 80px" className={`object-cover ${imageClass}`} />
      {name === "Teacher Horizons" && logo && (<span className="absolute top-3 right-3 aspect-square w-1/3 max-w-12">
        <Image src={logo} alt="" fill sizes="48px" className="object-contain" />
      </span>)}
    </span>)}
  </>
  );
  if (!href)
    return <div className={className}>{content}</div>;
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={external ? `${name} — открыть платформу в новой вкладке` : name} className={`${className} transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none`}>
      {content}
    </a>
  );
}
