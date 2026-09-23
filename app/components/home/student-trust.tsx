import Image from "next/image";

const flags = ["uk", "uae", "singapore", "thailand"];

export default function StudentTrust() {
  return (
    <div className="@container mt-12 flex items-center gap-3 sm:mt-14">
      <div className="flex shrink-0 -space-x-1" aria-hidden="true">
        {flags.map((flag) => (
          <Image key={flag} src={`/images/flags/${flag}.svg`} alt="" width={40} height={40} className="size-7 rounded-full border-2 border-white object-cover shadow-sm @sm:size-8 @xl:size-10" />
        ))}
      </div>
      <p className="min-w-0 flex-1 text-sm text-[#616161] @xl:text-base">Возможности для педагогов по всему миру</p>
    </div>
  );
}
