"use client";

import { useRef, useState } from "react";
import useScrollReveal from "./use-scroll-reveal";
import type { Panel } from "./content";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import FaqSection from "./faq/faq-section";
import HeroSection from "./hero-section";
import HeroSectionCopy from "./hero-section-copy";
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
  const [panel, setPanel] = useState<Panel>("Courses");
  const dialog = useRef<HTMLDialogElement>(null);

  function openPanel(next: Panel) {
    setPanel(next);
    dialog.current?.showModal();
  }

  return (
    <>
      <SiteHeader openPanel={openPanel} />
      <main id="home">
        <HeroSection openPanel={openPanel} />
        <HeroSectionCopy openPanel={openPanel} />
        <PartnersSection />
        <Benefits />
        <AboutSection openPanel={openPanel} />
        <MentorNote openPanel={openPanel} />
        <StatisticsSection />
        <CategoriesSection openPanel={openPanel} />
        <ProgramsSection />
        <FaqSection openPanel={openPanel} />
      </main>
      <SiteFooter openPanel={openPanel} />
      <PreviewDialog dialog={dialog} panel={panel} />
    </>
  );
}
