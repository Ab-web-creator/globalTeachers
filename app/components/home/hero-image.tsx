import Image from "next/image";

export default function HeroImage() {
  return (
    <Image
      src="/images/hero-airport-family-mobile.png"
      alt=""
      fill
      sizes="100vw"
      loading="eager"
      fetchPriority="high"
      className="-z-30 -scale-x-100 object-cover object-[80%_center] brightness-125 sm:object-right"
    />
  );
}
