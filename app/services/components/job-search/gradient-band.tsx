import type { ReactNode } from "react";

export default function GradientBand({ children }: { children: ReactNode }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-br from-sky-100 via-blue-50 to-violet-100">
      <div className="mx-auto max-w-400 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-20">{children}</div>
    </div>
  );
}
