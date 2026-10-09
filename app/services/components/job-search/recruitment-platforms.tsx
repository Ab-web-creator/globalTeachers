import { PlatformExternalLinkIcon } from "@/app/components/svg";
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
  { background: "bg-linear-to-br from-sky-100 to-indigo-50 hover:from-sky-200", image: "/images/benefits/flights.jpg" },
];

export default function RecruitmentPlatforms() {
  return (
    <section aria-labelledby="recruitment-platforms" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-t from-violet-50 via-sky-50/60 to-transparent py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="max-w-3xl">
          <SectionLabel>Полезные ресурсы</SectionLabel>
          <SectionHeading id="recruitment-platforms" className="text-brand-950">
            Полезные платформы для<br />поиска вакансий
          </SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">
            Существует несколько веб-платформ, на которых международные школы из разных стран публикуют вакансии. Используйте их, чтобы найти позиции, которые соответствуют вашему опыту, предмету и желаемой стране.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            <strong className="font-semibold text-brand-950">Совет:</strong> создайте профиль на нескольких платформах и настройте уведомления о новых вакансиях — так вы не пропустите подходящие возможности.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {recruitmentPlatforms.map((platform, index) => (<li key={platform.name} className="flex">
            <PlatformCard {...platform} {...cardVisuals[index]} />
          </li>))}
          <li className="flex">
            <PlatformCard name="И другие" text={"Также стоит проверять платформы конкретных образова­тельных групп и сетей школ."} background="bg-linear-to-br from-purple-300 to-purple-200" ornament />
          </li>
        </ul>
      </div>
    </section>
  );
}

function PlatformCard({ name, text, href, logo, logoClass, background, image, imageClass = "", ornament = false }: PlatformCardProps) {
  const external = href?.startsWith("https://") ?? false;
  const className = `group relative isolate flex min-h-48 w-full gap-4 overflow-hidden rounded-3xl p-5 sm:min-h-52 sm:gap-5 sm:p-6 ${background}`;
  const content = (<>
    {ornament && <span aria-hidden="true" className={styles.ornament} />}
    <span className="flex min-w-0 flex-1 flex-col items-start py-2">
      <span className="flex min-h-12 w-full items-center">
        {logo && name !== "Teacher Horizons" ? (<Image src={logo} alt={name} width={240} height={64} className={`max-w-full object-contain object-left ${logoClass} w-auto`} />) : (<span className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{name}</span>)}
      </span>
      <span className="mt-3 mb-5 text-base leading-relaxed text-neutral-700">{text}</span>
      {href && (<span aria-hidden="true" className="mt-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-500 shadow-sm sm:size-11">
        <PlatformExternalLinkIcon />
      </span>)}
    </span>
    {image && (<span className="relative w-2/5 shrink-0 overflow-hidden rounded-2xl">
      <Image src={image} alt="" fill sizes="(min-width: 1600px) 180px, (min-width: 1280px) 13vw, (min-width: 768px) 20vw, 40vw" className={`object-cover ${imageClass}`} />
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
