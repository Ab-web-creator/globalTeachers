"use client";

import { AboutBenefitCheckIcon, AboutGraduationIllustration } from "@/app/components/svg";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AboutCarousel from "./about-carousel";

const benefits = [
  "Поймёте, в каких странах и школах ваш опыт наиболее востребован",
  "Узнаете, как сильнее представить свой опыт и повысить шансы на приглашение",
  "Получите понятный план действий — от первого поиска до международного оффера",
];

export default function AboutSection() {
  const container = useRef<HTMLDivElement>(null);
  const [secondActive, setSecondActive] = useState(0);
  useEffect(() => {
    if (!container.current)
      return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    function update() {
      clearInterval(timer);
      if (!desktop.matches) {
        setSecondActive(0);
      }
      if (!desktop.matches || reducedMotion.matches || !visible || document.hidden)
        return;
      timer = setInterval(() => setSecondActive(current => (current + 1) % 3), 8000);
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
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 bg-linear-to-b from-brand-50/60 to-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-400 items-center gap-8 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:gap-20 xl:px-20">
        <div data-reveal className="px-6 py-2 sm:px-0 lg:py-4">
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 sm:text-base uppercase">О нас</p>
          <h2 id="about-title" className="text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">
            Превращаем цель в понятный план действий
          </h2>
          <p className="mt-7 text-base leading-normal text-neutral-600 sm:text-lg">
            Международная карьера начинается не с отправки сотен резюме, а с понимания своих возможностей. Мы помогаем определить вашу точку старта, выбрать направление и выстроить понятный путь к международному офферу.
          </p>
          <ul className="mt-5 space-y-3 text-base text-neutral-800 sm:mt-6 sm:text-lg">
            {benefits.map((benefit, index) => (<li key={index} className="flex items-start gap-3">
              <AboutBenefitCheckIcon />
              <span>{benefit}</span>
            </li>))}
          </ul>
          <Link href="/consultation" className="mt-6 inline-flex rounded-2xl sm:rounded-full action-gradient-outline px-8 py-2.5 sm:py-4 text-base font-medium text-brand-700 transition hover:shadow-md sm:mt-8">
            Начать свой путь
          </Link>
        </div>

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
            <div data-reveal className="relative isolate flex flex-1 flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 p-4 text-white sm:gap-6 sm:rounded-3xl sm:px-6 sm:py-5">
              <AboutGraduationIllustration />
              <p className="text-base font-medium leading-snug sm:text-xl">Поддержка на пути к международной карьере</p>
              <p className="text-xs leading-relaxed text-white/90 sm:text-sm">Практические рекомендации и индивидуальный план с учётом вашего опыта и целей.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
