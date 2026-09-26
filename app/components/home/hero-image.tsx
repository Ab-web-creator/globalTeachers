import { getImageProps } from "next/image";

export default function HeroImage() {
  const common = { alt: "", fill: true, sizes: "100vw", loading: "eager" as const, fetchPriority: "high" as const };
  const { props: desktop } = getImageProps({ ...common, src: "/images/hero-airport-family-v2.png" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/hero-airport-family-mobile.png" });
  return (
    <picture>
      <source media="(min-width: 40rem)" srcSet={desktop.srcSet} sizes="100vw" />
      <img {...mobile} alt="" className="-z-30 -scale-x-100 object-cover object-[80%_center] brightness-125 sm:scale-x-100 sm:object-center sm:brightness-100 lg:object-right" />
    </picture>
  );
}
