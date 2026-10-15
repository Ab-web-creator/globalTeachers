import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

export default function useCallFullscreen(callFrameRef: RefObject<HTMLElement | null>) {
  const [fullscreen, setFullscreen] = useState(false);
  // iPhone Safari has no element fullscreen, so the button is hidden there.
  const fullscreenSupported = useSyncExternalStore(() => () => {}, () => !!document.fullscreenEnabled, () => false);
  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === callFrameRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, [callFrameRef]);

  function exitFullscreen() {
    if (document.fullscreenElement === callFrameRef.current) {
      void document.exitFullscreen().catch(() => {});
    }
  }

  return { fullscreen, fullscreenSupported, exitFullscreen };
}
