import type { ReactNode } from "react";

type Props = { bounds: readonly [number, number, number, number]; className?: string; children?: ReactNode; image?: string; };

export function ServiceCategoryIllustration({ bounds, className, children, image = "/images/course-categories-four-colors.webp" }: Props) {
  const [x, y, width, height] = bounds;
  const viewportWidth = height * 1.25;
  return (
    <svg aria-hidden="true" viewBox={`${x + (width - viewportWidth) / 2} ${y} ${viewportWidth} ${height}`} className={className}>
      <svg x={x} y={y} width={width} height={height} viewBox={`${x} ${y} ${width} ${height}`} overflow="hidden">
        {image ? <image href={image} width="1254" height="1254" /> : null}
      </svg>
      {children}
    </svg>
  );
}
