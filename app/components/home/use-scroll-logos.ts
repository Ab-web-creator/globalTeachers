import { useCallback, useEffect, useRef } from "react";

export default function useScrollLogos() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const width = useRef(0);

  const move = useCallback((distance: number) => {
    if (!track.current || !width.current) return;
    offset.current = ((offset.current + distance) % width.current + width.current) % width.current;
    track.current.style.transform = `translate3d(${-width.current - offset.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const element = viewport.current;
    const group = track.current?.firstElementChild;
    if (!element || !group) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastScroll = window.scrollY;
    let frame = 0;
    const resize = new ResizeObserver(() => {
      width.current = group.getBoundingClientRect().width;
      move(0);
    });
    resize.observe(group);

    function update() {
      frame = 0;
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const bounds = element!.getBoundingClientRect();
      if (!motion.matches && bounds.bottom > 0 && bounds.top < window.innerHeight) move(delta * 0.6);
    }
    function scroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, [move]);

  return { viewport, track, move };
}
