import Link from "next/link";
import { services } from "../../../services/services";
import { programs } from "../categories/programs";

const groups = [
  {
    title: "Навигация",
    links: [
      { label: "О нас", href: "/#about" },
      { label: "Программы", href: "/#programs" },
      { label: "Вакансии", href: "/services/job-search#job-platforms" },
    ],
  },
  {
    title: "Услуги",
    links: services.map(({ title, slug }) => ({ label: title, href: `/services/${slug}` })),
  },
  {
    title: "Программы",
    links: programs.map(({ tier }) => ({ label: `Программа ${tier}`, href: `/programs/${tier.toLowerCase()}` })),
  },
];

export default function FooterLinks() {
  return (
    <nav aria-label="Страницы сайта" className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
      {groups.map((group, index) => (
        <div key={group.title} className={index === 1 ? "col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto" : index === 0 ? "xl:flex xl:flex-col" : undefined}>
          <h2 className="text-base font-semibold text-white">{group.title}</h2>
          <ul className={`mt-5 space-y-1.5 ${index === 0 ? "xl:mt-auto xl:pt-5" : ""}`}>
            {group.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm leading-relaxed text-white/90 underline-offset-4 transition hover:text-white hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
