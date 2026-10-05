export default function ProFitArt({ variant }: { variant: "support" | "audience" | "preparation" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 140" fill="none" className="pointer-events-none absolute right-0 bottom-0 h-32 w-full text-brand-300/40">
      {variant === "support" && <path d="M180 140C240 105 270 35 400 45V140Z" fill="currentColor" />}
      {variant === "audience" && <>
        <path d="M95 140C180 115 230 115 290 60C330 25 350 45 400 90V140Z" fill="currentColor" />
        <path d="M270 140C340 115 370 100 328 85C280 65 330 55 335 45" stroke="white" strokeWidth="9" />
        <path d="M335 45V15M335 15C350 8 352 22 372 15L365 27C350 34 350 20 335 26" stroke="currentColor" strokeWidth="3" fill="currentColor" />
      </>}
      {variant === "preparation" && <>
        <path d="M100 140C140 60 220 140 285 105S350 28 325 32C295 40 337 85 365 35" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />
        <path d="m350 25 35-15-12 34-7-12-16-7Zm16 7 19-22" stroke="currentColor" strokeWidth="2" className="text-brand-500/70" />
      </>}
    </svg>
  );
}
