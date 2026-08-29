import { GREETINGS } from "../data/greetings";
import { Reveal, Asterisk } from "./Chrome";
import { useCountUp, useInView } from "../hooks";

interface Stat {
  value: number;
  prefix?: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  {
    value: 7164,
    label: "Living languages on Earth",
    sub: "Ethnologue's running count — every one of them has a way to say hello.",
  },
  {
    value: GREETINGS.length,
    label: "Hellos hanging on this wall",
    sub: "A rounding error of the total. Bring us more — the wall has room.",
  },
  {
    value: 1827,
    label: "The year “hello” hit paper",
    sub: "First recorded use, in an English letter from Norwich. It was still a shout.",
  },
  {
    value: 1974,
    label: "“Hello, world” was born",
    sub: "A Bell Labs memo taught a machine its first words. The tradition never stopped.",
  },
];

function StatBlock({ stat, delay }: { stat: Stat; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const value = useCountUp(stat.value, inView, 1600);
  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        className="group border-t-4 border-midnight px-1 pb-2 pt-6 transition-transform duration-300 hover:-translate-y-1"
      >
        <p className="font-display text-6xl font-extrabold leading-none tracking-tight text-midnight sm:text-7xl">
          {value.toLocaleString("en-US")}
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
          {stat.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-midnight/70">{stat.sub}</p>
      </div>
    </Reveal>
  );
}

export function Numbers() {
  return (
    <section
      id="numbers"
      className="relative scroll-mt-32 overflow-hidden bg-chalk px-4 py-20 text-midnight sm:px-6 md:py-28 lg:scroll-mt-24"
    >
      <div className="bg-dots-ink pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <Asterisk className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 text-signal/15 md:block" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <Asterisk className="h-4 w-4 text-signal" />
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-inkdeep">
              Interlude — Hello by the numbers
            </p>
            <div className="h-px flex-1 bg-inkdeep/20" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-midnight sm:text-6xl lg:text-7xl">
            Count the ways
            <span className="text-signal"> to begin.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatBlock key={s.label} stat={s} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
