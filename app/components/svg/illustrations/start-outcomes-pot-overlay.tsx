"use client";

import { useId } from "react";
import styles from "../../../programs/start/outcomes-pot-animation.module.css";

const surfaces = [
  "M655 694Q747 694 830 676Q902 757 879 883Q868 973 775 1000Q651 1027 580 980Q530 948 518 896L542 907L570 885L550 864L540 844L527 809L518 795Q521 771 537 746L555 774L566 750Q600 773 630 746Q653 728 655 694Z",
  "M570 748Q693 744 699 794Q695 837 665 878L638 919Q607 952 577 919L559 885L570 852L550 808Z",
  "M701 706Q753 692 797 703Q850 696 865 771L877 812Q852 853 785 850L742 846Q712 836 704 791L693 746Z",
  "M678 853Q742 849 790 856Q820 867 817 913L800 958Q777 986 721 987L664 981Q625 971 634 942L654 886Z",
];

export function StartOutcomesPotOverlay() {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" viewBox="0 0 1024 1536" className="pointer-events-none absolute top-0 left-0 h-auto w-full motion-reduce:hidden">
      <defs>
        {surfaces.map((path, index) => (
          <clipPath key={path} id={`${id}-surface-${index}`}><path d={path} /></clipPath>
        ))}
      </defs>
      {surfaces.map((path, index) => (
        <g key={path} clipPath={`url(#${id}-surface-${index})`}>
          <image href="/images/start-outcomes-flower-stand-v15.webp" width="1024" height="1536" className={styles.surface} style={{ animationDelay: `${index * -2}s` }} />
        </g>
      ))}
    </svg>
  );
}
