const tones = {
  weak: { box: "bg-rose-50", badge: "bg-rose-500", label: "text-rose-500", dot: "bg-rose-400", icon: "M6 6l12 12M18 6 6 18" },
  strong: { box: "bg-emerald-50", badge: "bg-emerald-500", label: "text-emerald-600", dot: "bg-emerald-400", icon: "m5 12 5 5 9-10" },
};

type Note = { sticker: string; words: readonly string[] };

export default function ExperienceExample({ tone, label, text, note }: { tone: keyof typeof tones; label: string; text: string; note?: Note }) {
  const style = tones[tone];

  return (
    <div className={`flex h-full gap-4 rounded-3xl p-5 sm:gap-5 sm:p-6 ${style.box}`}>
      <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white sm:size-12 ${style.badge}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 sm:size-6"><path d={style.icon} /></svg>
      </span>
      <div className="min-w-0 pt-1 sm:pt-2">
        <p className={`text-sm font-semibold tracking-wide uppercase ${style.label}`}>{label}</p>
        <p className="mt-3 text-base leading-relaxed text-neutral-700 sm:text-lg">{text}</p>
        {note && (
          <>
            <p className={`mt-6 text-sm font-semibold tracking-wide uppercase ${style.label}`}>{note.sticker}:</p>
            <ul className="mt-3 space-y-1 text-base leading-relaxed text-neutral-700 sm:text-lg">
              {note.words.map((word) => (
                <li key={word} className="flex items-center gap-3">
                  <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
                  {word}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
