// A soft-yellow panel for the one statement a section should leave the reader with.
export default function Note({ children }: { children: string }) {
  return <p className="rounded-3xl border border-brand-300 bg-linear-to-br from-amber-50 to-yellow-50/50 px-6 py-5 text-lg leading-relaxed text-brand-600 sm:px-8 sm:py-6">{children}</p>;
}
