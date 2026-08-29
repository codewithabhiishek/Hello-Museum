import { Marquee, RotatingBadge, WaveHand, Asterisk, SpeakerIcon } from "./Chrome";
import { FOYER_WORDS, GREETINGS } from "../data/greetings";
import { useScramble } from "../hooks";
import { clickSound, popSound, speakGreeting, tickSound } from "../sound";
import { addHello, useHelloCount } from "../store";

const WORDS = FOYER_WORDS.map((f) => f.word);
const WORD_LANG = new Map<string, string>(FOYER_WORDS.map((f) => [f.word, f.lang]));
WORD_LANG.set("こんにちは", "Japanese");
WORD_LANG.set("你好", "Mandarin");

export function Opening() {
  const { display, index, advance } = useScramble(WORDS, 2500, tickSound);
  const meta = FOYER_WORDS[index];
  const hellos = useHelloCount();

  const shuffle = () => {
    popSound();
    addHello(1);
    advance();
  };

  const hearIt = () => {
    clickSound();
    speakGreeting({ word: meta.word, lang: meta.lang });
  };

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden pt-28 lg:pt-16">
      {/* ambient oversized letters — desktop only, kept clear of the reading column */}
      <div className="pointer-events-none absolute inset-0 hidden select-none md:block" aria-hidden="true">
        <span
          className="float-slow absolute -left-24 top-40 font-display text-[34vw] font-extrabold leading-none text-stroke-faint opacity-70"
          style={{ ["--rot" as string]: "-6deg" }}
        >
          H
        </span>
        <span
          className="float-slow absolute -bottom-28 -right-16 font-display text-[26vw] font-extrabold leading-none text-stroke-faint opacity-70"
          style={{ ["--rot" as string]: "8deg", animationDelay: "1.2s" }}
        >
          !
        </span>
        <span
          className="float-slow absolute right-[16%] top-12 hidden font-display text-[9vw] font-extrabold leading-none text-stroke-faint opacity-70 xl:block"
          style={{ ["--rot" as string]: "12deg", animationDelay: "2.1s" }}
        >
          hola
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-10 pt-10 sm:px-6 md:pt-16">
        {/* eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-periwinkle">
            <Asterisk className="h-4 w-4 text-sun" />
            Hall 01 — The Foyer
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-chalk/50 sm:block">
            A museum of first words · Permanent collection
          </p>
        </div>

        {/* the word itself */}
        <div className="mt-auto">
          <button
            onClick={shuffle}
            title="Shuffle another hello"
            className="group block w-full text-left"
            aria-label={`Currently saying ${meta.word} in ${meta.lang}. Click for another hello.`}
          >
            <h1 className="font-display text-[clamp(3.4rem,15vw,13.5rem)] font-extrabold leading-[0.88] tracking-[-0.02em] text-chalk transition-colors duration-200 group-hover:text-sun">
              {display}
              <span className="text-signal">.</span>
            </h1>
          </button>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div key={index} className="pop flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="font-mono text-sm uppercase tracking-[0.25em] text-sun">
                  {meta.lang} — “{meta.say}”
                </p>
                <button
                  onClick={hearIt}
                  className="inline-flex items-center gap-2 border border-sun/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sun transition-all duration-200 hover:-translate-y-0.5 hover:bg-sun hover:text-midnight"
                >
                  <SpeakerIcon on className="h-3.5 w-3.5" />
                  Hear it
                </button>
              </div>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-chalk/70 sm:text-lg">
                {GREETINGS.length} greetings hang on these walls, and not two of them
                sound alike. Every one of them does the same impossible thing: turns
                a stranger into a conversation.
              </p>
              <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-chalk/45">
                <WaveHand className="h-4 w-4 text-signal" />
                Click the big word to shuffle · “Hear it” says it out loud
              </p>
            </div>

            <div className="relative hidden md:block">
              <RotatingBadge className="h-36 w-36 text-chalk/70" />
            </div>
          </div>

          {/* museum plaque strip */}
          <div className="mt-10 grid grid-cols-2 gap-px border border-chalk/15 bg-chalk/15 md:grid-cols-4">
            {[
              { k: "Exhibit", v: "First Words", live: false },
              { k: "Languages", v: `${GREETINGS.length} hellos`, live: false },
              { k: "Hellos exchanged", v: hellos.toLocaleString("en-US"), live: true },
              { k: "Hours", v: "Whenever spoken", live: false },
            ].map((item) => (
              <div
                key={item.k}
                className="group bg-midnight px-4 py-4 transition-colors duration-300 hover:bg-ultramarine"
              >
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-chalk/45 group-hover:text-chalk/70">
                  {item.live && (
                    <span className="blink inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                  )}
                  {item.k}
                </p>
                <p className="mt-1.5 font-display text-lg font-bold tabular-nums text-chalk sm:text-xl">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* greeting ticker */}
      <div className="relative border-y border-chalk/10 bg-inkdeep/60">
        <Marquee
          duration={38}
          className="py-4"
          itemClassName="font-display text-3xl font-extrabold tracking-tight text-chalk/80 sm:text-4xl"
          onWordClick={(w) => {
            popSound();
            addHello(1);
            speakGreeting({ word: w, lang: WORD_LANG.get(w) ?? "English" });
          }}
        />
      </div>
    </section>
  );
}
