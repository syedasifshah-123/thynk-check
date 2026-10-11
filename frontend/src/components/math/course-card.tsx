"use client";

import Link from "next/link";
import { toast } from "@/components/toast/toast-store";
import { BRANCHES, findBranch, totalLevels } from "@/lib/math/curriculum";
import type { Branch } from "@/lib/math/schema";
import { branchStatus, hasContent, type MathProgressData } from "@/lib/math/session";
import { BranchArt } from "./branch-art";

type TileState = "open" | "done" | "locked" | "soon";

export type BranchSummary = { state: TileState; written: number; passed: number; lockedBy?: string };

/** What a branch tile shows: open / done / locked, plus how much content exists and how much is passed. */
export function summariseBranch(branch: Branch, data: MathProgressData): BranchSummary {
  const status = branchStatus(branch, BRANCHES, data);
  const written = branch.levels.filter(hasContent).length;
  const passed = branch.levels.filter((l) => hasContent(l) && data.levels[l.id]?.passed).length;
  const pre = branch.prerequisite;
  const lockedBy = pre ? `${findBranch(pre.branchId)?.title ?? pre.branchId} Level ${pre.level}` : undefined;
  const state: TileState = status === "locked" ? "locked" : status === "completed" ? "done" : written === 0 ? "soon" : "open";
  return { state, written, passed, lockedBy };
}

// "Your topics" style course block: course header + numbered branch tiles, either as a
// connected scrolling row (home) or a wrapping grid (/math).
export function MathCourseCard({ data, layout = "row" }: { data: MathProgressData; layout?: "row" | "grid" }) {
  const summaries = BRANCHES.map((b) => summariseBranch(b, data));
  const written = BRANCHES.reduce((sum, b) => sum + b.levels.filter(hasContent).length, 0);

  return (
    <section aria-labelledby="math-course" className="min-w-0">
      <div className="flex items-center gap-4 sm:gap-6">
        <CourseIcon />
        <div className="min-w-0">
          <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-muted sm:text-xs">
            {BRANCHES.length} branches · {totalLevels()} levels
          </p>
          <h2 id="math-course" className="mt-0.5 font-cofo text-xl font-bold sm:text-2xl">
            Mathematics
          </h2>
          <p className="mt-1 text-sm text-muted sm:text-base">
            From arithmetic to topology. {written} level{written === 1 ? "" : "s"} ready to play, more on the way.
          </p>
        </div>
      </div>

      <div className="relative mt-5 rounded-[24px] bg-foreground/[0.04] sm:mt-6 sm:rounded-[28px]">
        {layout === "grid" ? (
          <ol className="grid grid-cols-2 gap-x-3 gap-y-5 p-4 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 sm:p-6 lg:grid-cols-5">
            {BRANCHES.map((branch, i) => (
              <li key={branch.id} className="min-w-0">
                <BranchTile branch={branch} summary={summaries[i]} fluid />
              </li>
            ))}
          </ol>
        ) : (
          /* right-edge fade hints that the row scrolls */
          <ol className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto px-4 py-5 [mask-image:linear-gradient(to_right,black_88%,transparent)] sm:px-6 sm:py-7">
            {BRANCHES.map((branch, i) => (
              <li key={branch.id} className="flex shrink-0 snap-start items-start">
                <BranchTile branch={branch} summary={summaries[i]} />
                {i < BRANCHES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`mt-[60px] h-0.5 w-4 shrink-0 sm:mt-[78px] sm:w-6 ${summaries[i + 1].state === "locked" ? "bg-border" : "bg-border-strong"}`}
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
function BranchTile({ branch, summary, fluid = false }: { branch: Branch; summary: BranchSummary; fluid?: boolean }) {
  const { state } = summary;
  const accent = { "--accent": branch.color.main, "--accent-shadow": branch.color.shadow } as React.CSSProperties;

  const tile = (
    <>
      <span
        className={`relative flex flex-col rounded-[20px] border-2 bg-surface p-2.5 transition-[transform,border-color] sm:rounded-[24px] sm:p-3 ${
          fluid ? "aspect-square w-full" : "h-[120px] w-[120px] sm:h-[156px] sm:w-[156px]"
        } ${
          state === "open"
            ? "border-[var(--accent)] shadow-[0_4px_0_var(--accent-shadow)] group-hover:-translate-y-0.5"
            : state === "locked"
              ? "border-border shadow-[0_4px_0_var(--border)]"
              : "border-border shadow-[0_4px_0_var(--border)] group-hover:-translate-y-0.5"
        }`}
      >
        <span className="flex items-center justify-between gap-1">
          <span className="truncate font-cofo text-[10px] font-bold text-muted sm:text-xs">{branch.levels.length} levels</span>
          <TileBadge state={state} />
        </span>
        <span className={`grid flex-1 place-items-center ${state === "locked" || state === "soon" ? "opacity-45 grayscale" : ""}`}>
          <BranchArt id={branch.id} color={branch.color} className={fluid ? "h-auto w-[58%]" : "size-14 sm:size-20"} />
        </span>
        {summary.written > 0 && state !== "locked" && (
          <span className="h-1.5 overflow-hidden rounded-full bg-border" title={`${summary.passed}/${summary.written} playable levels passed`}>
            <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${(summary.passed / summary.written) * 100}%` }} />
          </span>
        )}
      </span>
      <span className={`mt-2.5 text-center ${fluid ? "w-full" : "w-[120px] sm:w-[156px]"}`}>
        <span className="block font-cofo text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">Branch {branch.number}</span>
        <span className={`block font-cofo text-sm font-bold leading-tight sm:text-[15px] ${state === "locked" ? "text-muted" : ""}`}>{branch.title}</span>
        {fluid && <span className="mt-0.5 block text-[11px] leading-tight text-muted sm:text-xs">{branch.subtitle}</span>}
      </span>
    </>
  );

  if (state !== "locked") {
    return (
      <Link href={`/math/${branch.id}`} className="group flex w-full flex-col items-center" style={accent}>
        {tile}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => toast.warning(`Pass ${summary.lockedBy} to unlock ${branch.title}.`)}
      aria-disabled="true"
      aria-label={`${branch.title} (locked)`}
      className="flex w-full cursor-not-allowed flex-col items-center"
      style={accent}
    >
      {tile}
    </button>
  );
}

function TileBadge({ state }: { state: TileState }) {
  if (state === "done") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white sm:size-6" aria-label="Completed">
        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (state === "locked") {
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-border text-muted sm:size-6" aria-label="Locked">
        <svg className="size-3 sm:size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
    );
  }
  if (state === "soon") {
    return <span className="shrink-0 rounded-full bg-border px-1.5 py-0.5 font-cofo text-[9px] font-bold uppercase text-muted sm:text-[10px]">Soon</span>;
  }
  return <span className="shrink-0 rounded-full bg-[var(--accent)] px-1.5 py-0.5 font-cofo text-[9px] font-bold uppercase text-white sm:text-[10px]">Go</span>;
}

/** Course icon: a few overlapping shapes in branch colors. */
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
