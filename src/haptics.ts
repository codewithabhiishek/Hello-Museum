/**
 * Tactile mobile haptic feedback engine for Hello Museum.
 * Safely guards against non-supporting browsers and SSR/Node runtimes.
 */

export const isHapticsSupported = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined" &&
    typeof window.navigator.vibrate === "function"
  );
};

export const triggerHaptic = (pattern: number | number[]): boolean => {
  if (!isHapticsSupported()) return false;
  try {
    return window.navigator.vibrate(pattern);
  } catch {
    return false;
  }
};

export const hapticPatterns = {
  tap: 8,
  select: 12,
  dial: 16,
  ring: [20, 40, 20],
  stamp: [25, 45, 30],
  success: [15, 50, 20],
  easterEgg: [30, 40, 30, 40, 50],
  error: [40, 50, 40],
} as const;

export const haptics = {
  isSupported: isHapticsSupported,
  trigger: triggerHaptic,
  tap: () => triggerHaptic(hapticPatterns.tap),
  select: () => triggerHaptic(hapticPatterns.select),
  dial: () => triggerHaptic(hapticPatterns.dial),
  ring: () => triggerHaptic(hapticPatterns.ring as unknown as number[]),
  stamp: () => triggerHaptic(hapticPatterns.stamp as unknown as number[]),
  success: () => triggerHaptic(hapticPatterns.success as unknown as number[]),
  easterEgg: () => triggerHaptic(hapticPatterns.easterEgg as unknown as number[]),
  error: () => triggerHaptic(hapticPatterns.error as unknown as number[]),
};

export default haptics;
