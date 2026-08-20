import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "../hooks";
import { MARQUEE_WORDS } from "../data/greetings";

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
}: {
  words?: string[];
  duration?: number;
  className?: string;
  itemClassName?: string;
}) {
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={`flex items-center ${itemClassName}`}>
          <span className="whitespace-nowrap">{w}</span>
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
  { href: "#wall", label: "The Wall" },
  { href: "#anatomy", label: "Anatomy" },
  { href: "#booth", label: "Phone Booth" },
  { href: "#notes", label: "Field Notes" },
  { href: "#ticket", label: "Take One Home" },
];

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

export function Header() {
  const greeting = useDayGreeting();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-chalk/10 bg-midnight/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center bg-ultramarine font-display text-lg font-extrabold text-sun transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            H
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-chalk">
            Hello Museum
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="link-line font-mono text-[11px] uppercase tracking-[0.22em] text-chalk/70 transition-colors hover:text-chalk"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sun">
          <span className="blink inline-block h-2 w-2 rounded-full bg-signal" />
          {greeting} — open now
        </p>
      </div>
    </header>
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-chalk/40">
          Est. 1827, on record — {new Date().getFullYear()} everywhere
        </p>
      </div>
    </footer>
  );
}
