"use client";

// Answer inputs for the level player. Each one is controlled: it shows a value and reports changes;
// checking the answer happens in the validator (src/lib/math/validate.ts), never in these components.

import { playDrop, playReturn, playSelect } from "@/lib/sounds";

export type Mark = "right" | "wrong" | null;

const toneBorder = (mark: Mark) =>
  mark === "right"
    ? "border-primary bg-primary/10 text-primary"
    : mark === "wrong"
      ? "border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-400"
      : "border-border-strong bg-surface focus:border-[var(--accent)] focus:shadow-[0_4px_0_var(--accent-shadow)]";

/* ───────────── Number ───────────── */

export function NumericInput({
  value,
  onChange,
  onSubmit,
  mark,
  locked,
  unit,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  mark: Mark;
  locked: boolean;
  unit?: string;
  placeholder?: string;
}) {
  // Phone number pads often have no minus key, so offer one.
  const toggleSign = () => onChange(value.trim().startsWith("-") || value.trim().startsWith("−") ? value.trim().slice(1) : `-${value.trim()}`);

  return (
    <div className="flex items-center justify-center gap-2.5">
      <button
        type="button"
        onClick={toggleSign}
        disabled={locked}
        aria-label="Make negative or positive"
        className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-border bg-surface font-cofo text-xl font-bold text-muted shadow-[0_3px_0_var(--border)] transition-transform enabled:hover:text-foreground enabled:active:translate-y-0.5 disabled:opacity-50 sm:size-16"
      >
        ±
      </button>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-label="Your answer"
        value={value}
        disabled={locked}
        placeholder={placeholder ?? "Type a number"}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={`h-14 w-full max-w-[260px] rounded-2xl border-2 px-4 text-center font-cofo text-2xl font-bold outline-none transition-[border-color,box-shadow] placeholder:text-base placeholder:font-medium placeholder:text-muted/70 disabled:opacity-100 sm:h-16 sm:text-3xl ${toneBorder(mark)}`}
      />
      {unit && <span className="shrink-0 font-cofo text-lg font-bold text-muted sm:text-xl">{unit}</span>}
    </div>
  );
}

/* ───────────── Fraction ───────────── */

export type FractionValue = { whole: string; num: string; den: string };

export function FractionInput({
  value,
  onChange,
  onSubmit,
  mark,
  locked,
  mixed,
}: {
  value: FractionValue;
  onChange: (value: FractionValue) => void;
  onSubmit: () => void;
  mark: Mark;
  locked: boolean;
  mixed?: boolean;
}) {
  const box = `h-14 w-20 rounded-2xl border-2 text-center font-cofo text-2xl font-bold outline-none transition-[border-color,box-shadow] disabled:opacity-100 sm:h-16 sm:w-24 sm:text-3xl ${toneBorder(mark)}`;
  const field = (key: keyof FractionValue, label: string) => (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      value={value[key]}
      disabled={locked}
      onChange={(e) => onChange({ ...value, [key]: e.target.value.replace(/[^\d\-−]/g, "") })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit();
        }
      }}
      className={box}
    />
  );

  return (
    <div className="flex items-center justify-center gap-3">
      {mixed && field("whole", "Whole number")}
      <div className="flex flex-col items-center gap-2">
        {field("num", "Numerator (top)")}
        <span className="h-1 w-24 rounded-full bg-foreground sm:w-28" aria-hidden="true" />
        {field("den", "Denominator (bottom)")}
      </div>
    </div>
  );
}

/* ───────────── Order ───────────── */

// Tap items in the tray to place them in order; tap a placed item to send it back.
// Everything is a button, so it works with a keyboard too.
export function OrderList({
  items,
  pool,
  order,
  onChange,
  direction,
  marks,
  locked,
}: {
  /** Item texts (in the correct order; never shown in that order). */
  items: string[];
  /** Shuffled item indices, the order the tray shows them in. */
  pool: number[];
  /** Item indices placed so far, first to last. */
  order: number[];
  onChange: (order: number[]) => void;
  direction?: string;
  /** Per placed position: right / wrong after checking. */
  marks: Mark[] | null;
  locked: boolean;
}) {
  const place = (item: number) => {
    onChange([...order, item]);
    playDrop();
  };
  const remove = (position: number) => {
    onChange(order.filter((_, i) => i !== position));
    playReturn();
  };

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6">
      <div className="w-full rounded-2xl border-2 border-border bg-surface p-3 shadow-[0_3px_0_var(--border)] sm:p-4">
        {direction && (
          <p className="mb-2.5 text-center font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted sm:text-sm">{direction}</p>
        )}
        <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {items.map((_, position) => {
            const item = order[position];
            const mark = marks?.[position] ?? null;
            return (
              <li key={position} className="flex items-center gap-2 sm:gap-2.5">
                {item === undefined ? (
                  <span className="grid h-12 min-w-14 place-items-center rounded-xl border-2 border-dashed border-border-strong px-2 font-cofo text-sm font-bold text-muted sm:h-14">
                    {position + 1}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => remove(position)}
                    aria-label={`${items[item]}, position ${position + 1}. Tap to remove.`}
                    className={`h-12 min-w-14 rounded-xl border-2 px-3 font-cofo text-lg font-bold transition-transform enabled:active:translate-y-0.5 sm:h-14 sm:text-xl ${
                      mark === "right"
                        ? "border-primary bg-primary/10 text-primary"
                        : mark === "wrong"
                          ? "border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-400"
                          : "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)] shadow-[0_3px_0_var(--accent-shadow)]"
                    }`}
                  >
                    {items[item]}
                  </button>
                )}
                {position < items.length - 1 && (
                  <svg className="size-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex min-h-[4.5rem] flex-wrap justify-center gap-2.5 rounded-2xl bg-foreground/[0.04] p-3 sm:gap-3 sm:p-4">
        {pool.map((item) =>
          order.includes(item) ? (
            <span key={item} className="h-12 min-w-14 rounded-xl border-2 border-dashed border-border sm:h-14" aria-hidden="true" />
          ) : (
            <button
              key={item}
              type="button"
              disabled={locked}
              onClick={() => place(item)}
              className="h-12 min-w-14 rounded-xl border-2 border-border-strong bg-surface px-3 font-cofo text-lg font-bold shadow-[0_3px_0_var(--border-strong)] transition-transform enabled:active:translate-y-0.5 sm:h-14 sm:text-xl"
            >
              {items[item]}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

/* ───────────── Tap on a number line ───────────── */

const roundTick = (v: number) => Math.round(v * 1e6) / 1e6;
const fmt = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

export function NumberLineTap({
  min,
  max,
  step,
  labels,
  value,
  onChange,
  mark,
  locked,
}: {
  min: number;
  max: number;
  step: number;
  labels?: number[];
  value: number | null;
  onChange: (value: number) => void;
  mark: Mark;
  locked: boolean;
}) {
  const W = 600;
  const PAD = 40;
  const Y = 70;
  const ticks: number[] = [];
  for (let i = 0; min + i * step <= max + 1e-9; i++) ticks.push(roundTick(min + i * step));
  const x = (v: number) => PAD + ((v - min) / (max - min)) * (W - PAD * 2);
  const labelled = new Set((labels ?? ticks).map(roundTick));
  const color = mark === "right" ? "var(--primary)" : mark === "wrong" ? "#f5b301" : "var(--accent)";
  const index = value === null ? -1 : ticks.findIndex((t) => Math.abs(t - value) < 1e-9);

  function pick(v: number) {
    if (locked) return;
    if (v !== value) playSelect();
    onChange(v);
  }

  return (
    <div
      role="slider"
      tabIndex={locked ? -1 : 0}
      aria-label="Number line: use the arrow keys or tap a mark"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      aria-valuetext={value === null ? "No point chosen" : undefined}
      onKeyDown={(e) => {
        if (locked) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          pick(ticks[Math.min(ticks.length - 1, index + 1)]);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          pick(ticks[Math.max(0, index === -1 ? 0 : index - 1)]);
        }
      }}
      className="rounded-2xl border-2 border-border bg-surface px-1 py-2 shadow-[0_3px_0_var(--border)] outline-none focus-visible:border-[var(--accent)]"
    >
      <svg viewBox={`0 0 ${W} 120`} className="mx-auto w-full max-w-[560px] select-none" aria-hidden="true">
        <line x1={14} y1={Y} x2={W - 14} y2={Y} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
        <path d={`M14 ${Y} l12 -7 v14 z`} fill="var(--foreground)" />
        <path d={`M${W - 14} ${Y} l-12 -7 v14 z`} fill="var(--foreground)" />

        {ticks.map((v) => {
          const big = labelled.has(v);
          const chosen = value !== null && Math.abs(v - value) < 1e-9;
          return (
            <g key={v} onClick={() => pick(v)} className={locked ? "" : "cursor-pointer"}>
              {/* generous invisible hit area */}
              <rect x={x(v) - (W - PAD * 2) / (ticks.length - 1) / 2} y={Y - 50} width={(W - PAD * 2) / (ticks.length - 1)} height={100} fill="transparent" />
              <line
                x1={x(v)}
                y1={Y - (big ? 13 : 9)}
                x2={x(v)}
                y2={Y + (big ? 13 : 9)}
                stroke="var(--foreground)"
                strokeWidth={big ? 3 : 2}
                strokeLinecap="round"
                opacity={big ? 1 : 0.6}
              />
              {big && (
                <text x={x(v)} y={Y + 40} textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--foreground)" className="font-cofo">
                  {fmt(v)}
                </text>
              )}
              {!chosen && !locked && <circle cx={x(v)} cy={Y} r="7" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />}
            </g>
          );
        })}

        {value !== null && (
          <g key={value} className="marker-drop pointer-events-none">
            <circle cx={x(value)} cy={Y} r="10" fill={color} stroke="var(--surface)" strokeWidth="3" />
            <path d={`M${x(value)} ${Y - 18} l-11 -16 h7 v-14 h8 v14 h7 z`} fill={color} strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
