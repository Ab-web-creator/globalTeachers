const languages = [
  { code: "ru", flag: "🇷🇺", name: "Русский", available: true },
  { code: "uz", flag: "🇺🇿", name: "O‘zbekcha", available: false },
];

export default function MenuLanguages() {
  return (
    <div aria-label="Язык сайта" className="flex items-center gap-2">
      {languages.map(({ code, flag, name, available }) => (
        <button
          key={code}
          type="button"
          disabled={!available}
          aria-label={available ? `${name} — текущий язык` : `${name} — скоро`}
          aria-pressed={available}
          title={available ? name : `${name} — скоро`}
          className="flex size-11 items-center justify-center rounded-xl text-2xl transition enabled:bg-brand-50 enabled:ring-1 enabled:ring-brand-200 disabled:cursor-default disabled:opacity-40"
        >
          <span aria-hidden="true">{flag}</span>
        </button>
      ))}
    </div>
  );
}
