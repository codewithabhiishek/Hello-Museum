import { useSyncExternalStore } from "react";
import type { Greeting } from "./data/greetings";

/* ---------------------------------------------------------------
   A tiny synthesized sound desk for the museum.
   No audio files — every cue is generated with the Web Audio API.
   --------------------------------------------------------------- */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let lastTick = 0;

const MUTE_KEY = "hello-museum-muted";
let muted = typeof window !== "undefined" && localStorage.getItem(MUTE_KEY) === "1";

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/* AudioContexts start suspended until a user gesture — unlock early. */
if (typeof window !== "undefined") {
  const unlock = () => {
    ensureCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

function getNoise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

interface ToneOpts {
  freq: number;
  freqEnd?: number;
  type?: OscillatorType;
  dur: number;
  gain: number;
  delay?: number;
  curve?: number; // exponential attack/decay sharpness
}

function tone({ freq, freqEnd, type = "sine", dur, gain, delay = 0 }: ToneOpts) {
  const c = ensureCtx();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseHit({
  dur,
  gain,
  freq = 800,
  q = 0.8,
  type,
  sweepTo,
}: {
  dur: number;
  gain: number;
  freq?: number;
  q?: number;
  type: BiquadFilterType;
  sweepTo?: number;
}) {
  const c = ensureCtx();
  if (!c || !master) return;
  const t0 = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, t0);
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  filter.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

/* ---------------- the cues ---------------- */

/** short tactile blip for buttons & chips */
export function clickSound() {
  tone({ freq: 940, type: "square", dur: 0.055, gain: 0.07 });
  tone({ freq: 1880, type: "sine", dur: 0.04, gain: 0.05 });
}

/** warm pop when something appears */
export function popSound() {
  tone({ freq: 520, freqEnd: 165, type: "triangle", dur: 0.14, gain: 0.22 });
  noiseHit({ dur: 0.06, gain: 0.05, freq: 2400, type: "highpass" });
}

/** tiny decode tick during the scramble — self-throttled */
export function tickSound() {
  const now = performance.now();
  if (now - lastTick < 52) return;
  lastTick = now;
  tone({ freq: 1650 + Math.random() * 500, type: "sine", dur: 0.022, gain: 0.028 });
}

/** bell-ish chime for answered calls & small victories */
export function chimeSound() {
  const notes = [659.25, 987.77, 1318.5];
  notes.forEach((f, i) => {
    tone({ freq: f, type: "sine", dur: 0.85, gain: 0.12, delay: i * 0.07 });
    tone({ freq: f * 2, type: "sine", dur: 0.4, gain: 0.03, delay: i * 0.07 });
  });
}

/** heavy press-stamp thunk for the ticket machine */
export function stampSound() {
  tone({ freq: 150, freqEnd: 52, type: "sine", dur: 0.16, gain: 0.5 });
  noiseHit({ dur: 0.11, gain: 0.3, freq: 420, q: 0.6, type: "lowpass" });
  tone({ freq: 2100, type: "square", dur: 0.03, gain: 0.05, delay: 0.02 });
}

/** airy whoosh for confetti moments */
export function whooshSound() {
  noiseHit({ dur: 0.55, gain: 0.12, freq: 320, q: 1.4, type: "bandpass", sweepTo: 2600 });
}

/** classic telephone ringback (440 + 480 Hz, pulsed) for `ms` */
export function ringFor(ms: number): () => void {
  const c = ensureCtx();
  if (!c || !master) return () => {};
  const t0 = c.currentTime;
  const oscA = c.createOscillator();
  const oscB = c.createOscillator();
  oscA.frequency.value = 440;
  oscB.frequency.value = 480;
  const g = c.createGain();
  g.gain.value = 0.0001;
  // pulse pattern: 260ms on / 180ms off
  for (let t = 0; t < ms / 1000; t += 0.44) {
    g.gain.setValueAtTime(0.0001, t0 + t);
    g.gain.exponentialRampToValueAtTime(0.09, t0 + t + 0.02);
    g.gain.setValueAtTime(0.09, t0 + t + 0.24);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + 0.3);
  }
  oscA.connect(g);
  oscB.connect(g);
  g.connect(master);
  oscA.start(t0);
  oscB.start(t0);
  const stopAt = t0 + ms / 1000 + 0.4;
  oscA.stop(stopAt);
  oscB.stop(stopAt);
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    try {
      g.gain.cancelScheduledValues(c.currentTime);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      oscA.stop(c.currentTime + 0.02);
      oscB.stop(c.currentTime + 0.02);
    } catch {
      /* already stopped */
    }
  };
}

/* ---------------- mute toggle ---------------- */

const muteSubs = new Set<() => void>();

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* private mode */
  }
  if (ctx && master) {
    master.gain.setTargetAtTime(muted ? 0 : 0.55, ctx.currentTime, 0.02);
  }
  muteSubs.forEach((s) => s());
}

function subscribeMuted(fn: () => void) {
  muteSubs.add(fn);
  return () => {
    muteSubs.delete(fn);
  };
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribeMuted, () => !muted);
}

/* ---------------- speech synthesis ---------------- */

const LANG_CODES: Record<string, string> = {
  English: "en-US", Spanish: "es-ES", French: "fr-FR", Italian: "it-IT",
  Portuguese: "pt-PT", German: "de-DE", Dutch: "nl-NL", Swedish: "sv-SE",
  Norwegian: "nb-NO", Danish: "da-DK", Icelandic: "is-IS", Finnish: "fi-FI",
  Estonian: "et-EE", Latvian: "lv-LV", Lithuanian: "lt-LT", Polish: "pl-PL",
  Czech: "cs-CZ", Slovak: "sk-SK", Hungarian: "hu-HU", Romanian: "ro-RO",
  Croatian: "hr-HR", Serbian: "sr-RS", Bulgarian: "bg-BG", Greek: "el-GR",
  Russian: "ru-RU", Ukrainian: "uk-UA", Basque: "eu", Welsh: "cy-GB",
  Irish: "ga-IE", Maltese: "mt-MT", Mandarin: "zh-CN", Cantonese: "zh-HK",
  Japanese: "ja-JP", Korean: "ko-KR", Hindi: "hi-IN", Bengali: "bn-IN",
  Tamil: "ta-IN", Nepali: "ne-NP", Sinhala: "si-LK", Thai: "th-TH",
  Lao: "lo-LA", Khmer: "km-KH", Burmese: "my-MM", Vietnamese: "vi-VN",
  Indonesian: "id-ID", Filipino: "fil-PH", Mongolian: "mn-MN", Kazakh: "kk-KZ",
  Georgian: "ka-GE", Armenian: "hy-AM", Arabic: "ar", Hebrew: "he-IL",
  Persian: "fa-IR", Turkish: "tr-TR", Kurdish: "ku", Swahili: "sw",
  Zulu: "zu-ZA", Xhosa: "xh-ZA", Yoruba: "yo", Igbo: "ig-NG", Hausa: "ha",
  Wolof: "wo", Shona: "sn", Somali: "so", Amharic: "am", Malagasy: "mg",
  "Māori": "mi-NZ", Samoan: "sm", Tongan: "to", Fijian: "fj",
  Tahitian: "ty", Cherokee: "chr", Navajo: "nv", Greenlandic: "kl",
  Quechua: "qu", Guarani: "gn", Hawaiian: "haw",
};

/** Speak a greeting aloud with the browser's speech voices. */
export function speakGreeting(g: Pick<Greeting, "word" | "native" | "lang">): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(g.native ?? g.word);
  const code = LANG_CODES[g.lang];
  if (code) u.lang = code;
  u.rate = 0.88;
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
  return true;
}

/** Speak a single word (marquee / foyer) with a best-guess language. */
export function speakWord(word: string, lang?: string): boolean {
  return speakGreeting({ word, lang: lang ?? "English" });
}
