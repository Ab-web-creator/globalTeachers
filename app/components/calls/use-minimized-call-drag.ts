import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

export default function useMinimizedCallDrag(minimized: boolean) {
  // Relative coordinates keep the window on screen when the viewport changes.
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const movedRef = useRef(false);

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    movedRef.current = false;
    if (!minimized || !event.isPrimary || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, input, textarea, select, a")) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: bounds.left,
      top: bounds.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!minimized || !drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!movedRef.current && Math.hypot(dx, dy) < 5) return;
    movedRef.current = true;
    const bounds = event.currentTarget.getBoundingClientRect();
    const width = Math.max(0, window.innerWidth - 32 - bounds.width);
    const height = Math.max(0, window.innerHeight - 32 - bounds.height);
    setPosition({
      x: width ? Math.max(0, Math.min(1, (drag.left + dx - 16) / width)) : 0,
      y: height ? Math.max(0, Math.min(1, (drag.top + dy - 16) / height)) : 0,
    });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.id === event.pointerId) dragRef.current = null;
  }

  const style: CSSProperties = {
    left: `calc(1rem + (100% - 2rem) * ${position.x})`,
    top: `calc(1rem + (100% - 2rem) * ${position.y})`,
    right: "auto",
    bottom: "auto",
    transform: `translate(-${position.x * 100}%, -${position.y * 100}%)`,
  };

  return {
    style,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onClickCapture(event: React.MouseEvent<HTMLElement>) {
        if (!minimized || !movedRef.current) return;
        movedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
}
