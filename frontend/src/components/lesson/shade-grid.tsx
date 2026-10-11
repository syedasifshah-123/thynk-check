"use client";

import { playShade } from "@/lib/sounds";
import type { ShadeQuestion } from "./types";

export type ShadeMark = "right" | "wrong" | null;

// Tap squares to shade them (Brilliant's "color ½ of the shape"). A live counter shows how many are shaded.
export function ShadeGrid({
  question,
  shaded,
  onChange,
  mark,
  locked,
}: {
  question: ShadeQuestion;
  shaded: boolean[];
  onChange: (next: boolean[]) => void;
  mark: ShadeMark;
  locked: boolean;
}) {
  const count = shaded.filter(Boolean).length;

  function toggle(i: number) {
    const next = shaded.slice();
    next[i] = !next[i];
    onChange(next);
    playShade(next.filter(Boolean).length, next[i]);
  }

  const fill =
    mark === "right"
      ? "bg-primary border-[var(--primary-shadow)]"
      : mark === "wrong"
        ? "bg-amber-400 border-amber-500"
        : "bg-[var(--accent)] border-[var(--accent-shadow)]";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="grid w-full max-w-[420px] gap-1.5 rounded-2xl border-2 border-border bg-surface p-2.5 shadow-[0_3px_0_var(--border)] sm:gap-2 sm:p-3"
        style={{ gridTemplateColumns: `repeat(${question.cols}, minmax(0, 1fr))` }}
      >
        {shaded.map((on, i) => (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => toggle(i)}
            aria-pressed={on}
            aria-label={`Square ${i + 1}`}
            className={`aspect-square rounded-lg border-2 transition-[background-color,border-color,transform] duration-150 enabled:active:scale-95 ${
              on ? `${fill} shade-pop` : "border-border-strong bg-background enabled:hover:border-[var(--accent)]"
            }`}
          />
        ))}
      </div>
      <p className="font-cofo text-sm font-bold text-muted">
        Shaded: <span className="tabular-nums text-foreground">{count}</span> of {question.rows * question.cols}
        {count > 0 && !locked && (
          <button type="button" onClick={() => onChange(shaded.map(() => false))} className="ml-3 text-muted underline-offset-2 hover:text-foreground hover:underline">
            Start over
          </button>
        )}
      </p>
    </div>
  );
}
