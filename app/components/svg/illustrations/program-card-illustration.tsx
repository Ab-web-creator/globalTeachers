import { programCardArtwork, type ProgramCardArtworkName } from "./program-card-artwork";

export function ProgramCardIllustration({ variant }: {
  variant: ProgramCardArtworkName;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 140" fill="none" className="pointer-events-none absolute right-0 bottom-0 h-32 w-full text-brand-300/40">
      {programCardArtwork[variant]}
    </svg>
  );
}
