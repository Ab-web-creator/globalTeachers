"use client";

import { useId, useState } from "react";
import { VideoCallIcon } from "@/app/components/svg";

export default function ZoomCallButton() {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
        className="group inline-flex w-fit items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-neutral-500 shadow-sm"
      >
        <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-neutral-600">
          <VideoCallIcon />
        </span>
        Zoom-встреча
      </button>
      {open && (
        <span id={tooltipId} role="tooltip" className="absolute top-full left-0 z-40 mt-2 whitespace-nowrap rounded-lg bg-neutral-800 px-3 py-2 text-sm text-white shadow-sm">
          Пока не реализовано
        </span>
      )}
    </div>
  );
}
