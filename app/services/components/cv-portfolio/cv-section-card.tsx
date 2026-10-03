import Image from "next/image";

export default function CvSectionCard({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white sm:flex-row">
      <div className="flex-1 p-6 sm:self-center sm:p-8">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 max-w-lg leading-relaxed text-neutral-600">{text}</p>
      </div>
      <div className="relative order-first h-40 sm:order-none sm:h-auto sm:min-h-40 sm:w-2/5">
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}
