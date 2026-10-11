"use client";

import Link from "next/link";
import { toast } from "@/components/toast/toast-store";
import { MATH, mathProgress, sectionLessons, type MathSection, type SectionStatus } from "@/lib/math/curriculum";
import type { Progress } from "@/lib/progress";
import { SectionArt } from "./section-art";

// "Your topics" style course block: course header + numbered section tiles, either as a
// connected scrolling row (home) or a wrapping grid (/math).
// Sections unlock in order; locked and coming-soon tiles explain themselves with a toast.
export function MathCourseCard({ progress, layout = "row" }: { progress: Progress; layout?: "row" | "grid" }) {
  const { sections } = mathProgress(progress);
  const totalLessons = MATH.reduce((sum, s) => sum + sectionLessons(s).length, 0);

  return (
    <section aria-labelledby="math-course" className="min-w-0">
      <div className="flex items-center gap-4 sm:gap-6">
        <CourseIcon />
        <div className="min-w-0">
          <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:text-xs">Grades 3–8 · {MATH.length} sections</p>
          <h2 id="math-course" className="mt-0.5 font-cofo text-xl font-bold sm:text-2xl">
            Math
          </h2>
          <p className="mt-1 text-sm text-muted sm:text-base">
            From number sense to olympiad puzzles. {totalLessons} lessons, one step at a time.
          </p>
        </div>
      </div>

      <div className="relative mt-5 rounded-[24px] bg-foreground/[0.04] sm:mt-6 sm:rounded-[28px]">
        {layout === "grid" ? (
          <ol className="grid grid-cols-2 gap-x-3 gap-y-5 p-4 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 sm:p-6 lg:grid-cols-4">
            {MATH.map((section) => (
              <li key={section.id} className="min-w-0">
                <SectionTile section={section} status={sections[section.id]} fluid />
              </li>
            ))}
          </ol>
        ) : (
        /* right-edge fade hints that the row scrolls */
        <ol className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 py-5 [mask-image:linear-gradient(to_right,black_88%,transparent)] sm:px-6 sm:py-7">
          {MATH.map((section, i) => (
            <li key={section.id} className="flex shrink-0 snap-start items-start">
              <SectionTile section={section} status={sections[section.id]} />
              {i < MATH.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mt-[60px] h-0.5 w-4 shrink-0 sm:mt-[78px] sm:w-6 ${
                    sections[MATH[i + 1].id].state === "locked" ? "bg-border" : "bg-border-strong"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
        )}
      </div>
    </section>
  );
}

/** `fluid` tiles fill their grid cell (square); otherwise they have a fixed size for the row. */
function SectionTile({ section, status, fluid = false }: { section: MathSection; status: SectionStatus; fluid?: boolean }) {
  const { state } = status;
  const clickable = state === "open" || state === "done";
  const accent = { "--accent": section.color.main, "--accent-shadow": section.color.shadow } as React.CSSProperties;

  const tile = (
    <>
      <span
        className={`relative flex flex-col rounded-[20px] border-2 bg-surface p-2.5 transition-[transform,border-color] sm:rounded-[24px] sm:p-3 ${
          fluid ? "aspect-square w-full" : "h-[120px] w-[120px] sm:h-[156px] sm:w-[156px]"
        } ${
          state === "open"
            ? "border-[var(--accent)] shadow-[0_4px_0_var(--accent-shadow)] group-hover:-translate-y-0.5"
            : state === "done"
              ? "border-border shadow-[0_4px_0_var(--border)] group-hover:-translate-y-0.5"
              : "border-border shadow-[0_4px_0_var(--border)]"
        }`}
      >
        <span className="flex items-center justify-between">
          <span className="font-cofo text-[10px] font-bold text-muted sm:text-xs">{section.grade}</span>
          <TileBadge state={state} />
        </span>
        <span className={`grid flex-1 place-items-center ${state === "locked" || state === "soon" ? "opacity-45 grayscale" : ""}`}>
          <SectionArt id={section.id} color={section.color} className={fluid ? "h-auto w-[58%]" : "size-14 sm:size-20"} />
        </span>
        {/* progress strip */}
        {status.playable > 0 && state !== "locked" && (
          <span className="h-1.5 overflow-hidden rounded-full bg-border">
            <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${(status.done / status.playable) * 100}%` }} />
          </span>
        )}
      </span>
      <span className={`mt-2.5 text-center ${fluid ? "w-full" : "w-[120px] sm:w-[156px]"}`}>
        <span className="block font-cofo text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">Section {section.number}</span>
        <span className={`block font-cofo text-sm font-bold leading-tight sm:text-[15px] ${state === "locked" ? "text-muted" : ""}`}>{section.short}</span>
      </span>
    </>
  );

  if (clickable) {
    return (
      <Link href={`/math/${section.id}`} className="group flex w-full flex-col items-center" style={accent}>
        {tile}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        toast.warning(
          state === "soon" ? `${section.short} is coming soon!` : `Finish Section ${section.number - 1} to unlock ${section.short}.`,
        )
      }
      aria-disabled="true"
      className="flex w-full cursor-not-allowed flex-col items-center"
      style={accent}
    >
      {tile}
    </button>
  );
}

function TileBadge({ state }: { state: SectionStatus["state"] }) {
  if (state === "done") {
    return (
      <span className="grid size-5 place-items-center rounded-full bg-[var(--accent)] text-white sm:size-6" aria-label="Completed">
        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (state === "locked") {
    return (
      <span className="grid size-5 place-items-center rounded-full bg-border text-muted sm:size-6" aria-label="Locked">
        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
    );
  }
  if (state === "soon") {
    return <span className="rounded-full bg-border px-1.5 py-0.5 font-cofo text-[9px] font-bold uppercase text-muted sm:text-[10px]">Soon</span>;
  }
  return <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 font-cofo text-[9px] font-bold uppercase text-white sm:text-[10px]">Go</span>;
}

/** Course icon: a few overlapping shapes in section colors. */
function CourseIcon() {
  return (
    <svg viewBox="0 0 96 96" className="size-16 shrink-0 sm:size-20" aria-hidden="true">
      <circle cx="32" cy="34" r="20" fill="#3346d6" transform="translate(3 4)" />
      <circle cx="32" cy="34" r="20" fill="#4f6bff" />
      <path d="M24 26 a10 10 0 0 1 12 -4" stroke="white" strokeOpacity="0.5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <rect x="18" y="66" width="70" height="10" rx="5" fill="#6d3fd9" transform="rotate(-48 53 71)" />
      <rect x="52" y="50" width="32" height="32" rx="6" fill="#d9661a" transform="translate(3 4)" />
      <rect x="52" y="50" width="32" height="32" rx="6" fill="#ff8a3d" />
      <rect x="56" y="54" width="10" height="5" rx="2.5" fill="white" opacity="0.45" />
    </svg>
  );
}
