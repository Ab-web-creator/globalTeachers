import type { Panel, PanelProps } from "../content";

type FooterLink = { label: string; href: string } | { label: string; panel: Panel };
const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Навигация",
    links: [
      { label: "Главная", href: "#home" },
      { label: "О нас", href: "#about" },
      { label: "Программы", href: "#programs" },
      { label: "Вакансии", href: "/jobs" },
    ],
  },
];

export default function FooterLinks({ openPanel }: PanelProps) {
  const linkClass = "text-left text-base text-white/90 transition hover:text-white hover:underline underline-offset-4 sm:text-sm";
  const links = groups.flatMap((group) => group.links);

  return (
    <nav aria-label="Подвал" className="lg:pt-2">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
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
  );
}
