import test from "node:test";
import assert from "node:assert/strict";
import {
  BASE_KEY,
  getScopedKey,
  getActiveUser,
  setActiveUser,
  addHello,
  getHelloCount,
  resetHelloCount,
} from "../src/store.ts";

test("getScopedKey namespaces storage keys cleanly by user", () => {
  assert.equal(getScopedKey(BASE_KEY, "alice"), "hello-museum-hellos:alice");
  assert.equal(getScopedKey(BASE_KEY, "bob"), "hello-museum-hellos:bob");
  assert.equal(getScopedKey(BASE_KEY, null), "hello-museum-hellos:guest");
  assert.equal(getScopedKey(BASE_KEY, ""), "hello-museum-hellos:guest");
  assert.equal(getScopedKey(BASE_KEY, "user@domain.com!"), "hello-museum-hellos:user_domain_com_");
});

test("Multi-user mock storage isolation guarantees segregated ledgers", () => {
  const mockStorage = new Map();
  global.window = {};
  global.localStorage = {
    getItem: (k) => mockStorage.get(k) ?? null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
  };

  try {
    // Switch to User 1
    setActiveUser("visitor_101");
    assert.equal(getActiveUser(), "visitor_101");
    resetHelloCount("visitor_101");
    assert.equal(getHelloCount(), 0);

    addHello(3);
    assert.equal(getHelloCount(), 3);
    assert.equal(mockStorage.get("hello-museum-hellos:visitor_101"), "3");

    // Switch to User 2
    setActiveUser("visitor_202");
    assert.equal(getActiveUser(), "visitor_202");
    assert.equal(getHelloCount(), 0);

    addHello(7);
    assert.equal(getHelloCount(), 7);
    assert.equal(mockStorage.get("hello-museum-hellos:visitor_202"), "7");

    // Verify User 1's data remained untouched
    assert.equal(mockStorage.get("hello-museum-hellos:visitor_101"), "3");

    // Switch back to User 1
    setActiveUser("visitor_101");
    assert.equal(getHelloCount(), 3);

    // Reset User 1 without touching User 2
    resetHelloCount("visitor_101");
    assert.equal(getHelloCount(), 0);
    assert.equal(mockStorage.get("hello-museum-hellos:visitor_101"), undefined);
    assert.equal(mockStorage.get("hello-museum-hellos:visitor_202"), "7");
  } finally {
    delete global.window;
    delete global.localStorage;
    setActiveUser(null);
  }
});
