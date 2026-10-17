import { BritishFlagIcon, KyrgyzFlagIcon, RussianFlagIcon, UzbekFlagIcon } from "@/app/components/svg";

const languages = [
  { code: "ru", flag: "🇷🇺", name: "Русский", available: true, Icon: RussianFlagIcon },
  { code: "uz", flag: "🇺🇿", name: "O‘zbekcha", available: false, Icon: UzbekFlagIcon },
  { code: "ky", flag: "🇰🇬", name: "Кыргызча", available: false, Icon: KyrgyzFlagIcon },
  { code: "en", flag: "🇬🇧", name: "English", available: false, Icon: BritishFlagIcon },
];

export default function MenuLanguages({ compact = false, pill = false }: { compact?: boolean; pill?: boolean }) {
  return (
    <div aria-label="Язык сайта" className={pill ? "flex items-center divide-x divide-neutral-300 rounded-xl bg-white/90 p-0.5 shadow-sm" : "flex items-center gap-2"}>
      {languages.filter(({ code }) => !pill || code === "ru" || code === "uz").map(({ code, flag, name, available, Icon }) => (
        <button
          key={code}
          type="button"
          disabled={!available}
          aria-label={available ? `${name} — текущий язык` : `${name} — скоро`}
          aria-pressed={available}
          title={available ? name : `${name} — скоро`}
          className={pill ? "flex min-h-7 items-center justify-center gap-1.5 px-2 text-xs font-medium text-neutral-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-default disabled:text-neutral-400" : compact ? "flex h-6 w-6 items-center justify-center bg-transparent p-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-default disabled:opacity-40 disabled:saturate-50" : "flex size-11 items-center justify-center rounded-xl text-2xl transition enabled:bg-brand-50 enabled:ring-1 enabled:ring-brand-200 disabled:cursor-default disabled:opacity-40"}
        >
          {pill ? <><Icon className="h-3 w-5 rounded-sm" preserveAspectRatio="none" /><span>{code.toUpperCase()}</span></> : compact ? <Icon className="h-3 w-5" preserveAspectRatio="none" /> : <span aria-hidden="true">{flag}</span>}
        </button>
      ))}
    </div>
  );
}
