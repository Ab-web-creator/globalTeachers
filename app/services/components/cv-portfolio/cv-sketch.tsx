import type { ReactNode } from "react";

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block h-2 rounded-full bg-current ${className}`} />;
}

function Region({ label, active, children }: { label: string; active: boolean; children: ReactNode }) {
  return (
    <div className={`relative rounded-xl p-3 transition-colors duration-300 ${active ? "bg-brand-50 text-brand-300 ring-2 ring-brand-300" : "text-neutral-200"}`}>
      <span className={`absolute -top-3 right-3 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-semibold text-white transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>{label}</span>
      {children}
    </div>
  );
}

function Heading() {
  return <Bar className="mb-3 w-1/4 opacity-80" />;
}

export default function CvSketch({ labels, active }: { labels: string[]; active: number }) {
  return (
    <div aria-hidden="true" className="flex aspect-3/4 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/5">
      <Region label={labels[0]} active={active === 0}>
        <div className="flex items-center gap-4">
          <span className="size-12 shrink-0 rounded-full bg-current" />
          <div className="flex-1 space-y-2">
            <Bar className="h-3 w-1/2" />
            <Bar className="w-3/4" />
          </div>
        </div>
      </Region>
      <Region label={labels[1]} active={active === 1}>
        <Heading />
        <div className="space-y-2"><Bar className="w-5/6" /><Bar className="w-2/3" /></div>
      </Region>
      <Region label={labels[2]} active={active === 2}>
        <Heading />
        <div className="space-y-2"><Bar /><Bar className="w-11/12" /><Bar className="w-4/5" /><Bar className="w-2/3" /></div>
      </Region>
      <Region label={labels[3]} active={active === 3}>
        <Heading />
        <div className="space-y-2">
          {["w-3/4", "w-2/3", "w-4/5"].map((width) => (
            <div key={width} className="flex items-center gap-2"><span className="size-2 shrink-0 rounded-full bg-current" /><Bar className={width} /></div>
          ))}
        </div>
      </Region>
      <Region label={labels[4]} active={active === 4}>
        <Heading />
        <div className="flex flex-wrap gap-2">
          {["w-12", "w-16", "w-10", "w-14"].map((width) => <span key={width} className={`h-4 rounded-full bg-current ${width}`} />)}
        </div>
      </Region>
    </div>
  );
}
