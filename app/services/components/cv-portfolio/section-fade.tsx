const tones = {
  violet: "from-violet-50 via-sky-50/60",
  sky: "from-sky-100/70 via-cyan-50/50",
  rose: "from-rose-50 via-amber-50/50",
};

export default function SectionFade({ tone = "violet" }: { tone?: keyof typeof tones }) {
  return <div aria-hidden="true" className={`absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-t to-transparent ${tones[tone]}`} />;
}
