import type { ReactNode } from "react";
import ConsultationForm from "./consultation-form";

export default function ConsultationLayout({ intro, aside }: { intro: ReactNode; aside: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-full max-w-400 items-stretch lg:h-full lg:min-h-0 lg:grid-rows-1 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:px-16 lg:py-12 xl:grid-cols-[1.3fr_1fr_0.32fr] xl:gap-8 xl:px-20">
      <div className="relative isolate hidden lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
        {intro}
      </div>
      <ConsultationForm />
      {aside}
    </div>
  );
}
