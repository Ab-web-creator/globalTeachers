const contacts = [
  { text: "hello@globalteacherhub.com", path: "M3 5h18v14H3zM3 5l9 7 9-7" },
  { text: "@GlobalTeacherHub", path: "m22 3-7 18-4-7-8-4 19-7ZM11 14l6-6" },
  { text: "+1 (234) 567 890 00", path: "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2C9 19 5 15 3 7 2 5 3 3 5 3Z" },
];

export default function FooterContact() {
  return (
    <div id="footer-contact" className="relative col-span-2 w-full max-w-md overflow-hidden rounded-3xl bg-brand-500/70 p-6 sm:p-7 lg:col-span-1">
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute -right-8 bottom-0 size-48 text-brand-300/15" aria-hidden="true">
        <path d="m10 35 50-23 50 23-50 23-50-23ZM30 45v23q30 20 60 0V45M110 35v40M18 82l45-14 47 18-46 18-46-22ZM18 90l46 22 46-18M18 98l46 22 46-18" />
      </svg>
      <div className="relative">
        <h2 className="text-lg leading-tight font-semibold">Связаться с нами</h2>
        <ul className="mt-5 space-y-4 text-sm text-brand-100">
          {contacts.map(({ text, path }) => (
            <li key={text} className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" aria-hidden="true"><path d={path} /></svg>
              <span className="min-w-0 break-words">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
