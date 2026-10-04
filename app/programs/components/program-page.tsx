import type { ReactNode } from "react";

// Page shell shared with the service pages: hero, then sections with consistent spacing.
export default function ProgramPage({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        {hero}
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 lg:mt-20 lg:space-y-24">{children}</div>
      </article>
    </main>
  );
}
