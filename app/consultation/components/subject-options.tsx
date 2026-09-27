import { useEffect, useRef } from "react";

type Props = {
  options: string[];
  selected: string[];
  activeIndex: number;
  onSelect: (subject: string) => void;
};

export default function SubjectOptions({ options, selected, activeIndex, onSelect }: Props) {
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
      aria-multiselectable="true"
      aria-label="Предметы"
      className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-brand-100 bg-white p-1 shadow-lg"
    >
      {options.map((subject, index) => (
        <li
          key={subject}
          id={`subject-option-${index}`}
          role="option"
          aria-selected={selected.includes(subject)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(subject)}
          className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm hover:bg-brand-50 ${index === activeIndex ? "bg-brand-50 text-brand-700" : ""}`}
        >
          <input
            type="checkbox"
            checked={selected.includes(subject)}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none mt-0.5 size-4 shrink-0 accent-brand-500"
          />
          <span>{subject}</span>
        </li>
      ))}
    </ul>
  );
}
