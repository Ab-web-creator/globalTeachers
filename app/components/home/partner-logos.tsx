import { ArchitectMark, RenaissanceMark } from "./partner-marks";

export function LondonLogo() {
  return (
    <div className="flex items-center gap-3">
      <ArchitectMark />
      <div className="uppercase tracking-widest">
        <p className="text-xl font-bold">London</p>
        <p className="mt-1 text-xs font-light tracking-widest">Architect</p>
      </div>
    </div>
  );
}

export function GoodwellLogo() {
  return (
    <div className="text-center uppercase">
      <p className="text-lg tracking-widest">Good<span className="font-bold">•Well</span></p>
      <p className="mt-1 text-xs tracking-wider">Industrial Supply</p>
    </div>
  );
}

export function AndersonLogo() {
  return (
    <div className="relative px-3 text-lg leading-normal font-bold tracking-widest uppercase">
      <span aria-hidden="true" className="absolute top-0 left-1 h-9 w-px rotate-35 bg-current" />
      Michael<br />Anderson
      <span aria-hidden="true" className="absolute right-1 bottom-0 h-9 w-px rotate-35 bg-current" />
    </div>
  );
}

export function RenaisansLogo() {
  return <div className="flex items-center gap-3"><RenaissanceMark /><span className="text-sm font-semibold tracking-widest uppercase">Renaisans</span></div>;
}

export function NatuskaLogo() {
  return <p className="text-3xl font-light tracking-tight uppercase"><span className="font-black">Na</span>tuska</p>;
}

export function BreezyLogo() {
  return <p className="text-2xl font-bold tracking-widest uppercase">Breezy</p>;
}
