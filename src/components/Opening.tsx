import { Marquee, RotatingBadge, WaveHand, Asterisk } from "./Chrome";
import { FOYER_WORDS, GREETINGS } from "../data/greetings";
import { useScramble } from "../hooks";

const WORDS = FOYER_WORDS.map((f) => f.word);

export function Opening() {
  const { display, index, advance } = useScramble(WORDS, 2500);
  const meta = FOYER_WORDS[index];

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden pt-16">
      {/* ambient oversized letters */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        <span
          className="float-slow absolute -left-10 top-24 font-display text-[38vw] font-extrabold leading-none text-stroke-faint"
          style={{ ["--rot" as string]: "-6deg" }}
        >
          H
        </span>
        <span
          className="float-slow absolute -bottom-24 -right-6 font-display text-[30vw] font-extrabold leading-none text-stroke-faint"
          style={{ ["--rot" as string]: "8deg", animationDelay: "1.2s" }}
        >
          !
        </span>
        <span
          className="float-slow absolute right-[18%] top-10 hidden font-display text-[11vw] font-extrabold leading-none text-stroke-faint lg:block"
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
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-chalk/50">
            A museum of first words · Permanent collection
          </p>
        </div>

        {/* the word itself */}
        <div className="mt-auto">
          <button
            onClick={() => advance()}
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
              <p key={index} className="pop font-mono text-sm uppercase tracking-[0.25em] text-sun">
                {meta.lang} — “{meta.say}”
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-chalk/70 sm:text-lg">
                {GREETINGS.length} greetings hang on these walls, and not two of them
                sound alike. Every one of them does the same impossible thing: turns
                a stranger into a conversation.
              </p>
              <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-chalk/45">
                <WaveHand className="h-4 w-4 text-signal" />
                Click the big word to shuffle — it speaks {FOYER_WORDS.length} languages
              </p>
            </div>

            <div className="relative hidden md:block">
              <RotatingBadge className="h-36 w-36 text-chalk/70" />
            </div>
          </div>

          {/* museum plaque strip */}
          <div className="mt-10 grid grid-cols-2 gap-px border border-chalk/15 bg-chalk/15 md:grid-cols-4">
            {[
              { k: "Exhibit", v: "First Words" },
              { k: "Languages", v: `${GREETINGS.length} hellos` },
              { k: "Admission", v: "One hello" },
              { k: "Hours", v: "Whenever spoken" },
            ].map((item) => (
              <div
                key={item.k}
                className="group bg-midnight px-4 py-4 transition-colors duration-300 hover:bg-ultramarine"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-chalk/45 group-hover:text-chalk/70">
                  {item.k}
                </p>
                <p className="mt-1.5 font-display text-lg font-bold text-chalk sm:text-xl">
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
        />
      </div>
    </section>
  );
}
