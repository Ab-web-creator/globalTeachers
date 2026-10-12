import { useId, type SVGProps } from "react";
import { preload } from "react-dom";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  variant?: "light" | "dark";
  globeScale?: number;
  centerWordmark?: boolean;
};

const logoUrl = "/images/brand/teacher-navigator-light.webp";
const globeUrl = "/images/brand/teacher-navigator-globe.webp";

export function BrandLogo({ className = "w-28", variant = "light", globeScale = 1, centerWordmark = false, ...props }: LogoProps) {
  // SVG <image> files are invisible to the browser's preload scanner, so hint them into <head> ahead of the hero photo.
  preload(logoUrl, { as: "image", fetchPriority: "high" });
  preload(globeUrl, { as: "image", fetchPriority: "high" });
  const id = useId().replaceAll(":", "");
  const wordmarkFilter = `${id}-wordmark`;
  const globeMask = `${id}-globe-mask`;
  const teacherClip = `${id}-teacher-clip`;
  const navigatorClip = `${id}-navigator-clip`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1666 944"
      role="img"
      aria-label="TeacherNavigator"
      className={`h-auto ${className}`}
      {...props}
    >
      <defs>
        <clipPath id={teacherClip}>
          <rect width="1666" height="640" />
        </clipPath>
        <clipPath id={navigatorClip}>
          <rect y="640" width="1666" height="304" />
        </clipPath>
        <mask id={globeMask} maskUnits="userSpaceOnUse" x="0" y="0" width="1666" height="944">
          <rect width="1666" height="944" fill="white" />
          {centerWordmark ? (
            <>
              <rect x="560" y="335" width="1106" height="205" fill="black" />
              <rect x="480" y="540" width="1186" height="235" fill="black" />
            </>
          ) : (
            <rect x="560" y="435" width="1106" height="440" fill="black" />
          )}
        </mask>
        {/* Extract the charcoal lettering; the repaired globe is a separate asset. */}
        <filter id={wordmarkFilter} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1 1 0 0 0 0 0 0 0 0" />
          </feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in" result="mask" />
          {variant === "dark" && <feFlood floodColor="white" result="lettering" />}
          <feComposite in={variant === "dark" ? "lettering" : "SourceGraphic"} in2="mask" operator="in" />
        </filter>
      </defs>
      <g mask={`url(#${globeMask})`} aria-hidden="true">
        <g transform={`translate(${centerWordmark ? 285 : 495} 472) scale(${globeScale}) translate(-495 -472)`}>
          <image href={globeUrl} width="1666" height="944" />
        </g>
      </g>
      <g transform={centerWordmark ? "translate(0 -100)" : undefined} aria-hidden="true">
        <image href={logoUrl} width="1666" height="944" clipPath={`url(#${teacherClip})`} filter={`url(#${wordmarkFilter})`} />
        <g transform={centerWordmark ? "translate(-80 0)" : undefined}>
          <image href={logoUrl} width="1666" height="944" clipPath={`url(#${navigatorClip})`} filter={`url(#${wordmarkFilter})`} />
        </g>
      </g>
    </svg>
  );
}
