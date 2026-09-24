import type { Panel, PanelProps } from "../content";

type FooterLink = { label: string; href: string } | { label: string; panel: Panel };
const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Навигация",
    links: [
      { label: "Главная", href: "#home" },
      { label: "О нас", href: "#about" },
      { label: "Программы", href: "#programs" },
      { label: "Вакансии", panel: "Jobs" },
      { label: "Полезное", href: "#categories" },
    ],
  },
  {
    title: "Полезное",
    links: [
      { label: "Международные школы", href: "#partners-title" },
      { label: "Страны и направления", href: "#benefits" },
      { label: "Подготовка к интервью", href: "#categories" },
      { label: "CV и портфолио", href: "#categories" },
      { label: "FAQ", panel: "Consultation" },
    ],
  },
];

export default function FooterLinks({ openPanel }: PanelProps) {
  const linkClass = "text-left transition hover:text-white hover:underline underline-offset-4";
  return groups.map(({ title, links }) => (
    <nav key={title} aria-label={`Подвал: ${title}`} className="xl:pt-7">
      <h2 className="text-lg leading-tight font-medium text-white">{title}</h2>
      <ul className="mt-5 space-y-2 text-sm leading-normal text-brand-100">
        {links.map((link) => (
          <li key={link.label}>
            {"href" in link ? (
              <a href={link.href} className={linkClass}>{link.label}</a>
            ) : (
              <button type="button" onClick={() => openPanel(link.panel)} className={linkClass}>{link.label}</button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  ));
}
