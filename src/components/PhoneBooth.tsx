import { useRef, useState } from "react";
import { GREETINGS } from "../data/greetings";
import { SectionHead, Reveal } from "./Chrome";
import { chimeSound, clickSound, ringFor, speakGreeting } from "../sound";
import { addHello } from "../store";

function RotaryPhone({ ringing }: { ringing: boolean }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={`h-full w-full ${ringing ? "wiggle" : ""}`}
      aria-hidden="true"
    >
      {/* ring arcs */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
        <path className="ring-arc" d="M38 34a26 26 0 0 1 22-14" />
        <path className="ring-arc d2" d="M26 44a40 40 0 0 1 30-24" />
        <path className="ring-arc" d="M202 34a26 26 0 0 0-22-14" />
        <path className="ring-arc d3" d="M214 44a40 40 0 0 0-30-24" />
      </g>
      {/* handset */}
      <g fill="currentColor">
        <path
          d="M60 76c-6-30 24-42 60-42s66 12 60 42l-14-2c3-20-19-26-46-26s-49 6-46 26Z"
          opacity="0.9"
        />
        <rect x="42" y="64" width="30" height="24" rx="11" />
        <rect x="168" y="64" width="30" height="24" rx="11" />
      </g>
      {/* cradle */}
      <path d="M78 96h84l8 14H70Z" fill="currentColor" opacity="0.55" />
      {/* body */}
      <path
        d="M64 108h112l18 62c3 11-5 18-16 18H62c-11 0-19-7-16-18Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* dial */}
      <circle cx="120" cy="146" r="30" fill="var(--color-midnight)" stroke="var(--color-chalk)" strokeWidth="2.5" />
      <circle cx="120" cy="146" r="5" fill="var(--color-sun)" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={120 + Math.cos(a) * 20}
            cy={146 + Math.sin(a) * 20}
            r="3.4"
            fill="var(--color-chalk)"
            opacity="0.85"
          />
        );
      })}
      {/* feet */}
      <rect x="70" y="188" width="20" height="7" rx="3" fill="currentColor" />
      <rect x="150" y="188" width="20" height="7" rx="3" fill="currentColor" />
    </svg>
  );
}

export function PhoneBooth() {
  const [side, setSide] = useState<"edison" | "bell">("edison");
  const [ringing, setRinging] = useState(false);
  const [bubble, setBubble] = useState("Hello!");
  const timerRef = useRef<number | null>(null);
  const stopRingRef = useRef<(() => void) | null>(null);

  const pick = (s: "edison" | "bell") => {
    clickSound();
    setSide(s);
    setBubble(s === "edison" ? "Hello!" : "Ahoy!");
  };

  const ring = () => {
    if (ringing) return;
    setRinging(true);
    stopRingRef.current = ringFor(1400);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      stopRingRef.current?.();
      const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setBubble(`${g.native ?? g.word}!`);
      setRinging(false);
      chimeSound();
      speakGreeting(g);
      addHello(1);
    }, 1400);
  };

  return (
    <section id="booth" className="relative scroll-mt-32 px-4 py-20 sm:px-6 md:py-28 lg:scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          hall="Hall 04 — The Phone Booth"
          title="The word that won the phone"
          note="Ring the operator. See who answers."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="max-w-xl text-base leading-relaxed text-chalk/70 sm:text-lg">
              In 1877 the telephone was brand new and nobody knew how to answer it.
              Bell, its inventor, insisted on a hearty <em className="font-semibold text-periwinkle">“Ahoy!”</em>.
              Edison countered with a scribbled <em className="font-semibold text-sun">“Hello!”</em> — and the
              word stuck so hard it's still the first thing billions of phones hear.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => pick("edison")}
                className={`group border-2 px-5 py-4 text-left transition-all duration-200 ${
                  side === "edison"
                    ? "border-sun bg-sun text-midnight"
                    : "border-chalk/25 text-chalk hover:-translate-y-0.5 hover:border-sun hover:text-sun"
                }`}
              >
                <p className="font-display text-2xl font-extrabold">“Hello!”</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                  Edison's pick · 1877
                </p>
                <span
                  className={`mt-3 inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
                    side === "edison"
                      ? "border-midnight/40 text-midnight"
                      : "border-sun/60 text-sun"
                  }`}
                >
                  Won history
                </span>
              </button>
              <button
                onClick={() => pick("bell")}
                className={`group border-2 px-5 py-4 text-left transition-all duration-200 ${
                  side === "bell"
                    ? "border-signal bg-signal text-chalk"
                    : "border-chalk/25 text-chalk hover:-translate-y-0.5 hover:border-signal hover:text-signal"
                }`}
              >
                <p className="font-display text-2xl font-extrabold">“Ahoy!”</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                  Bell's pick · 1877
                </p>
                <span
                  className={`mt-3 inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
                    side === "bell"
                      ? "border-chalk/60 text-chalk"
                      : "border-signal/60 text-signal"
                  }`}
                >
                  Lost politely
                </span>
              </button>
            </div>

            <button
              onClick={ring}
              disabled={ringing}
              className={`mt-6 w-full border-2 px-6 py-4 font-mono text-sm uppercase tracking-[0.3em] transition-all duration-200 ${
                ringing
                  ? "cursor-wait border-signal/60 bg-signal/15 text-signal"
                  : "border-signal text-signal hover:-translate-y-0.5 hover:bg-signal hover:text-chalk hover:shadow-[6px_6px_0_rgba(255,197,61,0.35)] active:translate-y-0 active:scale-[0.99]"
              }`}
            >
              {ringing ? "· · · ringing · · ·" : "Ring the operator"}
            </button>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-chalk/40">
              Someone, somewhere, always picks up
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md border-4 border-chalk/20 bg-inkdeep/70 p-5 pt-14 shadow-[10px_10px_0_rgba(7,11,58,0.8)] sm:p-6 sm:pt-14">
              {/* booth sign */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-center bg-signal py-2">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.5em] text-chalk">
                  Telephone
                </p>
              </div>
              <span className="absolute -left-3 top-24 hidden -rotate-90 font-mono text-[10px] uppercase tracking-[0.35em] text-chalk/40 sm:block">
                Est. 1878
              </span>

              {/* speech bubble — contained inside the booth */}
              <div className="relative flex min-h-[72px] items-start justify-end sm:min-h-[80px]">
                <div
                  key={`${bubble}-${ringing}`}
                  className={`pop relative mr-1 max-w-[72%] bg-sun px-4 py-3 text-midnight shadow-[5px_5px_0_rgba(7,11,58,0.9)] ${ringing ? "opacity-0" : ""}`}
                >
                  <p className="break-words font-display text-lg font-extrabold leading-tight sm:text-2xl">
                    {bubble}
                  </p>
                  <span className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-sun" aria-hidden="true" />
                </div>
              </div>

              <div className={`aspect-[6/5] w-full text-chalk ${ringing ? "ringing" : ""}`}>
                <RotaryPhone ringing={ringing} />
              </div>

              <p className="mt-4 border-t border-chalk/15 pt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-chalk/50">
                {ringing
                  ? "Connecting…"
                  : side === "edison"
                    ? "Line set to Edison standard"
                    : "Line set to Bell standard (brave)"}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
