import { useId } from "react";
import styles from "../../../programs/vip/tree-pot-animation.module.css";

export function TreePotOverlay() {
  const id = useId();

  return (
    <svg aria-hidden="true" viewBox="0 0 971 1620" className="pointer-events-none absolute inset-0 size-full motion-reduce:hidden">
      <defs>
        <clipPath id={`${id}-cv`}>
          <path d="M248 1161Q240 1163 241 1180L242 1471L446 1549L447 1238Z" />
        </clipPath>
        <clipPath id={`${id}-school`}>
          <path d="M566 1233L758 1179L785 1200L785 1458L565 1542Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-cv)`}>
        <image href="/images/vip-career-tree-box-v6.png" width="971" height="1620" className={styles.firstPanel} />
      </g>
      <g clipPath={`url(#${id}-school)`}>
        <image href="/images/vip-career-tree-box-v6.png" width="971" height="1620" className={styles.secondPanel} />
      </g>
    </svg>
  );
}
