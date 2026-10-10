import { useEffect, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { useInView, usePrefersReducedMotion } from "../hooks";
import { MARQUEE_WORDS } from "../data/greetings";
import { clickSound, chimeSound, toggleMuted, useSoundEnabled } from "../sound";
import { addHello, useHelloCount } from "../store";

/* ---------- small custom SVG marks ---------- */

export function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2.5v19M3.8 7.25l16.4 9.5M20.2 7.25l-16.4 9.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WaveHand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 15.5 7.2 13a1.9 1.9 0 0 1 2.6-2.7l4.4 3.6V6.6a1.8 1.8 0 0 1 3.6 0v6.6l1-.6a2 2 0 0 1 2.6.5l1.5 2.2c.9 1.3 1.3 2.9.9 4.5l-.8 3.4a6 6 0 0 1-5.8 4.6h-1.9a6 6 0 0 1-4.8-2.4l-3-3.9a1.8 1.8 0 0 1 2.5-2.6l1 1V15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24.5 7.5c1.4 1 2.3 2.4 2.7 4M27.6 4.6c2 1.5 3.3 3.6 3.8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StampMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="38" height="38" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M12 26c3-7 6-9 10-9s7 2 10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* ---------- atmosphere ---------- */

export function Noise() {
  return <div className="noise" aria-hidden="true" />;
}

export function RotatingBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 160 160" className="h-full w-full spin-slower">
        <defs>
          <path id="badge-circle" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
        </defs>
        <text className="fill-current font-mono" fontSize="12.5" letterSpacing="3.5">
          <textPath href="#badge-circle">
            SAY IT BACK ✱ WAVE FIRST ✱ SMILE ✱ SAY IT LOUDER ✱
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Asterisk className="h-8 w-8" />
      </div>
    </div>
  );
}

export function Marquee({
  words = MARQUEE_WORDS,
  duration = 32,
  className = "",
  itemClassName = "",
  onWordClick,
}: {
  words?: string[];
  duration?: number;
  className?: string;
  itemClassName?: string;
  onWordClick?: (word: string) => void;
}) {
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={`flex items-center ${itemClassName}`}>
          {onWordClick ? (
            <button
              onClick={() => onWordClick(w)}
              tabIndex={hidden ? -1 : 0}
              title={`Say ${w}`}
              className="whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:text-sun focus-visible:text-sun"
            >
              {w}
            </button>
          ) : (
            <span className="whitespace-nowrap">{w}</span>
          )}
          <Asterisk className="mx-5 h-[0.55em] w-[0.55em] shrink-0 opacity-60" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee-track is-paused"
        style={{ ["--marquee-dur" as string]: `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

/* ---------- scroll reveal ---------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- section header ---------- */

export function SectionHead({
  hall,
  title,
  note,
  light = false,
}: {
  hall: string;
  title: string;
  note?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-center gap-3">
        <Asterisk className={`h-4 w-4 ${light ? "text-signal" : "text-sun"}`} />
        <p className={`font-mono text-[11px] uppercase tracking-[0.35em] ${light ? "text-inkdeep" : "text-periwinkle"}`}>
          {hall}
        </p>
        <div className={`h-px flex-1 ${light ? "bg-inkdeep/20" : "bg-chalk/15"}`} />
        {note && (
          <p className={`hidden font-mono text-[11px] uppercase tracking-[0.2em] md:block ${light ? "text-inkdeep/60" : "text-chalk/50"}`}>
            {note}
          </p>
        )}
      </div>
      <h2
        className={`mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl ${light ? "text-midnight" : "text-chalk"}`}
      >
        {title}
      </h2>
    </Reveal>
  );
}

/* ---------- header ---------- */

const NAV = [
  { href: "#wall", id: "wall", label: "The Wall" },
  { href: "#anatomy", id: "anatomy", label: "Anatomy" },
  { href: "#booth", id: "booth", label: "Phone Booth" },
  { href: "#notes", id: "notes", label: "Field Notes" },
  { href: "#ticket", id: "ticket", label: "Take One Home" },
];

const NAV_IDS = NAV.map((n) => n.id);

function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.4] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[55] h-[3px] w-full origin-left bg-sun"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}

function useDayGreeting() {
  const [label, setLabel] = useState("Good day");
  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setLabel(h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);
  return label;
}

export function SpeakerIcon({ on, className = "" }: { on: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {on ? (
        <path
          d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M15.5 9.5l5 5M20.5 9.5l-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Header() {
  const greeting = useDayGreeting();
  const soundOn = useSoundEnabled();
  const hellos = useHelloCount();
  const active = useScrollSpy(NAV_IDS);
  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-chalk/10 bg-midnight/85 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-3">
            <a href="#top" className="group flex shrink-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center bg-ultramarine font-display text-lg font-extrabold text-sun transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                H
              </span>
              <span className="hidden font-display text-sm font-bold uppercase tracking-[0.18em] text-chalk min-[420px]:inline">
                Hello Museum
              </span>
            </a>

            <nav className="hidden items-center gap-6 lg:flex" aria-label="Halls">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`link-line font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                    active === n.id ? "text-sun" : "text-chalk/70 hover:text-chalk"
                  }`}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <p className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-chalk/50 xl:flex">
                <span className="blink inline-block h-2 w-2 rounded-full bg-signal" />
                {greeting} — open now
              </p>
              <p
                className="hidden items-center gap-2 border border-chalk/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-chalk/70 min-[420px]:flex"
                title="Hellos exchanged by visitors, all time"
              >
                <Asterisk className="h-3 w-3 text-sun" />
                <span className="tabular-nums text-sun">
                  {hellos.toLocaleString("en-US")}
                </span>
                hellos
              </p>
              <a
                href="https://abhiishek.is-a.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 border border-chalk/20 bg-midnight/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-chalk/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-sun hover:text-sun sm:flex"
                title="Curator Portfolio"
              >
                Curator ↗
              </a>
              <button
                onClick={() => {
                  const turningOn = !soundOn;
                  toggleMuted();
                  if (turningOn) clickSound();
                }}
                aria-pressed={soundOn}
                title={soundOn ? "Mute the museum" : "Unmute the museum"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  soundOn
                    ? "border-sun/60 text-sun hover:bg-sun hover:text-midnight"
                    : "border-chalk/25 text-chalk/50 hover:border-chalk/60 hover:text-chalk"
                }`}
              >
                <SpeakerIcon on={soundOn} className="h-5 w-5" />
                <span className="sr-only">{soundOn ? "Sound is on" : "Sound is off"}</span>
              </button>
            </div>
          </div>

          {/* mobile / tablet nav */}
          <nav
            className="-mx-1 flex items-center gap-1.5 overflow-x-auto pb-2.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            aria-label="Halls"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                aria-current={active === n.id ? "true" : undefined}
                className={`whitespace-nowrap border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active === n.id
                    ? "border-sun bg-sun text-midnight"
                    : "border-chalk/20 text-chalk/70 hover:border-chalk/50 hover:text-chalk"
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

/* ---------- cursor spotlight ---------- */

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.background = `radial-gradient(540px circle at ${e.clientX}px ${e.clientY}px, rgba(155,165,255,0.10), rgba(255,197,61,0.04) 40%, transparent 68%)`;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="pointer-events-none fixed inset-0 z-[45]" aria-hidden="true" />;
}

/* ---------- keyboard easter egg: type "hello" anywhere ---------- */

export function EasterEgg() {
  const reduced = usePrefersReducedMotion();
  const [toast, setToast] = useState(false);
  const buf = useRef("");
  const timer = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      buf.current = (buf.current + e.key.toLowerCase()).slice(-5);
      if (buf.current !== "hello") return;
      buf.current = "";
      addHello(5);
      chimeSound();
      if (!reduced) {
        confetti({
          particleCount: 110,
          spread: 78,
          origin: { y: 0.35 },
          colors: ["#ffc53d", "#ff4b2e", "#f4f0e4", "#9ba5ff"],
        });
      }
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 3200);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, [reduced]);
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2">
      <div className="pop border-2 border-sun bg-midnight px-6 py-3 shadow-[6px_6px_0_rgba(255,75,46,0.5)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sun">
          The museum heard you — +5 hellos
        </p>
      </div>
    </div>
  );
}

/* ---------- footer ---------- */

export function Footer() {
  const words = ["HELLO", "HOLA", "BONJOUR", "CIAO", "ALOHA", "你好", "NAMASTE", "KIA ORA"];
  return (
    <footer className="relative border-t border-chalk/10 bg-abyss">
      <Marquee
        words={words}
        duration={40}
        className="py-6"
        itemClassName="font-display text-[13vw] leading-none font-extrabold tracking-tight text-stroke-faint sm:text-[9vw]"
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-10 pt-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold text-chalk">
            The Museum of First Words
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-chalk/60">
            Greetings belong to everyone. Admission is free and always will be —
            just say hello at the door.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="link-line w-fit font-mono text-[11px] uppercase tracking-[0.2em] text-chalk/60 transition-colors hover:text-sun"
            >
              {n.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-chalk/40">
            Est. 1827, on record — {new Date().getFullYear()} everywhere
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-chalk/60">
            Curated & Built by{" "}
            <a
              href="https://abhiishek.is-a.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sun underline decoration-sun/40 underline-offset-4 transition-colors hover:text-chalk hover:decoration-chalk"
            >
              Abhishek
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
