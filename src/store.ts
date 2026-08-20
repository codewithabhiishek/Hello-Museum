import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------
   The museum's "hellos exchanged" ledger — every click, ring and
   stamped ticket adds to a persistent running total.
   --------------------------------------------------------------- */

const KEY = "hello-museum-hellos";

let count = 0;
if (typeof window !== "undefined") {
  const stored = Number(localStorage.getItem(KEY));
  count = Number.isFinite(stored) ? stored : 0;
}

const subs = new Set<() => void>();

export function addHello(n = 1) {
  count += n;
  try {
    localStorage.setItem(KEY, String(count));
  } catch {
    /* private mode */
  }
  subs.forEach((s) => s());
}

export function getHelloCount() {
  return count;
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function useHelloCount(): number {
  return useSyncExternalStore(subscribe, getHelloCount);
}
