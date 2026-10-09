"use client";

import AboutSection from "./components/home/about/about-section";
import Benefits from "./components/home/Benefits";
import CategoriesSection from "./components/home/categories/categories-section";
import ProgramsSection from "./components/home/categories/programs-section";
import FaqSection from "./components/home/faq/faq-section";
import HeroSection from "./components/home/hero-section";
import MentorNote from "./components/home/mentor-note";
import PartnersSection from "./components/home/partners-section";
import SiteFooter from "./components/home/site-footer";
import SiteHeader from "./components/home/site-header";
import StatisticsSection from "./components/home/statistics-section";
import useScrollReveal from "./components/home/use-scroll-reveal";

export default function Home() {
  useScrollReveal();

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
    </>
  );
}
