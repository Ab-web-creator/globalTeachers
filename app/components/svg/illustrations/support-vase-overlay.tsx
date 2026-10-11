import { useId } from "react";
import styles from "../../../programs/pro/vase-document-animation.module.css";

const panels = [
  "M342 995H475V1160H342Z",
  "M536 1010H715V1184H536Z",
  "M357 1195H498V1360H357Z",
  "M542 1230H705V1370H542Z",
];

export function SupportVaseOverlay({ turn }: { turn: { selected: number[]; count: number } }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" viewBox="0 0 1024 1536" className="pointer-events-none absolute top-0 left-0 h-auto w-full motion-reduce:hidden">
      <defs>
        {panels.map((path, index) => <clipPath key={path} id={`${id}-${index}`}><path d={path} /></clipPath>)}
      </defs>
      {panels.map((path, index) => (
        <g key={path} clipPath={`url(#${id}-${index})`}>
          <image key={turn.count} href="/images/career-support-stage-vase-v12.png" width="1024" height="1536" className={turn.selected.includes(index) ? styles.artwork : undefined} />
        </g>
      ))}
    </svg>
  );
}
