import type { Panel } from "./content";

export const navigationItems: { label: string; panel: Panel; expandable?: boolean }[] = [
  { label: "О нас", panel: "About" },
  { label: "Услуги", panel: "Courses", expandable: true },
  { label: "Вакансии?", panel: "Jobs" },
  { label: "Полезное", panel: "Pages", expandable: true },
  { label: "Контакты", panel: "Contact" },
];
