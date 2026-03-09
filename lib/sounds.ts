// Web Audio API sound generation — no audio files required

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
    )();
  }
  return audioCtx;
}

/** Play a tone with an envelope */
function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.25,
  startDelay = 0,
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

    gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);

    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration);
  } catch {
    // Silently ignore any audio errors
  }
}

export const SoundEffects = {
  /** Soft click when placing a disc */
  place() {
    tone(520, 0.08, 'square', 0.18);
  },

  /** Whoosh when discs flip */
  flip() {
    tone(360, 0.07, 'sine', 0.12);
    tone(480, 0.07, 'sine', 0.12, 0.05);
  },

  /** Notification when a player must pass */
  pass() {
    tone(220, 0.35, 'sine', 0.18);
  },

  /** Victory fanfare */
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, 'sine', 0.28, i * 0.13));
  },

  /** Sad descending arpeggio on loss */
  lose() {
    [392, 349, 330, 262].forEach((f, i) => tone(f, 0.28, 'sine', 0.28, i * 0.13));
  },

  /** Draw — two neutral tones */
  draw() {
    tone(440, 0.4, 'sine', 0.18);
    tone(440, 0.4, 'sine', 0.18, 0.45);
  },

  /** Subtle hover tick */
  hover() {
    tone(660, 0.04, 'sine', 0.04);
  },
} as const;

export type SoundName = keyof typeof SoundEffects;
