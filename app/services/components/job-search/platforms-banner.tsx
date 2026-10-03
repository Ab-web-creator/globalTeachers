export default function PlatformsBanner() {
  return (
    <div className="relative mt-6 grid items-center gap-6 overflow-hidden rounded-3xl bg-brand-300 px-6 py-8 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <div className="relative z-10">
        <p className="text-4xl font-semibold tracking-tight text-brand-600 sm:text-5xl">10,000+</p>
        <p className="mt-2 text-sm text-brand-800">возможностей по всему миру</p>
      </div>
      <div aria-hidden="true" className="relative hidden h-28 text-brand-600 lg:block">
        <div className="absolute -inset-x-8 -inset-y-12 bg-[radial-gradient(circle,currentColor_1px,transparent_1.5px)] bg-size-[5px_5px] opacity-25 mask-[url(/images/world-map.svg)] mask-contain mask-center mask-no-repeat" />
        <svg viewBox="0 0 400 120" fill="none" className="relative h-full w-full">
          <g stroke="currentColor" strokeWidth="1" opacity="0.4"><path d="M30 65Q100-10 140 95Q190 5 235 35Q290 5 350 65" /></g>
          <g fill="currentColor"><circle cx="30" cy="65" r="4" /><circle cx="140" cy="95" r="4" /><circle cx="235" cy="35" r="4" /><circle cx="350" cy="65" r="4" /></g>
        </svg>
      </div>
      <blockquote className="relative flex gap-3 border-l-2 border-brand-600/30 pl-5 text-sm italic leading-relaxed text-brand-800">
        <span aria-hidden="true" className="font-serif text-4xl leading-none text-brand-600">“</span>
        <p>Хорошие учителя меняют мир.<br />Международные школы дают для этого платформу.</p>
      </blockquote>
    </div>
  );
}
