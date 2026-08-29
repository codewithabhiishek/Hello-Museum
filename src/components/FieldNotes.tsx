import { FIELD_NOTES } from "../data/greetings";
import { SectionHead, Reveal, StampMark } from "./Chrome";

const STAMP_BG: Record<string, string> = {
  sun: "bg-sun text-midnight",
  signal: "bg-signal text-chalk",
  periwinkle: "bg-periwinkle text-midnight",
  chalk: "bg-chalk text-midnight",
};

const OFFSETS = ["lg:mt-0", "lg:mt-14", "lg:mt-6", "lg:mt-10", "lg:mt-0", "lg:mt-16", "lg:mt-4"];

export function FieldNotes() {
  return (
    <section id="notes" className="relative scroll-mt-32 px-4 py-20 sm:px-6 md:py-28 lg:scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          hall="Hall 05 — Field Notes"
          title="Postcards from the greeting desk"
          note="Found pinned to the corkboard"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FIELD_NOTES.map((note, i) => (
            <Reveal key={note.city} delay={(i % 3) * 110} className={OFFSETS[i % OFFSETS.length]}>
              <article
                className={`[transform:rotate(var(--rot))] group relative bg-chalk p-6 text-midnight shadow-[8px_10px_0_rgba(7,11,58,0.55)] transition-all duration-300 hover:z-10 hover:[transform:rotate(0deg)_translateY(-8px)] hover:shadow-[14px_16px_0_rgba(7,11,58,0.7)]`}
                style={{ ["--rot" as string]: `${note.rot}deg` }}
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden="true" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-midnight/50">
                      Posted from
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold leading-tight">
                      {note.city}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                      {note.country}
                    </p>
                  </div>
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center border-2 border-dashed border-midnight/30 ${STAMP_BG[note.stamp]} transition-transform duration-300 group-hover:rotate-6`}
                  >
                    <StampMark className="h-9 w-9" />
                  </div>
                </div>

                <p className="mt-5 border-t-2 border-midnight/10 pt-4 text-[15px] leading-relaxed text-midnight/85">
                  {note.fact}
                </p>

                <p className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-midnight/40">
                  <span>Field note {String(i + 1).padStart(2, "0")}</span>
                  <span>Do not bend</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
