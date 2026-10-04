"use client";

import { useState } from "react";
import { cvSections } from "./content";
import CvSectionCard from "./cv-section-card";
import CvSketch from "./cv-sketch";

export default function CvSections() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-5 lg:gap-12">
      <div className="space-y-4 lg:col-span-3">
        {cvSections.map(({ title, text }, index) => (
          <CvSectionCard key={title} number={index + 1} title={title} text={text} active={index === active} onActivate={() => setActive(index)} />
        ))}
      </div>
      <div className="hidden lg:col-span-2 lg:block">
        <div className="sticky top-24">
          <CvSketch labels={cvSections.map(({ label }) => label)} active={active} />
        </div>
      </div>
    </div>
  );
}
