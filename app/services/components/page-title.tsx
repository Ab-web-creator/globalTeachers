import type { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-4xl xl:text-6xl">{children}</h1>;
}
