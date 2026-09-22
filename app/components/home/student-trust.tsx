import Image from "next/image";

export default function StudentTrust() {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-4 sm:mt-14">
      <div className="flex -space-x-3" aria-hidden="true">
        {["photo-1438761681033-6461ffad8d80", "photo-1500648767791-00dcc994a43e", "photo-1534528741775-53994a69daeb", "photo-1506794778202-cad84cf45f1d"].map((photo) => (
          <Image key={photo} src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&h=100&q=80`} alt="" width={52} height={52} unoptimized className="size-12 rounded-full border-3 border-white object-cover sm:size-14" />
        ))}
      </div>
      <p className="text-sm text-[#616161] sm:text-base">Trusted by over 30K students</p>
    </div>
  );
}
