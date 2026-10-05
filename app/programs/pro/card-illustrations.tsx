export const cardIllustrations = {
  support: (
    <>
      <path d="M180 140C240 110 290 82 400 95V140Z" fill="currentColor" />
      <path d="M270 65h62a10 10 0 0 1 10 10v27a10 10 0 0 1-10 10h-33l-18 13v-13h-11a10 10 0 0 1-10-10V75a10 10 0 0 1 10-10Z" fill="white" stroke="currentColor" strokeWidth="3" />
      <path d="M313 42h57a9 9 0 0 1 9 9v24a9 9 0 0 1-9 9h-9v12l-17-12h-31a9 9 0 0 1-9-9V51a9 9 0 0 1 9-9Z" fill="white" stroke="currentColor" strokeWidth="3" />
      <path d="M321 60h40M277 84h20M277 94h39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  audience: (
    <>
      <path d="M95 140C180 115 230 115 290 60C330 25 350 45 400 90V140Z" fill="currentColor" />
      <path d="M270 140C340 115 370 100 328 85C280 65 330 55 335 45" stroke="white" strokeWidth="9" />
      <path d="M335 45V15M335 15C350 8 352 22 372 15L365 27C350 34 350 20 335 26" stroke="currentColor" strokeWidth="3" fill="currentColor" />
    </>
  ),
  documents: (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M230 140C280 106 330 100 400 112V140Z" fill="currentColor" stroke="none" />
      <rect x="290" y="50" width="66" height="79" rx="7" fill="white" transform="rotate(-12 290 50)" />
      <rect x="315" y="42" width="62" height="80" rx="7" fill="white" transform="rotate(8 315 42)" />
      <path d="M329 65l5 5 9-11M329 83h31M329 96h23" />
    </g>
  ),
  lesson: (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M220 140C275 115 340 95 400 109V140Z" fill="currentColor" stroke="none" />
      <rect x="268" y="43" width="111" height="64" rx="6" fill="white" />
      <path d="M288 107l-9 23M359 107l9 23M291 63h37M291 76h24M338 89l11-18 14 18Z" />
      <circle cx="352" cy="59" r="5" />
    </g>
  ),
  checklist: (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M210 140C280 107 335 105 400 119V140Z" fill="currentColor" stroke="none" />
      <rect x="296" y="46" width="76" height="82" rx="7" fill="white" />
      <rect x="317" y="39" width="34" height="13" rx="4" fill="white" />
      <path d="M308 68l4 4 7-8M308 89l4 4 7-8M308 110l4 4 7-8M330 69h28M330 90h28M330 111h20" />
    </g>
  ),
  choice: (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M285 140v-24c0-28-32-32-32-55M285 116c0-28 63-29 63-55" strokeDasharray="5 6" />
      <path d="M233 60V39l20-13 20 13v21ZM328 60V39l20-13 20 13v21Z" fill="white" />
      <path d="M249 60V48h8v12M344 60V48h8v12" />
      <circle cx="285" cy="126" r="6" fill="currentColor" stroke="none" />
    </g>
  ),
  search: (
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M190 140C270 113 345 109 400 123V140Z" fill="currentColor" stroke="none" />
      <circle cx="318" cy="83" r="43" fill="white" />
      <ellipse cx="318" cy="83" rx="18" ry="43" />
      <path d="M275 83h86M282 62h72M282 104h72M363 56c-14-19-35-3-23 11l12 14 12-14c3-4 3-8-1-11Z" fill="white" />
      <circle cx="352" cy="61" r="4" />
    </g>
  ),
  application: (
    <>
      <path d="M100 140C140 60 220 140 285 105S350 28 325 32C295 40 337 85 365 35" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />
      <path d="m350 25 35-15-12 34-7-12-16-7Zm16 7 19-22" stroke="currentColor" strokeWidth="2" className="text-brand-500/70" />
    </>
  ),
};

export type CardIllustration = keyof typeof cardIllustrations;
