import type { SVGProps } from "react";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "children">;

export default function Logo({ className = "w-40", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1500 481"
      role="img"
      aria-label="Global Teacher Hub"
      className={`h-auto ${className}`}
      {...props}
    >
      <image
        href="/images/global-teachers-logo.svg"
        width="569"
        height="481"
        aria-hidden="true"
      />
      <g fill="#211717" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" aria-hidden="true">
        <text x="610" y="174" fontSize="128" textLength="385" lengthAdjust="spacingAndGlyphs">
          Global
        </text>
        <text x="590" y="344" fontSize="190" fontWeight="900" textLength="900" lengthAdjust="spacingAndGlyphs">
          TEACHER
        </text>
        <text x="1490" y="449" textAnchor="end" fontSize="116" textLength="235" lengthAdjust="spacingAndGlyphs">
          HUB
        </text>
      </g>
    </svg>
  );
}
