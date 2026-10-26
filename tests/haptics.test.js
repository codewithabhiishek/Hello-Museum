import test from "node:test";
import assert from "node:assert/strict";
import {
  haptics,
  hapticPatterns,
  isHapticsSupported,
  triggerHaptic,
} from "../src/haptics.ts";

test("hapticPatterns defines expected vibration timing arrays and numbers", () => {
  assert.equal(typeof hapticPatterns.tap, "number");
  assert.equal(typeof hapticPatterns.select, "number");
  assert.equal(typeof hapticPatterns.dial, "number");

  assert.ok(Array.isArray(hapticPatterns.ring));
  assert.ok(Array.isArray(hapticPatterns.stamp));
  assert.ok(Array.isArray(hapticPatterns.success));
  assert.ok(Array.isArray(hapticPatterns.easterEgg));
  assert.ok(Array.isArray(hapticPatterns.error));

  assert.ok(hapticPatterns.tap > 0);
  assert.ok(hapticPatterns.stamp.length >= 2);
  assert.ok(hapticPatterns.easterEgg.length >= 4);
});

test("isHapticsSupported handles missing window safely in Node environment", () => {
  assert.equal(isHapticsSupported(), false);
  assert.equal(triggerHaptic(10), false);
  assert.equal(haptics.tap(), false);
  assert.equal(haptics.stamp(), false);
  assert.equal(haptics.dial(), false);
  assert.equal(haptics.ring(), false);
  assert.equal(haptics.success(), false);
  assert.equal(haptics.easterEgg(), false);
  assert.equal(haptics.error(), false);
});

test("triggerHaptic invokes navigator.vibrate when available in browser", () => {
  let vibratePattern = null;
  const mockNavigator = {
    vibrate: (pattern) => {
      vibratePattern = pattern;
      return true;
    },
  };

  global.window = { navigator: mockNavigator };

  try {
    assert.equal(isHapticsSupported(), true);
    const res = triggerHaptic(20);
    assert.equal(res, true);
    assert.equal(vibratePattern, 20);

    haptics.stamp();
    assert.deepEqual(vibratePattern, hapticPatterns.stamp);

    haptics.easterEgg();
    assert.deepEqual(vibratePattern, hapticPatterns.easterEgg);
  } finally {
    delete global.window;
  }
});

test("triggerHaptic safely catches and handles exceptions from navigator.vibrate", () => {
  const mockNavigator = {
    vibrate: () => {
      throw new Error("Vibration blocked by user permissions");
    },
  };

  global.window = { navigator: mockNavigator };

  try {
    assert.equal(isHapticsSupported(), true);
    const res = triggerHaptic(15);
    assert.equal(res, false);
  } finally {
    delete global.window;
  }
});
