"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useCallRingtone(active: boolean, variant: "incoming" | "outgoing" = "incoming") {
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
    // Unlock audio during normal user interaction, before a call arrives.
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
      const outgoing = variant === "outgoing";
      const duration = outgoing ? 1 : 0.4;
      nextRing.current = audio.currentTime + (outgoing ? 4 : 3);
      for (const offset of outgoing ? [0] : [0, 0.55]) {
        const start = audio.currentTime + offset;
        const volume = audio.createGain();
        volume.gain.setValueAtTime(0, start);
        const level = outgoing ? 0.08 : 0.12;
        volume.gain.linearRampToValueAtTime(level, start + 0.02);
        volume.gain.setValueAtTime(level, start + duration - 0.05);
        volume.gain.linearRampToValueAtTime(0, start + duration);
        volume.connect(audio.destination);
        let remaining = 2;
        for (const frequency of outgoing ? [425, 450] : [440, 480]) {
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
          tone.stop(start + duration + 0.02);
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
  }, [enableSound, variant]);

  return { blocked, enableSound };
}
