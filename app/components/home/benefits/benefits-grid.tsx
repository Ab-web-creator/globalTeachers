"use client";

import { useState } from "react";
import BenefitCard from "./benefit-card";
import { benefits } from "./benefits-content";

export default function BenefitsGrid() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="@container mx-auto mt-8 w-full">
      <div className="flex flex-col items-center gap-8">
        <ul
          id="benefits-list"
          className={`grid min-w-0 max-w-full grid-cols-[minmax(0,18rem)] justify-center gap-4 @min-[37rem]:grid-cols-[repeat(2,18rem)] @min-[56rem]:grid-cols-[repeat(3,18rem)] @min-[75rem]:grid-cols-[repeat(4,18rem)] ${
            expanded
              ? ""
              : "[&>li]:hidden [&>li:first-child]:block @min-[37rem]:[&>li:nth-child(2)]:block @min-[56rem]:[&>li:nth-child(3)]:block @min-[75rem]:[&>li:nth-child(4)]:block"
          }`}
        >
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </ul>
        {!expanded && (
          <button
            type="button"
            aria-expanded={false}
            aria-controls="benefits-list"
            onClick={() => setExpanded(true)}
            className="rounded-full bg-brand-100 px-5 md:px-8 py-4 text-center text-base font-medium text-brand-500 transition-colors hover:bg-brand-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            Показать все преимущества
          </button>
        )}
      </div>
    </div>
  );
}
