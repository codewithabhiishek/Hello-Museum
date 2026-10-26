import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------
   The museum's "hellos exchanged" ledger — every click, ring and
   stamped ticket adds to a persistent running total.
   Scoped by visitor/user to ensure multi-user data isolation.
   --------------------------------------------------------------- */

export const BASE_KEY = "hello-museum-hellos";

let activeUserId: string | null = null;

export function getScopedKey(baseKey: string, userId?: string | null): string {
  const safeUser = (userId || activeUserId || "guest").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${baseKey}:${safeUser}`;
}

export function getActiveUser(): string | null {
  return activeUserId;
}

function loadCountForUser(userId?: string | null): number {
  if (typeof window === "undefined") return 0;
  try {
    const key = getScopedKey(BASE_KEY, userId);
    const stored = Number(localStorage.getItem(key));
    if (Number.isFinite(stored) && stored >= 0) return stored;
    // Gracefully migrate legacy un-scoped key if visitor is on guest
    if (!userId || userId === "guest") {
      const legacy = Number(localStorage.getItem(BASE_KEY));
      if (Number.isFinite(legacy) && legacy >= 0) {
        localStorage.setItem(key, String(legacy));
        return legacy;
      }
    }
  } catch {
    /* private mode or storage disabled */
  }
  return 0;
}

let count = loadCountForUser(activeUserId);
const subs = new Set<() => void>();

export function setActiveUser(userId: string | null) {
  if (activeUserId === userId) return;
  activeUserId = userId;
  count = loadCountForUser(activeUserId);
  subs.forEach((s) => s());
}

export function addHello(n = 1) {
  count += n;
  try {
    const key = getScopedKey(BASE_KEY, activeUserId);
    localStorage.setItem(key, String(count));
  } catch {
    /* private mode */
  }
  subs.forEach((s) => s());
}

export function resetHelloCount(userId?: string | null) {
  count = 0;
  try {
    const key = getScopedKey(BASE_KEY, userId || activeUserId);
    localStorage.removeItem(key);
  } catch {
    /* private mode */
  }
  subs.forEach((s) => s());
}

export function getHelloCount(): number {
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
