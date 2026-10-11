// Synthesized sound effects (Web Audio) — no audio files.
// Everything runs through one master chain: dry signal + a soft generated reverb, so sounds
// feel "in a room" instead of thin beeps. Browsers only allow audio after a user gesture;
// every call here comes from a click, tap or drag.

const MUTE_KEY = "thynk-muted";

type Chain = { ctx: AudioContext; out: GainNode; noise: AudioBuffer };
let chain: Chain | null = null;

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

/** Exponentially decaying stereo noise = a small, warm room. */
function makeImpulse(ctx: AudioContext, seconds: number, decay: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buffer;
}

function getChain(): Chain | null {
  if (!chain) {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();

    const out = ctx.createGain();
    out.gain.value = 0.9;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.ratio.value = 4;
    compressor.connect(ctx.destination);

    const reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx, 1.1, 3);
    const wet = ctx.createGain();
    wet.gain.value = 0.18;

    out.connect(compressor);
    out.connect(reverb).connect(wet).connect(compressor);

    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    chain = { ctx, out, noise };
  }
  if (chain.ctx.state === "suspended") void chain.ctx.resume();
  return chain;
}

type Tone = {
  freq: number;
  at?: number;
  dur: number;
  type?: OscillatorType;
  vol?: number;
  /** Pitch glide target, reached at the end of the note. */
  to?: number;
  /** Detuned twin oscillator, in cents, for a fuller sound. */
  detune?: number;
  vibrato?: number;
};

function tone(c: Chain, t0: number, { freq, at = 0, dur, type = "sine", vol = 0.15, to, detune, vibrato }: Tone) {
  const start = t0 + at;
  const gain = c.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  gain.connect(c.out);

  const oscs = [0, ...(detune ? [detune] : [])].map((cents) => {
    const osc = c.ctx.createOscillator();
    osc.type = type;
    osc.detune.value = cents;
    osc.frequency.setValueAtTime(freq, start);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, start + dur * 0.9);
    osc.connect(gain);
    return osc;
  });

  if (vibrato) {
    const lfo = c.ctx.createOscillator();
    const depth = c.ctx.createGain();
    lfo.frequency.value = 7;
    depth.gain.value = vibrato;
    lfo.connect(depth);
    oscs.forEach((osc) => depth.connect(osc.frequency));
    lfo.start(start);
    lfo.stop(start + dur + 0.05);
  }

  oscs.forEach((osc) => {
    osc.start(start);
    osc.stop(start + dur + 0.05);
  });
}

/** Short filtered noise burst: the "tick" of something being touched or placed. */
function click(c: Chain, t0: number, { at = 0, dur = 0.04, freq = 2500, q = 1.2, vol = 0.12 } = {}) {
  const start = t0 + at;
  const src = c.ctx.createBufferSource();
  src.buffer = c.noise;
  const filter = c.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = c.ctx.createGain();
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter).connect(gain).connect(c.out);
  src.start(start);
  src.stop(start + dur + 0.02);
}

function play(build: (c: Chain, t: number) => void) {
  if (isMuted()) return;
  const c = getChain();
  if (c) build(c, c.ctx.currentTime + 0.005);
}

/* ───────────── Interaction ───────────── */

/** Picking an answer option: soft wooden "tok". */
export const playSelect = () =>
  play((c, t) => {
    click(c, t, { freq: 1800, vol: 0.08, dur: 0.03 });
    tone(c, t, { freq: 620, to: 540, dur: 0.09, type: "triangle", vol: 0.1 });
  });

/** Lifting a tile: quick upward "bloop". */
export const playPickup = () =>
  play((c, t) => {
    tone(c, t, { freq: 380, to: 720, dur: 0.11, type: "sine", vol: 0.12 });
    click(c, t, { freq: 3200, vol: 0.05, dur: 0.025 });
  });

/** Tile snapping into a slot: solid "thock" with a little body. */
export const playDrop = () =>
  play((c, t) => {
    click(c, t, { freq: 900, q: 2, vol: 0.18, dur: 0.05 });
    tone(c, t, { freq: 260, to: 170, dur: 0.12, type: "triangle", vol: 0.16 });
    tone(c, t, { freq: 880, at: 0.01, dur: 0.06, type: "sine", vol: 0.05 });
  });

/** Tile going back to the tray: soft falling "whoop". */
export const playReturn = () =>
  play((c, t) => {
    tone(c, t, { freq: 640, to: 330, dur: 0.14, type: "sine", vol: 0.1 });
  });

/** Shading a square — pitch climbs with each shaded square. Clearing one steps back down. */
export const playShade = (count: number, shaded: boolean) =>
  play((c, t) => {
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98, 1760];
    const freq = scale[Math.min(Math.max(count - 1, 0), scale.length - 1)];
    if (shaded) {
      click(c, t, { freq: 2200, vol: 0.06, dur: 0.025 });
      tone(c, t, { freq, dur: 0.16, type: "triangle", vol: 0.11 });
    } else {
      tone(c, t, { freq: freq * 0.75, to: freq * 0.6, dur: 0.1, type: "sine", vol: 0.08 });
    }
  });

/* ───────────── Results ───────────── */

/** Correct: bright rising major arpeggio with a sparkle on top. */
export const playCorrect = () =>
  play((c, t) => {
    tone(c, t, { freq: 523.25, dur: 0.18, type: "triangle", vol: 0.13, detune: 6 });
    tone(c, t, { freq: 659.25, at: 0.08, dur: 0.2, type: "triangle", vol: 0.13, detune: 6 });
    tone(c, t, { freq: 783.99, at: 0.16, dur: 0.24, type: "triangle", vol: 0.13, detune: 6 });
    tone(c, t, { freq: 1046.5, at: 0.24, dur: 0.5, type: "sine", vol: 0.12 });
    tone(c, t, { freq: 2093, at: 0.28, dur: 0.35, type: "sine", vol: 0.035 });
    click(c, t, { at: 0.26, freq: 6000, q: 0.8, vol: 0.04, dur: 0.15 });
  });

/** Wrong: two-note falling "uh-oh" with a wobble — disappointed, not harsh. */
export const playWrong = () =>
  play((c, t) => {
    tone(c, t, { freq: 330, to: 311, dur: 0.2, type: "triangle", vol: 0.16, detune: -12 });
    tone(c, t, { freq: 247, at: 0.18, to: 196, dur: 0.42, type: "triangle", vol: 0.17, detune: -12, vibrato: 6 });
    tone(c, t, { freq: 123.5, at: 0.18, to: 98, dur: 0.42, type: "sine", vol: 0.12 });
    click(c, t, { freq: 400, q: 1, vol: 0.06, dur: 0.06 });
  });

/** Finishing a lesson: little fanfare. */
export const playComplete = () =>
  play((c, t) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(c, t, { freq, at: i * 0.11, dur: 0.24, type: "triangle", vol: 0.12, detune: 7 }));
    tone(c, t, { freq: 1318.5, at: 0.46, dur: 0.7, type: "sine", vol: 0.1, vibrato: 4 });
    tone(c, t, { freq: 659.25, at: 0.46, dur: 0.7, type: "triangle", vol: 0.07 });
    tone(c, t, { freq: 261.63, at: 0.46, dur: 0.7, type: "sine", vol: 0.08 });
  });