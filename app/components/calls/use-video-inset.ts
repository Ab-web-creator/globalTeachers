import { useRef, useState, type PointerEvent, type RefObject } from "react";

export default function useVideoInset(stageRef: RefObject<HTMLDivElement | null>) {
  const [insetPosition, setInsetPosition] = useState({ x: 0.98, y: 0.98 });
  const dragRef = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressInsetClickRef = useRef(false);
  function startInsetDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const tile = event.currentTarget.parentElement?.parentElement;
    if (!tile) return;
    const bounds = tile.getBoundingClientRect();
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top, moved: false };
    suppressInsetClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveInset(event: PointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    const tile = event.currentTarget.parentElement?.parentElement;
    if (!current || current.id !== event.pointerId || !tile || !stageRef.current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    suppressInsetClickRef.current = true;
    const stage = stageRef.current.getBoundingClientRect();
    const bounds = tile.getBoundingClientRect();
    const width = Math.max(0, stage.width - bounds.width);
    const height = Math.max(0, stage.height - bounds.height);
    setInsetPosition({
      x: width ? Math.max(0, Math.min(1, (current.left + dx - stage.left) / width)) : 0,
      y: height ? Math.max(0, Math.min(1, (current.top + dy - stage.top) / height)) : 0,
    });
  }
  const insetStyle = {
    left: `${insetPosition.x * 100}%`,
    top: `${insetPosition.y * 100}%`,
    transform: `translate(-${insetPosition.x * 100}%, -${insetPosition.y * 100}%)`,
  };
  return { dragRef, suppressInsetClickRef, startInsetDrag, moveInset, insetStyle };
}
