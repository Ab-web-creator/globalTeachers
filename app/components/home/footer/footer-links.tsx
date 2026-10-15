import Link from "next/link";
import { services } from "../../../services/services";

const groups = [
  {
    title: "Навигация",
    links: [
      { label: "О нас", href: "/#about" },
      { label: "Как мы помогаем", href: "/#categories" },
      { label: "Тарифы", href: "/#plans" },
      { label: "Вакансии", href: "/services/job-search#job-platforms" },
    ],
  },
  {
    title: "Услуги",
    links: services.map(({ title, slug }) => ({ label: title, href: `/services/${slug}` })),
  },
];

export default function FooterLinks() {
  return (
    <nav aria-label="Страницы сайта" className="grid gap-8 sm:grid-cols-2 sm:gap-10">
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="text-base font-semibold text-white xl:flex xl:h-14 xl:items-end">{group.title}</h2>
          <ul className="mt-2 space-y-1.5 sm:mt-5 xl:space-y-0.5">
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
