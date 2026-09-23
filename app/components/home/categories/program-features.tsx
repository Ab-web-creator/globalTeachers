const paths: Record<string, string> = {
  profile: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-3a8 8 0 0 1 16 0v3",
  chat: "M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4ZM8 10h.01M12 10h.01M16 10h.01",
  document: "M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8M8 16h6",
  support: "M3 14v-3a9 9 0 0 1 18 0v3M3 13h4v8H3v-8Zm14 0h4v8h-4v-8ZM21 21l-5 2",
  folder: "M2 6V3h7l3 3h10v15H2V6Zm0 3h20",
  target: "M20 12a8 8 0 1 1-8-8M16 12a4 4 0 1 1-4-4M12 12 22 2M17 2h5v5",
  star: "m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1 3-6Z",
};

export default function ProgramFeatures({ features, icons }: { features: string[]; icons: string[] }) {
  return (
    <ul className="space-y-4 py-6">
      {features.map((feature, index) => (
        <li key={feature} className="flex items-start gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-5 mt-1 shrink-0 text-brand-500" aria-hidden="true"><path d={paths[icons[index]]} /></svg>
          <span className="min-w-0 font-semibold wrap-break-word text-sm leading-6 text-neutral-800">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
