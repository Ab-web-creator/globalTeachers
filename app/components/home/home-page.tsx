"use client";

import { useRef, useState } from "react";
import useScrollReveal from "./use-scroll-reveal";
import type { Panel } from "./content";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import FaqSection from "./faq/faq-section";
import HeroSection from "./hero-section";
import PartnersSection from "./partners-section";
import PreviewDialog from "./preview-dialog";
import AboutSection from "./about/about-section";
import MentorNote from "./mentor-note";
import Benefits from "./Benefits";
import StatisticsSection from "./statistics-section";
import CategoriesSection from "./categories/categories-section";
import ProgramsSection from "./categories/programs-section";

export default function HomePage() {
  useScrollReveal();
  const [panel] = useState<Panel>("Courses");
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <SiteHeader />
      <main id="home">
        <HeroSection />
        <AboutSection />
        <PartnersSection />
        <Benefits />
        <MentorNote />
        <StatisticsSection />
        <CategoriesSection />
        <ProgramsSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <PreviewDialog dialog={dialog} panel={panel} />
    </>
  );
}
