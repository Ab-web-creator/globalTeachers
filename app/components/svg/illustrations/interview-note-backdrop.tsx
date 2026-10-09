

export function InterviewNoteBackdrop() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible">
      <defs>
        <linearGradient id="note-blob-main" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-white)" />
          <stop offset="1" stopColor="var(--color-violet-100)" />
        </linearGradient>
      </defs>
      <path d="M300 54c42 24 60 74 54 128s-28 108-80 136-130 30-180 2S22 232 30 176s46-104 100-128 128-18 170 6Z" className="fill-sky-100/80" transform="translate(190 -20) scale(0.55)" />
      <path d="M96 268c34-10 70 8 80 40s-12 64-46 72-66-12-74-42 6-60 40-70Z" className="fill-amber-100" />
      <path d="M300 64c40 30 58 84 48 136s-46 104-102 124-120 6-162-34-48-112-20-164S140 46 196 40s64-6 104 24Z" fill="url(#note-blob-main)" className="drop-shadow-xl" />
      <Sprig transform="translate(300 360)" />
      <Sprig transform="translate(100 130) scale(-1 1) rotate(-10)" />
      <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-brand-300">
        <path d="M300 26h52a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10h-30l-14 12v-12h-8a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10Z" className="fill-white" />
        <path d="M316 49h0M326 49h0M336 49h0" strokeWidth="4" />
        <path d="M20 300h36a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H44l-10 9v-9H20a8 8 0 0 1-8-8v-18a8 8 0 0 1 8-8Z" className="fill-white" />
      </g>
      <Sparkle x={36} y={210} size={10} className="fill-amber-300" />
      <Sparkle x={382} y={220} size={8} className="fill-brand-300" />
      <Sparkle x={240} y={390} size={7} className="fill-rose-300" />
    </svg>
  );
}

function Sprig({ transform }: { transform: string; }) {
  return (
    <g transform={transform}>
      <path d="M0 0C10 -30 30 -55 60 -70" fill="none" strokeWidth="2" className="stroke-emerald-400" />
      <path d="M14 -24c-14-4-22-16-20-28 12 2 22 14 20 28Z" className="fill-emerald-300" />
      <path d="M22 -38c4-14 16-22 28-20-2 12-14 22-28 20Z" className="fill-emerald-400/80" />
      <path d="M36 -54c-12-8-16-22-12-32 11 5 17 19 12 32Z" className="fill-emerald-300" />
      <path d="M46 -62c6-12 20-17 30-12-5 10-18 16-30 12Z" className="fill-emerald-400/80" />
    </g>
  );
}

function Sparkle({ x, y, size, className }: { x: number; y: number; size: number; className: string; }) {
  const s = size;
  return <path d={`M${x} ${y - s}C${x + s * 0.15} ${y - s * 0.15} ${x + s * 0.15} ${y - s * 0.15} ${x + s} ${y}C${x + s * 0.15} ${y + s * 0.15} ${x + s * 0.15} ${y + s * 0.15} ${x} ${y + s}C${x - s * 0.15} ${y + s * 0.15} ${x - s * 0.15} ${y + s * 0.15} ${x - s} ${y}C${x - s * 0.15} ${y - s * 0.15} ${x - s * 0.15} ${y - s * 0.15} ${x} ${y - s}Z`} className={className} />;
}
