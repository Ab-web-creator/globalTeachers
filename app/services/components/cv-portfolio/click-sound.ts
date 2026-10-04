let context: AudioContext | null = null;

// A short, dry "tik", like a clock tick: a high tone that drops in pitch and dies away in ~25ms.
export function playClick() {
  try {
    context ??= new AudioContext();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(2200, now);
    oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.025);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.03);
  } catch {
    // Audio is a nicety; ignore browsers that block or lack it.
  }
}
