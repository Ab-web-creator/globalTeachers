"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useCallRingtone(active: boolean) {
  const context = useRef<AudioContext | null>(null);
  const [blocked, setBlocked] = useState(false);
  const ringing = useRef(false);
  const nextRing = useRef(0);
  const tones = useRef<OscillatorNode[]>([]);

  const enableSound = useCallback(() => {
    try {
      context.current ??= new AudioContext();
      void context.current.resume().catch(() => setBlocked(true));
    } catch {
      setBlocked(true);
    }
  }, []);

  useEffect(() => {
    ringing.current = active;
    nextRing.current = 0;
    if (!active) {
      tones.current.forEach((tone) => { try { tone.stop(); } catch {} });
      tones.current = [];
    }
  }, [active]);

  useEffect(() => {
    // Unlock audio during normal admin interaction, before a call arrives.
    document.addEventListener("pointerdown", enableSound);
    document.addEventListener("keydown", enableSound);
    const timer = setInterval(() => {
      if (!ringing.current) return;
      if (!context.current) enableSound();
      const audio = context.current;
      if (!audio || audio.state !== "running") {
        setBlocked(true);
        return;
      }
      setBlocked(false);
      if (audio.currentTime < nextRing.current) return;
      nextRing.current = audio.currentTime + 3;
      for (const offset of [0, 0.55]) {
        const start = audio.currentTime + offset;
        const volume = audio.createGain();
        volume.gain.setValueAtTime(0, start);
        volume.gain.linearRampToValueAtTime(0.12, start + 0.02);
        volume.gain.setValueAtTime(0.12, start + 0.35);
        volume.gain.linearRampToValueAtTime(0, start + 0.4);
        volume.connect(audio.destination);
        let remaining = 2;
        for (const frequency of [440, 480]) {
          const tone = audio.createOscillator();
          tone.frequency.value = frequency;
          tone.connect(volume);
          tones.current.push(tone);
          tone.onended = () => {
            tone.disconnect();
            tones.current = tones.current.filter((item) => item !== tone);
            remaining -= 1;
            if (remaining === 0) volume.disconnect();
          };
          tone.start(start);
          tone.stop(start + 0.42);
        }
      }
    }, 250);
    return () => {
      clearInterval(timer);
      document.removeEventListener("pointerdown", enableSound);
      document.removeEventListener("keydown", enableSound);
      void context.current?.close();
      context.current = null;
    };
  }, [enableSound]);

  return { blocked, enableSound };
}
