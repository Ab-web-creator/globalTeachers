import type { Panel } from "./content";

export const navigationItems: { label: string; panel: Panel; expandable?: boolean }[] = [
  { label: "О нас", panel: "About" },
  { label: "Вакансии?", panel: "Jobs" },
  { label: "Контакты", panel: "Contact" },
];
