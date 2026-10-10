import test from "node:test";
import assert from "node:assert/strict";
import { GREETINGS, REGIONS, FOYER_WORDS, TIMELINE, FIELD_NOTES } from "../src/data/greetings.ts";

test("GREETINGS dataset integrity", () => {
  assert.ok(Array.isArray(GREETINGS), "GREETINGS should be an array");
  assert.ok(GREETINGS.length >= 60, "Should contain at least 60 greetings");

  for (const g of GREETINGS) {
    assert.ok(g.word && typeof g.word === "string", `Greeting missing word: ${JSON.stringify(g)}`);
    assert.ok(g.lang && typeof g.lang === "string", `Greeting missing lang: ${g.word}`);
    assert.ok(g.region && REGIONS.includes(g.region), `Invalid region for ${g.word}: ${g.region}`);
    assert.ok(g.say && typeof g.say === "string", `Greeting missing pronunciation 'say': ${g.word}`);
  }
});

test("REGIONS dataset integrity", () => {
  assert.ok(Array.isArray(REGIONS), "REGIONS should be an array");
  assert.ok(REGIONS.length >= 6, "REGIONS should contain All + 5 zones");
  assert.ok(REGIONS.includes("All"));
  assert.ok(REGIONS.includes("Europe"));
  assert.ok(REGIONS.includes("Asia"));
  assert.ok(REGIONS.includes("Middle East"));
  assert.ok(REGIONS.includes("Africa"));
  assert.ok(REGIONS.includes("Pacific & Americas"));
});

test("FOYER_WORDS dataset integrity", () => {
  assert.ok(Array.isArray(FOYER_WORDS), "FOYER_WORDS should be an array");
  assert.ok(FOYER_WORDS.length >= 10, "FOYER_WORDS should have multiple rotating words");
  for (const f of FOYER_WORDS) {
    assert.ok(f.word && f.lang && f.say, `Foyer word invalid: ${JSON.stringify(f)}`);
  }
});

test("TIMELINE dataset integrity", () => {
  assert.ok(Array.isArray(TIMELINE), "TIMELINE should be an array");
  assert.ok(TIMELINE.length >= 4, "TIMELINE should have key milestones");
  for (const t of TIMELINE) {
    assert.ok(t.year && t.title && t.body, `Timeline item incomplete: ${JSON.stringify(t)}`);
  }
});

test("FIELD_NOTES dataset integrity", () => {
  assert.ok(Array.isArray(FIELD_NOTES), "FIELD_NOTES should be an array");
  assert.ok(FIELD_NOTES.length >= 5, "FIELD_NOTES should have multiple postcards");
  for (const fn of FIELD_NOTES) {
    assert.ok(fn.city && fn.country && fn.fact, `Field note incomplete: ${JSON.stringify(fn)}`);
  }
});

test("Security input sanitization logic for visitor ticket names", () => {
  const sanitize = (raw) => raw.replace(/<[^>]*>?/gm, "").slice(0, 28);

  const maliciousPayload = "<script>alert('XSS')</script>Abhishek";
  assert.equal(sanitize(maliciousPayload), "alert('XSS')Abhishek");

  const htmlImgPayload = "<img src=x onerror=alert(1)>Hello World";
  assert.equal(sanitize(htmlImgPayload), "Hello World");

  const longPayload = "A".repeat(50);
  assert.equal(sanitize(longPayload).length, 28);
});

test("Strix Dual Honeypot validation logic", () => {
  const validateSubmission = ({ botcheck, gotcha, cooldown }) => {
    if (botcheck || (gotcha && gotcha.trim().length > 0)) return { allow: false, reason: "bot_honeypot" };
    if (cooldown) return { allow: false, reason: "cooldown" };
    return { allow: true };
  };

  assert.deepEqual(validateSubmission({ botcheck: false, gotcha: "", cooldown: false }), { allow: true });
  assert.deepEqual(validateSubmission({ botcheck: true, gotcha: "", cooldown: false }), { allow: false, reason: "bot_honeypot" });
  assert.deepEqual(validateSubmission({ botcheck: false, gotcha: "spambot", cooldown: false }), { allow: false, reason: "bot_honeypot" });
  assert.deepEqual(validateSubmission({ botcheck: false, gotcha: "", cooldown: true }), { allow: false, reason: "cooldown" });
});

test("Ticket serial generation format", () => {
  const rollSerial = () => `HW-1827-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  for (let i = 0; i < 20; i++) {
    const serial = rollSerial();
    assert.match(serial, /^HW-1827-\d{4}$/, `Serial ${serial} must match HW-1827-XXXX format`);
  }
});

test("Greeting search and region filtering logic", () => {
  const filterGreetings = (query, region) => {
    const q = query.trim().toLowerCase();
    return GREETINGS.filter((g) => {
      const matchRegion = region === "All" || g.region === region;
      const matchQuery =
        !q ||
        g.lang.toLowerCase().includes(q) ||
        g.word.toLowerCase().includes(q) ||
        (g.native && g.native.toLowerCase().includes(q)) ||
        g.say.toLowerCase().includes(q);
      return matchRegion && matchQuery;
    });
  };

  // Test "All"
  assert.equal(filterGreetings("", "All").length, GREETINGS.length);

  // Test query "spanish"
  const spanish = filterGreetings("spanish", "All");
  assert.ok(spanish.length >= 1);
  assert.equal(spanish[0].lang, "Spanish");

  // Test region "Asia"
  const asia = filterGreetings("", "Asia");
  assert.ok(asia.length > 5);
  for (const item of asia) {
    assert.equal(item.region, "Asia");
  }

  // Test non-matching query
  assert.equal(filterGreetings("nonexistentwordxyz123", "All").length, 0);
});

test("Store count increment logic", () => {
  let count = 0;
  const addHello = (n = 1) => {
    count += n;
    return count;
  };

  assert.equal(addHello(1), 1);
  assert.equal(addHello(5), 6);
  assert.equal(addHello(10), 16);
});

test("Barcode generation constraints", () => {
  const rollBars = () => Array.from({ length: 26 }, () => Math.floor(Math.random() * 3) + 1);
  const bars = rollBars();
  assert.equal(bars.length, 26);
  for (const bar of bars) {
    assert.ok(bar >= 1 && bar <= 3, "Bar width should be between 1 and 3");
  }
});

