"use client";

import { useState } from "react";
import BenefitCard from "./benefit-card";
import { benefits } from "./benefits-content";

export default function BenefitsGrid() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="@container mx-auto mt-8 w-full">
      <div className="flex flex-col items-center gap-12">
        <ul
          id="benefits-list"
          className={`grid w-full min-w-0 max-w-full grid-cols-1 justify-center gap-4 @min-[37rem]:w-auto @min-[37rem]:grid-cols-[repeat(2,16rem)] @min-[50rem]:grid-cols-[repeat(3,16rem)] @min-[67rem]:grid-cols-[repeat(4,16rem)] ${
            expanded
              ? ""
              : "[&>li:nth-child(n+5)]:hidden @max-[67rem]:[&>li:nth-child(4)]:hidden @min-[37rem]:@max-[50rem]:[&>li:nth-child(3)]:hidden"
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
            className="rounded-full action-gradient-outline px-5 md:px-8 py-4 text-center text-base font-medium text-brand-700 transition-colors hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            Показать все преимущества
          </button>
        )}
      </div>
    </div>
  );
}
