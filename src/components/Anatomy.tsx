import { TIMELINE } from "../data/greetings";
import { SectionHead, Reveal, Asterisk } from "./Chrome";

const ACCENT: Record<string, string> = {
  chalk: "text-chalk",
  sun: "text-sun",
  signal: "text-signal",
  periwinkle: "text-periwinkle",
};

const DOT: Record<string, string> = {
  chalk: "bg-chalk",
  sun: "bg-sun",
  signal: "bg-signal",
  periwinkle: "bg-periwinkle",
};

export function Anatomy() {
  return (
    <section id="anatomy" className="relative scroll-mt-32 overflow-hidden px-4 py-20 sm:px-6 md:py-28 lg:scroll-mt-24">
      <div className="pointer-events-none absolute inset-0 hidden select-none md:block" aria-hidden="true">
        <span
          className="float-slow absolute -right-20 top-40 font-display text-[18vw] font-extrabold leading-none text-stroke-faint opacity-70"
          style={{ ["--rot" as string]: "10deg" }}
        >
          1827
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHead
          hall="Hall 03 — Anatomy of a Hello"
          title="A shout that learned manners"
          note="From river shout to telephone to compiler"
        />

        <div className="relative ml-3 border-l-2 border-chalk/15 sm:ml-6">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 60} className="relative pb-12 pl-8 last:pb-0 sm:pl-14">
              <span
                className={`absolute -left-[9px] top-3 h-4 w-4 rotate-45 border-2 border-midnight ${DOT[t.accent]}`}
                aria-hidden="true"
              />
              <div className="grid gap-3 md:grid-cols-[200px_1fr] md:gap-10">
                <p
                  className={`font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl ${ACCENT[t.accent]}`}
                >
                  {t.year}
                </p>
                <div>
                  <h3 className="font-display text-xl font-bold text-chalk sm:text-2xl">
                    {t.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-chalk/65">
                    {t.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-16 flex items-center gap-4 border border-chalk/15 bg-inkdeep/50 px-6 py-5">
          <Asterisk className="h-5 w-5 shrink-0 text-sun" />
          <p className="text-sm leading-relaxed text-chalk/70 sm:text-base">
            <strong className="font-bold text-chalk">Docent's aside:</strong> “Ahoy” lost the
            telephone by a hair — but it survived as the word cartoon ship captains never
            stopped shouting, which is arguably a better retirement plan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
