import { useEffect, useMemo, useState } from "react";
import { GREETINGS, REGIONS, type Greeting, type Region } from "../data/greetings";
import { SectionHead, Reveal, SpeakerIcon, Asterisk, CloseIcon } from "./Chrome";
import { clickSound, popSound, speakGreeting } from "../sound";
import { addHello } from "../store";

function ExhibitLabel({ g, onClose, onShuffle }: { g: Greeting; onClose: () => void; onShuffle: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${g.word} — ${g.lang} greeting`}
    >
      <button
        className="absolute inset-0 bg-abyss/85"
        onClick={onClose}
        aria-label="Close exhibit label"
      />
      <article className="pop relative w-full max-w-lg border-4 border-midnight bg-sun text-midnight shadow-[14px_14px_0_rgba(255,75,46,0.45)]">
        <div className="flex items-center justify-between border-b-4 border-midnight bg-chalk px-4 py-2.5 sm:px-6">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-midnight/70">
            <Asterisk className="h-3 w-3 shrink-0 text-signal" />
            <span className="truncate">Exhibit label · {g.region}</span>
          </p>
          <button
            onClick={onClose}
            autoFocus
            aria-label="Close exhibit label"
            className="flex h-8 w-8 items-center justify-center border-2 border-midnight/40 text-midnight/70 transition-all duration-150 hover:rotate-90 hover:border-midnight hover:bg-midnight hover:text-sun active:scale-95"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <p className="break-words font-display text-[clamp(2.3rem,9vw,4.25rem)] font-extrabold leading-[0.98] tracking-tight">
            {g.native ?? g.word}
          </p>
          {g.native && (
            <p className="mt-2 break-words font-display text-2xl font-bold text-midnight/80">
              {g.word}
            </p>
          )}
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">
            “{g.say}” · {g.lang}
          </p>
          {g.note ? (
            <p className="mt-5 border-l-4 border-midnight/30 pl-4 text-[15px] italic leading-relaxed text-midnight/85">
              {g.note}
            </p>
          ) : (
            <p className="mt-5 border-l-4 border-midnight/30 pl-4 text-[15px] italic leading-relaxed text-midnight/70">
              One of {GREETINGS.length} ways to open a door on this wall.
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => {
                clickSound();
                speakGreeting(g);
              }}
              className="group flex items-center gap-2.5 bg-midnight px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-sun transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_rgba(7,11,58,0.4)]"
            >
              <SpeakerIcon on className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Hear it spoken
            </button>
            <button
              onClick={onShuffle}
              className="flex items-center gap-2.5 border-2 border-midnight px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-midnight transition-all duration-200 hover:-translate-y-0.5 hover:bg-midnight hover:text-sun"
            >
              Another hello
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export function GreetingWall() {
  const [region, setRegion] = useState<"All" | Region>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Greeting | null>(null);

  const openCard = (g: Greeting) => {
    popSound();
    addHello(1);
    setSelected(g);
  };

  const shuffleCard = () => {
    popSound();
    setSelected(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  };

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
    <section id="wall" className="relative scroll-mt-32 px-4 py-20 sm:px-6 md:py-28 lg:scroll-mt-24">
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
                  className={`group flex items-center gap-2 border-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 active:scale-95 ${
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
              className="w-full border-2 border-chalk/20 bg-transparent px-4 py-2.5 font-mono text-sm text-chalk placeholder:text-chalk/35 focus:border-sun"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-chalk/35">
              {filtered.length} found
            </span>
          </label>
        </Reveal>

        <div
          key={`${region}-${query}`}
          className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((g, i) => (
            <article
              key={`${g.lang}-${g.word}`}
              onClick={() => openCard(g)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCard(g);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Open exhibit label for ${g.word}, ${g.lang}`}
              className="cardin group relative flex cursor-pointer flex-col justify-between overflow-hidden border border-chalk/15 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 hover:border-sun hover:bg-sun hover:text-midnight hover:shadow-[6px_6px_0_rgba(255,197,61,0.25)]"
              style={{ animationDelay: `${Math.min(i * 22, 500)}ms` }}
            >
              <span className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clickSound();
                    speakGreeting(g);
                  }}
                  aria-label={`Hear ${g.word} spoken in ${g.lang}`}
                  title={`Hear “${g.word}”`}
                  className="flex h-7 w-7 items-center justify-center border border-chalk/25 text-chalk/60 opacity-70 transition-all duration-200 hover:scale-110 hover:border-signal hover:text-signal group-hover:border-midnight/40 group-hover:text-midnight group-hover:opacity-100 group-hover:hover:border-midnight group-hover:hover:bg-midnight group-hover:hover:text-sun"
                >
                  <SpeakerIcon on className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px] tracking-widest text-chalk/30 transition-colors group-hover:text-midnight/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <div className="pr-10">
                {g.native && (
                  <p className="break-words font-display text-[26px] font-extrabold leading-tight">
                    {g.native}
                  </p>
                )}
                <p
                  className={`break-words font-display text-[26px] font-extrabold leading-tight ${
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

      {selected && (
        <ExhibitLabel
          g={selected}
          onClose={() => setSelected(null)}
          onShuffle={shuffleCard}
        />
      )}
    </section>
  );
}
