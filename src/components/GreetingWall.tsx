import { useMemo, useState } from "react";
import { GREETINGS, REGIONS, type Region } from "../data/greetings";
import { SectionHead, Reveal } from "./Chrome";

export function GreetingWall() {
  const [region, setRegion] = useState<"All" | Region>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GREETINGS.filter((g) => {
      const inRegion = region === "All" || g.region === region;
      if (!inRegion) return false;
      if (!q) return true;
      return (
        g.lang.toLowerCase().includes(q) ||
        g.word.toLowerCase().includes(q) ||
        (g.native ?? "").includes(q)
      );
    });
  }, [region, query]);

  return (
    <section id="wall" className="relative scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          hall="Hall 02 — The Wall"
          title="Every way to open a door"
          note="Say them out loud. Out loud, we said."
        />

        <Reveal delay={80} className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => {
              const active = region === r;
              const count =
                r === "All" ? GREETINGS.length : GREETINGS.filter((g) => g.region === r).length;
              return (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`group flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                    active
                      ? "border-sun bg-sun text-midnight"
                      : "border-chalk/20 text-chalk/70 hover:-translate-y-0.5 hover:border-chalk/60 hover:text-chalk"
                  }`}
                >
                  {r}
                  <span
                    className={`text-[10px] ${active ? "text-midnight/60" : "text-chalk/40 group-hover:text-sun"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="relative block w-full max-w-xs">
            <span className="sr-only">Search greetings</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a language…"
              className="w-full border border-chalk/20 bg-transparent px-4 py-2.5 font-mono text-sm text-chalk placeholder:text-chalk/35 focus:border-sun"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-chalk/35">
              {filtered.length} found
            </span>
          </label>
        </Reveal>

        <div key={`${region}-${query}`} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((g, i) => (
            <article
              key={`${g.lang}-${g.word}`}
              className="cardin group relative flex flex-col justify-between overflow-hidden border border-chalk/15 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 hover:border-sun hover:bg-sun hover:text-midnight hover:shadow-[6px_6px_0_rgba(255,197,61,0.25)]"
              style={{ animationDelay: `${Math.min(i * 22, 500)}ms` }}
            >
              <span className="absolute right-4 top-4 font-mono text-[10px] tracking-widest text-chalk/30 transition-colors group-hover:text-midnight/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pr-10">
                {g.native && (
                  <p className="font-display text-[26px] font-extrabold leading-tight">
                    {g.native}
                  </p>
                )}
                <p
                  className={`font-display text-[26px] font-extrabold leading-tight ${
                    g.native ? "mt-1 text-base font-bold text-chalk/70 transition-colors group-hover:text-midnight/80" : ""
                  }`}
                >
                  {g.word}
                </p>
              </div>
              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-sun transition-colors group-hover:text-midnight">
                  “{g.say}”
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-chalk/10 pt-3 transition-colors group-hover:border-midnight/20">
                  <p className="text-sm font-medium">{g.lang}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-chalk/45 transition-colors group-hover:text-midnight/60">
                    {g.region}
                  </p>
                </div>
                {g.note && (
                  <p className="mt-3 text-xs italic leading-relaxed text-chalk/50 transition-colors group-hover:text-midnight/70">
                    {g.note}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border border-dashed border-chalk/25 px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold text-chalk/70">
              No hellos match “{query}” in {region === "All" ? "any region" : region}.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setRegion("All");
              }}
              className="link-line mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-sun"
            >
              Show the whole wall again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
