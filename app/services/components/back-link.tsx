import Link from "next/link";

export default function BackLink({ href = "/#categories", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`group z-20 hidden w-fit items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-neutral-500 shadow-sm md:inline-flex ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-neutral-600">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 6 4 12l7 6v-4h9v-4h-9z" /></svg>
      </span>
      Назад
    </Link>
  );
}
