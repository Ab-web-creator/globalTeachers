import type { ReactNode } from "react";

// Page shell shared with the service pages: hero, then sections with consistent spacing.
export default function ProgramPageLayout({ hero, children, bottomPadding = "responsive" }: { hero: ReactNode; children: ReactNode; bottomPadding?: "responsive" | "60px"; }) {
  return (
    <main className={`mx-auto max-w-400 px-6 pt-6 sm:px-10 lg:px-16 lg:pt-0 xl:px-20 ${bottomPadding === "60px" ? "pb-15" : "pb-12 sm:pb-16 lg:pb-20"}`}>
      <article>
        {hero}
        <div>{children}</div>
      </article>
    </main>
  );
}
