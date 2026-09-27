import { useEffect, useRef } from "react";

type Props = {
  options: string[];
  activeIndex: number;
  onSelect: (subject: string) => void;
};

export default function SubjectOptions({ options, activeIndex, onSelect }: Props) {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const container = list.current;
    const option = container?.children[activeIndex] as HTMLElement | undefined;
    if (!container || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < container.scrollTop) container.scrollTop = top;
    else if (bottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }, [activeIndex]);

  return (
    <ul
      ref={list}
      id="subject-options"
      role="listbox"
      aria-label="Предметы"
      className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-brand-100 bg-white p-1 shadow-lg"
    >
      {options.map((subject, index) => (
        <li
          key={subject}
          id={`subject-option-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(subject)}
          className={`cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-brand-50 ${index === activeIndex ? "bg-brand-50 text-brand-700" : ""}`}
        >
          {subject}
        </li>
      ))}
    </ul>
  );
}
