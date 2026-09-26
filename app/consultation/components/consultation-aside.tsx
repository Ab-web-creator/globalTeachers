const highlights = [
  { text: "Работа за рубежом", path: "m22 2-7 20-4-9-9-4 20-7ZM11 13l6-6" },
  { text: "Международное сообщество", path: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" },
  { text: "Развитие и поддержка", path: "M12 5C8 2 4 2 2 3v17c3-1 6-1 10 2 4-3 7-3 10-2V3c-3-1-6-1-10 2Zm0 0v17" },
  { text: "Понятный путь вперёд", path: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-3 5-5 3 3-5 5-3Z" },
];

export default function ConsultationAside() {
  return (
    <aside className="hidden self-stretch pt-8 xl:flex xl:flex-col xl:justify-between">
      <p className="border-l border-slate-300 pl-4 text-sm leading-relaxed text-slate-500">Учителя меняют мир.<br />Начните свою новую главу вместе с нами.</p>
      <ul className="my-10 space-y-7">
        {highlights.map(({ text, path }) => <li key={text} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-6 shrink-0" aria-hidden="true"><path d={path} /></svg>{text}</li>)}
      </ul>
      <p className="pb-10 text-lg italic leading-snug text-slate-600">Ваш опыт.<br />Новые горизонты.<span className="mt-3 block h-0.5 w-16 -rotate-6 bg-amber-400" /></p>
    </aside>
  );
}
