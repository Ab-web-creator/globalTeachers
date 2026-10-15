import { useEffect, useState, type RefObject } from "react";

const micBarCount = 32;

export default function useMicrophoneLevels(
  stream: RefObject<MediaStream | null>,
  mediaReady: boolean,
) {
  // Recent microphone levels, newest first; new samples enter on the left and scroll right.
  const [micLevels, setMicLevels] = useState<number[]>(() => Array(micBarCount).fill(0));
  useEffect(() => {
    if (!mediaReady || !stream.current) return;
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream.current);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const timer = setInterval(() => {
      analyser.getByteTimeDomainData(samples);
      const energy = samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length;
      const level = Math.min(100, Math.round(Math.sqrt(energy) * 400));
      setMicLevels((levels) => [level, ...levels.slice(0, -1)]);
    }, 100);
    void context.resume().catch(() => {});
    return () => {
      clearInterval(timer);
      source.disconnect();
      void context.close();
    };
  }, [mediaReady, stream]);
  return micLevels;
}
