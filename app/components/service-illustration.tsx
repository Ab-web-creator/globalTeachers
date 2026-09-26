type Props = { bounds: readonly [number, number, number, number]; className?: string };

export default function ServiceIllustration({ bounds, className }: Props) {
  const [x, y, width, height] = bounds;
  const viewportWidth = height * 1.25;
  return (
    <svg aria-hidden="true" viewBox={`${x + (width - viewportWidth) / 2} ${y} ${viewportWidth} ${height}`} className={className}>
      <image href="/images/course-categories-four-colors.png" width="1254" height="1254" />
    </svg>
  );
}
