const contacts = [
  { text: "hello@globalteacherhub.com", path: "M3 5h18v14H3zM3 5l9 7 9-7" },
  { text: "@GlobalTeacherHub", path: "m22 3-7 18-4-7-8-4 19-7ZM11 14l6-6" },
  { text: "+1 (234) 567 890 00", path: "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2C9 19 5 15 3 7 2 5 3 3 5 3Z" },
];

export default function FooterContact() {
  return (
    <div id="footer-contact" className="col-span-2 w-full min-w-0 text-white sm:col-span-1 lg:pt-7">
      <h2 className="text-lg leading-tight font-medium">Связаться с нами</h2>
      <ul className="mt-5 space-y-4 text-base leading-normal text-white/90 sm:text-sm">
        {contacts.map(({ text, path }) => (
          <li key={text} className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" aria-hidden="true"><path d={path} /></svg>
            <span className="min-w-0 break-words">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
