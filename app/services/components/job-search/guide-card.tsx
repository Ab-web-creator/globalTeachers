import type { ReactNode } from "react";

type GuideCardProps = {
  id: string;
  title: string;
  children: ReactNode;
  as?: "section" | "div";
};

export default function GuideCard({ id, title, children, as: Container = "section" }: GuideCardProps) {
  return (
    <Container aria-labelledby={Container === "section" ? id : undefined} className="h-full">
      <h3 id={id} className="text-2xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-xl">{title}</h3>
      <div className="mt-7 space-y-4 text-base leading-relaxed text-brand-800">{children}</div>
    </Container>
  );
}
