import Image from "next/image";

const flags = ["uk", "uae", "singapore", "thailand"];

export default function StudentTrust() {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-4 sm:mt-14">
      <div className="flex shrink-0 -space-x-1" aria-hidden="true">
        {flags.map((flag) => (
          <Image key={flag} src={`/images/flags/${flag}.svg`} alt="" width={40} height={40} className="size-8 rounded-full border-2 border-white object-cover shadow-sm sm:size-10" />
        ))}
      </div>
      <p className="text-sm text-[#616161] sm:text-base">Возможности для педагогов по всему миру</p>
    </div>
  );
}
