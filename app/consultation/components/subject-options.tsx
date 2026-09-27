import { useEffect, useRef } from "react";

type Props = {
  options: string[];
  selected: string[];
  activeIndex: number;
  onSelect: (subject: string) => void;
  onDone: () => void;
};

export default function SubjectOptions({ options, selected, activeIndex, onSelect, onDone }: Props) {
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
    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-brand-100 bg-white shadow-lg">
    <ul
      ref={list}
      id="subject-options"
      role="listbox"
      tabIndex={-1}
      aria-multiselectable="true"
      aria-label="Предметы"
      className="relative max-h-48 overflow-y-auto overscroll-contain p-1"
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
    <div className="flex items-center justify-between gap-3 border-t border-brand-100 px-3 py-2">
      <span className="text-xs text-neutral-500" aria-live="polite">Выбрано: {selected.length}</span>
      <button
        type="button"
        onClick={onDone}
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Готово ✓
      </button>
    </div>
    </div>
  );
}
