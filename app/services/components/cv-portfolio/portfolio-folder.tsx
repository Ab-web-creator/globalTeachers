import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: "500", preload: false });

export default function PortfolioFolder({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 240" className={className}>
      <defs>
        <linearGradient id="portfolio-pocket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7cdf3" />
          <stop offset="1" stopColor="#aeb6e6" />
        </linearGradient>
      </defs>
      <path d="M34 150c-6-44 28-74 76-78s96 14 104 58-24 82-74 88-100-24-106-68Z" className="fill-indigo-100/50" />
      <path d="M46 96a6 6 0 0 1 6-6h34l8 8h76a6 6 0 0 1 6 6v86a6 6 0 0 1-6 6H58a6 6 0 0 1-6-5Z" className="fill-blue-300/80 drop-shadow-sm" />
      <g transform="rotate(-5 96 98)" className="drop-shadow-md">
        <rect x="60" y="44" width="76" height="112" rx="6" className="fill-neutral-50" />
        <path d="M74 64h48M74 78h40M74 102h44" strokeWidth="6" strokeLinecap="round" className="stroke-neutral-200" />
      </g>
      <g transform="rotate(10 142 98)" className="drop-shadow-md">
        <rect x="108" y="58" width="68" height="82" rx="6" className="fill-white" />
        <circle cx="122" cy="72" r="4" className="fill-indigo-100" />
        <path d="M116 126l14-24 12 14 10-10 16 20Z" className="fill-indigo-200" />
        <circle cx="156" cy="88" r="7" className="fill-indigo-200" />
      </g>
      <g transform="rotate(-3 122 152)" className="drop-shadow-lg">
        <rect x="66" y="110" width="114" height="88" rx="6" fill="url(#portfolio-pocket)" />
        <text x="123" y="160" textAnchor="middle" className={`${caveat.className} fill-white text-2xl`}>Portfolio</text>
      </g>
      <path d="M156 30l3 14M186 38l-8 12M196 64l-13 2" strokeWidth="5" strokeLinecap="round" className="stroke-indigo-300" />
    </svg>
  );
}
