// Tiny synthesized sound effects (Web Audio), so no audio files are needed.
// Browsers only allow audio after a user gesture; every call here comes from a click/tap.

const MUTE_KEY = "thynk-muted";
let ctx: AudioContext | null = null;

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {}
}

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** One note with a quick attack and exponential fade; optional pitch slide to `slideTo`. */
function note(audio: AudioContext, freq: number, start: number, duration: number, type: OscillatorType = "sine", volume = 0.16, slideTo?: number) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function play(build: (audio: AudioContext, t: number) => void) {
  if (isMuted()) return;
  const audio = getContext();
  if (audio) build(audio, audio.currentTime + 0.01);
}

/** Bright rising "ding-ding!" */
export const playCorrect = () =>
  play((a, t) => {
    note(a, 659.25, t, 0.14, "triangle", 0.14);
    note(a, 987.77, t + 0.09, 0.16, "triangle", 0.14);
    note(a, 1318.5, t + 0.18, 0.32, "sine", 0.12);
  });

/** Low, falling "bwomp" */
export const playWrong = () =>
  play((a, t) => {
    note(a, 260, t, 0.22, "square", 0.05, 190);
    note(a, 185, t + 0.2, 0.34, "square", 0.05, 120);
  });

/** Little fanfare for finishing the lesson */
export const playComplete = () =>
  play((a, t) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(a, f, t + i * 0.1, 0.22, "triangle", 0.13));
    note(a, 1318.5, t + 0.42, 0.5, "sine", 0.1);
  });

/** Soft tick when a tile snaps into place */
export const playTick = () => play((a, t) => note(a, 1200, t, 0.05, "sine", 0.06));
