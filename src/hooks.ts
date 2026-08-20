import { useCallback, useEffect, useRef, useState } from "react";

/* Respect the user's motion preference. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const POOL = "AEIOUBCDGHKLMNPRSTVWXZ*#%&?!+";

/* Scramble-decode cycler for the foyer word. */
export function useScramble(words: string[], hold = 2400, onTick?: () => void) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(words[0]);
  const [index, setIndex] = useState(0);
  const idxRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const advance = useCallback(
    (explicitIdx?: number) => {
      clearTimers();
      const nextIdx =
        explicitIdx !== undefined ? explicitIdx : (idxRef.current + 1) % words.length;
      idxRef.current = nextIdx;
      setIndex(nextIdx);
      const target = words[nextIdx];
      if (reduced) {
        setDisplay(target);
        return;
      }
      const frames = Math.max(target.length * 3, 14);
      for (let f = 0; f <= frames; f++) {
        const t = window.setTimeout(() => {
          onTick?.();
          const locked = Math.floor((f / frames) * target.length);
          const out = target
            .split("")
            .map((ch, i) =>
              ch === " " || i < locked ? ch : POOL[(Math.random() * POOL.length) | 0],
            )
            .join("");
          setDisplay(out);
        }, f * 26);
        timersRef.current.push(t);
      }
      const done = window.setTimeout(() => setDisplay(target), frames * 26 + 40);
      timersRef.current.push(done);
    },
    [words, reduced, onTick],
  );

  useEffect(() => {
    const id = window.setInterval(() => advance(), hold + (reduced ? 2000 : 1300));
    return () => {
      window.clearInterval(id);
      clearTimers();
    };
  }, [advance, hold, reduced]);

  return { display, index, advance };
}

/* Animated number count-up when `start` flips true. */
export function useCountUp(target: number, start: boolean, duration = 1500): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, reduced]);
  return value;
}

/* IntersectionObserver visibility flag (fires once). */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
