"use client";

import { useEffect, useRef, useState } from "react";
import AboutCarousel from "./about-carousel";
import AboutGuidanceCard from "./about-guidance-card";

export default function AboutVisual() {
  const container = useRef<HTMLDivElement>(null);
  const [secondActive, setSecondActive] = useState(0);

  useEffect(() => {
    if (!container.current) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    function update() {
      clearInterval(timer);
      if (!desktop.matches) {
        setSecondActive(0);
      }
      if (!desktop.matches || reducedMotion.matches || !visible || document.hidden) return;
      timer = setInterval(() => setSecondActive((current) => (current + 1) % 3), 8000);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(container.current);
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={container} className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 px-6 sm:gap-5 sm:px-0 sm:max-lg:max-w-none">
        <div data-reveal className="relative col-span-2 aspect-4/3 overflow-hidden rounded-2xl bg-brand-50 min-[550px]:col-span-1 min-[550px]:aspect-6/5 sm:rounded-3xl">
          <AboutCarousel active={0} photos={[
            { src: "/images/educators-colorful-wide.webp", alt: "Педагоги работают вместе в библиотеке" },
          ]} sizes="(max-width: 549px) 100vw, (max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" />
        </div>
      <div data-reveal className="relative hidden aspect-5/6 min-w-0 overflow-hidden min-[550px]:block min-[550px]:col-start-2 min-[550px]:row-span-2 min-[550px]:row-start-1 min-[550px]:aspect-auto rounded-2xl bg-brand-50 sm:rounded-3xl">
        <AboutCarousel active={secondActive} photos={[
          { src: "/images/interview-vip-preparation.webp", alt: "Наставник помогает педагогу подготовиться к работе за рубежом" },
          { src: "/images/benefits/development.webp", alt: "Преподаватель проводит занятие" },
          { src: "/images/about-teacher.webp", alt: "Педагог за рабочим столом с ноутбуком" },
        ]} sizes="(max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" />
      </div>
      <div className="col-span-2 flex min-[550px]:col-span-1 min-[550px]:col-start-1 min-[550px]:row-start-2">
        <AboutGuidanceCard />
      </div>
    </div>
  );
}
