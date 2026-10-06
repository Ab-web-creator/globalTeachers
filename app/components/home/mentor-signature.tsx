import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["cyrillic"], weight: "500", preload: false });

export default function MentorSignature() {
  return (
    <div data-reveal className="mt-10">
      <p className={`${caveat.className} text-3xl leading-none text-brand-600 sm:text-4xl`}>С уважением и верой в вас</p>
      <svg aria-hidden="true" viewBox="0 0 200 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-2 w-44 text-brand-300 sm:w-52">
        <path d="M2 10C40 3 90 2 140 6s40 2 56-2" />
      </svg>
      <p className="mt-4 text-sm font-semibold tracking-widest text-neutral-900 uppercase">Основатель GlobalTeacherHub</p>
      <p className="mt-1 text-base text-neutral-500">Ваш наставник на пути к международной карьере</p>
    </div>
  );
}
