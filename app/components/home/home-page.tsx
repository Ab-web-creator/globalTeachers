"use client";

import { useRef, useState } from "react";
import type { Panel } from "./content";
import SiteHeader from "./site-header";
import HeroSection from "./hero-section";
import PartnersSection from "./partners-section";
import PreviewDialog from "./preview-dialog";
import AboutSection from "./about/about-section";
import Benefits from "./Benefits";
import StatisticsSection from "./statistics-section";
import CategoriesSection from "./categories/categories-section";
import ProgramsSection from "./categories/programs-section";

export default function HomePage() {
  const [panel, setPanel] = useState<Panel>("Courses");
  const dialog = useRef<HTMLDialogElement>(null);

  function openPanel(next: Panel) {
    setPanel(next);
    dialog.current?.showModal();
  }

  return (
    <>
      <SiteHeader openPanel={openPanel} />
      <main>
        <HeroSection openPanel={openPanel} />
        <PartnersSection />
        <Benefits />
        <AboutSection openPanel={openPanel} />
        <StatisticsSection />
        <CategoriesSection openPanel={openPanel} />
        <ProgramsSection />
      </main>
      <PreviewDialog dialog={dialog} panel={panel} />
    </>
  );
}
