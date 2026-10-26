import { useState, type FormEvent } from "react";
import confetti from "canvas-confetti";
import { GREETINGS, type Greeting } from "../data/greetings";
import { SectionHead, Reveal, WaveHand } from "./Chrome";
import { stampSound, whooshSound } from "../sound";
import { addHello } from "../store";
import { usePrefersReducedMotion } from "../hooks";
import { haptics } from "../haptics";

interface TicketData {
  greeting: Greeting;
  serial: string;
  bars: number[];
}

function rollTicket(): TicketData {
  const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  const serial = `HW-1827-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const bars = Array.from({ length: 26 }, () => Math.floor(Math.random() * 3) + 1);
  return { greeting: g, serial, bars };
}

function Barcode({ bars }: { bars: number[] }) {
  let x = 0;
  return (
    <svg
      viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1.5, 0)} 24`}
      className="h-6 w-20 shrink-0 text-midnight sm:h-8 sm:w-36"
      aria-hidden="true"
    >
      {bars.map((w, i) => {
        const rect = <rect key={i} x={x} y="0" width={w} height="24" fill="currentColor" />;
        x += w + 1.5;
        return rect;
      })}
    </svg>
  );
}

export function Ticket() {
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [stampKey, setStampKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Defensive bot & speed-trap states
  const [botcheck, setBotcheck] = useState(false);
  const [gotcha, setGotcha] = useState("");

  const issue = (e?: FormEvent) => {
    e?.preventDefault();
    // Strix Honeypot Defense: Silently drop if bot traps are tripped
    if (botcheck || gotcha.trim().length > 0) {
      haptics.error();
      return;
    }
    if (coolingDown) {
      haptics.error();
      return;
    }

    setCoolingDown(true);
    setTicket(rollTicket());
    setStampKey((k) => k + 1);
    stampSound();
    whooshSound();
    haptics.stamp();
    addHello(1);
    if (!reduced) {
      confetti({
        particleCount: 70,
        spread: 62,
        startVelocity: 26,
        origin: { x: 0.7, y: 0.6 },
        colors: ["#ffc53d", "#ff4b2e", "#f4f0e4", "#1d2bb0"],
      });
    }

    setTimeout(() => {
      setCoolingDown(false);
    }, 1500);
  };

  const copyTicket = () => {
    if (!ticket) return;
    haptics.success();
    const issuedTo = name.trim() || "A friendly stranger";
    const greetingText = ticket.greeting.native
      ? `${ticket.greeting.native} (${ticket.greeting.word})`
      : ticket.greeting.word;
    const text = `🎟️ HELLO MUSEUM SOUVENIR TICKET\n--------------------------------\nGreeting: ${greetingText}\nPronunciation: “${ticket.greeting.say}”\nLanguage: ${ticket.greeting.lang} (${ticket.greeting.region})\nIssued to: ${issuedTo}\nSerial: ${ticket.serial}\nStatus: Valid Forever\nCurated by: https://abhiishek.is-a.dev/`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section id="ticket" className="relative scroll-mt-32 overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:scroll-mt-24">
      <div className="pointer-events-none absolute inset-0 hidden select-none md:block" aria-hidden="true">
        <span
          className="float-slow absolute -left-16 bottom-0 font-display text-[18vw] font-extrabold leading-none text-stroke-faint opacity-70"
          style={{ ["--rot" as string]: "-8deg" }}
        >
          ciao
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHead
          hall="Hall 06 — Take One Home"
          title="A hello, printed for you"
          note="Valid for one genuine greeting, no expiry"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="max-w-lg text-base leading-relaxed text-chalk/70 sm:text-lg">
              Museums have gift shops; we have a ticket press. Tell us who you're
              greeting and we'll stamp out a first word — drawn at random from the
              wall. Use it the same day for best results.
            </p>
            <form onSubmit={issue} className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              {/* Strix Dual Honeypot fields */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
                aria-hidden="true"
              />
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={gotcha}
                onChange={(e) => setGotcha(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <label className="flex-1">
                <span className="sr-only">Who are you greeting?</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/<[^>]*>?/gm, "").slice(0, 28))}
                  maxLength={28}
                  placeholder="Who are you greeting?"
                  className="w-full border-2 border-chalk/25 bg-transparent px-4 py-3.5 font-mono text-sm text-chalk placeholder:text-chalk/35 focus:border-sun"
                />
              </label>
              <button
                type="submit"
                disabled={coolingDown}
                className={`group flex items-center justify-center gap-3 bg-sun px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-midnight transition-all duration-200 ${
                  coolingDown
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:-translate-y-0.5 hover:bg-chalk hover:shadow-[6px_6px_0_rgba(255,75,46,0.5)] active:translate-y-0 active:scale-[0.98]"
                }`}
              >
                <WaveHand className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                {coolingDown ? "Stamping…" : "Print my hello"}
              </button>
            </form>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-chalk/40">
              {ticket
                ? "Want a different language? Run the press again."
                : "No name? We'll address it to a friendly stranger."}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex min-h-[280px] items-center justify-center">
              {ticket ? (
                <article
                  key={stampKey}
                  className="pop w-full max-w-xl -rotate-1 bg-sun text-midnight shadow-[12px_14px_0_rgba(7,11,58,0.7)] transition-transform duration-300 hover:rotate-0"
                >
                  <div className="flex">
                    {/* stub */}
                    <div className="flex w-14 shrink-0 flex-col items-center justify-between border-r-2 border-dashed border-midnight/40 py-5">
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
                        Admit one hello
                      </span>
                      <span className="mt-4 h-8 w-8 rounded-full border-2 border-midnight/40 font-display text-sm font-extrabold leading-7 text-center">
                        ★
                      </span>
                    </div>
                    {/* main */}
                    <div className="flex-1 p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-midnight/60">
                            The Museum of First Words
                          </p>
                          <p className="mt-3 break-words font-display text-3xl font-extrabold leading-none sm:text-5xl">
                            {ticket.greeting.native ?? ticket.greeting.word}
                          </p>
                          {ticket.greeting.native && (
                            <p className="mt-2 font-display text-lg font-bold text-midnight/80">
                              {ticket.greeting.word}
                            </p>
                          )}
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                            “{ticket.greeting.say}” · {ticket.greeting.lang} · {ticket.greeting.region}
                          </p>
                        </div>
                        <Barcode bars={ticket.bars} />
                      </div>
                      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t-2 border-midnight/20 pt-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-midnight/55">
                            Issued to
                          </p>
                          <p className="mt-1 font-display text-xl font-bold uppercase tracking-wide">
                            {name.trim() || "A friendly stranger"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-midnight/55">
                            {ticket.serial}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-midnight/55">
                            Valid forever
                          </p>
                        </div>
                      </div>

                      {/* Ticket quick actions */}
                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-midnight/15 pt-4">
                        <button
                          onClick={copyTicket}
                          className="flex items-center gap-1.5 border border-midnight/40 bg-midnight/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-midnight transition-colors hover:bg-midnight hover:text-sun"
                        >
                          {copied ? "✓ Copied!" : "Copy ticket card"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="w-full max-w-xl rotate-1 border-2 border-dashed border-chalk/25 px-8 py-16 text-center">
                  <p className="font-display text-2xl font-bold text-chalk/50">
                    Your ticket will appear here
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-chalk/35">
                    The press is warm and waiting
                  </p>
                </div>
              )}
            </div>
            {ticket && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => issue()}
                  disabled={coolingDown}
                  className="link-line font-mono text-[11px] uppercase tracking-[0.3em] text-sun disabled:opacity-50"
                >
                  Stamp another one
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
