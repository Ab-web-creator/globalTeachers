import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

type Props = {
  anchor: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

export default function SubjectDropdown({ anchor, children }: Props) {
  const dropdown = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const field = anchor.current;
    const panel = dropdown.current;
    if (!field || !panel) return;
    const navigation = field.closest("form")?.querySelector<HTMLElement>("[data-form-navigation]");

    function position() {
      if (!field || !panel) return;
      const bounds = field.getBoundingClientRect();
      const top = bounds.bottom + 8;
      const bottom = navigation?.getBoundingClientRect().bottom ?? window.innerHeight - 8;
      Object.assign(panel.style, {
        top: `${top}px`,
        left: `${bounds.left}px`,
        width: `${bounds.width}px`,
        height: `${Math.max(0, bottom - top)}px`,
      });
    }

    position();
    const observer = new ResizeObserver(position);
    observer.observe(field);
    if (navigation) observer.observe(navigation);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [anchor]);

  return createPortal(
    <div ref={dropdown} className="fixed z-50 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl">
      {children}
    </div>,
    document.body,
  );
}
