const tones = {
  violet: "from-violet-50 via-sky-50/60",
  sky: "from-sky-100/70 via-cyan-50/50",
  rose: "from-rose-50 via-amber-50/50",
};

export default function SectionFade({ tone = "violet", direction = "up", halfHeight = false, toWhite = false }: { tone?: keyof typeof tones; direction?: "up" | "down"; halfHeight?: boolean; toWhite?: boolean }) {
  return <div aria-hidden="true" className={`absolute ${halfHeight ? "top-0 h-1/2" : "inset-y-0"} left-1/2 -z-10 w-screen -translate-x-1/2 ${direction === "down" ? "bg-linear-to-b" : "bg-linear-to-t"} ${toWhite ? "via-20% to-white to-50%" : "to-transparent"} ${tones[tone]}`} />;
}
