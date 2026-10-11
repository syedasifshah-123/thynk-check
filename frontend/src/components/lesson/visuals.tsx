// Diagrams shown with exercises, intros and worked examples. Drawn in SVG / CSS and tinted with the
// branch accent (--accent / --accent-shadow, set by the level player), so each branch has its own look.

import type { Visual as VisualSpec } from "@/lib/math/schema";
import { Scale } from "./scale";

const fmt = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

export function Visual({ visual }: { visual: VisualSpec }) {
  switch (visual.type) {
    case "scale":
      return <Scale stacks={visual.stacks} reading={visual.reading} />;
    case "numberLine":
      return <NumberLine {...visual} />;
    case "blocks":
      return <BaseTenBlocks {...visual} />;
    case "dots":
      return <DotGroups groups={visual.groups} />;
    case "sequence":
      return <Sequence items={visual.items} />;
    case "growing":
      return <Growing counts={visual.counts} />;
    case "thermometer":
      return <Thermometer {...visual} />;
    case "fractionBars":
      return <FractionBars bars={visual.bars} />;
    case "array":
      return <DotArray rows={visual.rows} cols={visual.cols} />;
    case "percentGrid":
      return <PercentGrid shaded={visual.shaded} />;
    case "ratio":
      return <RatioStrip groups={visual.groups} />;
  }
}

/* ───────────── Number line ───────────── */

function NumberLine({ min, max, step, labels, marker }: { min: number; max: number; step: number; labels?: number[]; marker?: number }) {
  const W = 600;
  const PAD = 40;
  const Y = 78;
  const x = (v: number) => PAD + ((v - min) / (max - min)) * (W - PAD * 2);
  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const labelled = new Set(labels ?? ticks);

  return (
    <svg viewBox={`0 0 ${W} 130`} className="mx-auto w-full max-w-[560px] select-none" aria-hidden="true">
      {/* Axis with arrowheads */}
      <line x1={14} y1={Y} x2={W - 14} y2={Y} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
      <path d={`M14 ${Y} l12 -7 v14 z`} fill="var(--foreground)" />
      <path d={`M${W - 14} ${Y} l-12 -7 v14 z`} fill="var(--foreground)" />

      {ticks.map((v) => {
        const big = labelled.has(v) || v === 0;
        return (
          <g key={v}>
            <line x1={x(v)} y1={Y - (big ? 12 : 8)} x2={x(v)} y2={Y + (big ? 12 : 8)} stroke="var(--foreground)" strokeWidth={big ? 3 : 2} strokeLinecap="round" opacity={big ? 1 : 0.55} />
            {labelled.has(v) && (
              <text x={x(v)} y={Y + 38} textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--foreground)" className="font-cofo">
                {fmt(v)}
              </text>
            )}
          </g>
        );
      })}

      {marker !== undefined && (
        <g className="marker-drop">
          <circle cx={x(marker)} cy={Y} r="8" fill="var(--accent)" stroke="var(--surface)" strokeWidth="3" />
          <path
            d={`M${x(marker)} ${Y - 18} l-11 -16 h7 v-14 h8 v14 h7 z`}
            fill="var(--accent)"
            stroke="var(--accent-shadow)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/* ───────────── Base-ten blocks ───────────── */

const CELL = 7;

function Flat({ x }: { x: number }) {
  const size = CELL * 10;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={4} y={4} width={size} height={size} rx="3" fill="var(--accent-shadow)" />
      <rect width={size} height={size} rx="3" fill="var(--accent)" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} stroke="white" strokeOpacity="0.35" strokeWidth="1">
          <line x1={(i + 1) * CELL} y1={0} x2={(i + 1) * CELL} y2={size} />
          <line x1={0} y1={(i + 1) * CELL} x2={size} y2={(i + 1) * CELL} />
        </g>
      ))}
    </g>
  );
}

function Rod({ x }: { x: number }) {
  const h = CELL * 10;
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={3} y={3} width={CELL} height={h} rx="2" fill="var(--accent-shadow)" />
      <rect width={CELL} height={h} rx="2" fill="var(--accent)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={0} y1={(i + 1) * CELL} x2={CELL} y2={(i + 1) * CELL} stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      ))}
    </g>
  );
}

function BaseTenBlocks({ hundreds, tens, ones }: { hundreds: number; tens: number; ones: number }) {
  const GAP = 22;
  let cursor = 0;
  const flats = Array.from({ length: hundreds }, (_, i) => cursor + i * (CELL * 10 + 10));
  if (hundreds) cursor += hundreds * (CELL * 10 + 10) - 10 + GAP;
  const rods = Array.from({ length: tens }, (_, i) => cursor + i * (CELL + 5));
  if (tens) cursor += tens * (CELL + 5) - 5 + GAP;
  const onesX = cursor;
  const onesCols = Math.ceil(ones / 5);
  const width = onesX + (ones ? onesCols * (CELL + 4) : -GAP) + 6;

  return (
    <svg viewBox={`-6 -6 ${width + 12} ${CELL * 10 + 18}`} className="mx-auto h-auto max-h-[150px] w-auto max-w-full select-none" aria-hidden="true">
      {flats.map((fx) => (
        <Flat key={`f${fx}`} x={fx} />
      ))}
      {rods.map((rx) => (
        <Rod key={`r${rx}`} x={rx} />
      ))}
      {Array.from({ length: ones }, (_, i) => {
        const col = Math.floor(i / 5);
        const row = 4 - (i % 5);
        const ox = onesX + col * (CELL + 4);
        const oy = CELL * 10 - CELL - row * (CELL + 4) + 0;
        return (
          <g key={`o${i}`}>
            <rect x={ox + 2} y={oy + 2} width={CELL} height={CELL} rx="1.5" fill="var(--accent-shadow)" />
            <rect x={ox} y={oy} width={CELL} height={CELL} rx="1.5" fill="var(--accent)" />
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── Dots ───────────── */

function DotGrid({ count, label }: { count: number; label?: string }) {
  const cols = 5;
  const rows = Math.max(1, Math.ceil(count / cols));
  const R = 13;
  const S = 36;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-2xl border-2 border-border bg-surface p-3 shadow-[0_3px_0_var(--border)]">
        <svg viewBox={`0 0 ${cols * S} ${rows * S}`} width={cols * S} height={rows * S} className="max-w-full" aria-hidden="true">
          {Array.from({ length: rows * cols }, (_, i) => {
            const cx = (i % cols) * S + S / 2;
            const cy = Math.floor(i / cols) * S + S / 2;
            return i < count ? (
              <g key={i} className="dot-pop" style={{ animationDelay: `${i * 30}ms` }}>
                <circle cx={cx} cy={cy + 2} r={R} fill="var(--accent-shadow)" />
                <circle cx={cx} cy={cy} r={R} fill="var(--accent)" />
                <circle cx={cx - 4} cy={cy - 4} r={3.5} fill="white" opacity="0.45" />
              </g>
            ) : (
              <circle key={i} cx={cx} cy={cy} r={R - 1} fill="none" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="4 4" />
            );
          })}
        </svg>
      </div>
      {label && <span className="font-cofo text-sm font-bold text-muted">{label}</span>}
    </div>
  );
}

function DotGroups({ groups }: { groups: number[] }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-8">
      {groups.map((count, i) => (
        <DotGrid key={i} count={count} label={groups.length > 1 ? `Group ${String.fromCharCode(65 + i)}` : undefined} />
      ))}
    </div>
  );
}

/* ───────────── Sequence ───────────── */

function Sequence({ items }: { items: (number | null)[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          {item === null ? (
            <span className="grid h-14 min-w-14 place-items-center rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 font-cofo text-2xl font-bold text-[var(--accent)] sm:h-16 sm:min-w-16 sm:text-3xl">
              ?
            </span>
          ) : (
            <span className="grid h-14 min-w-14 place-items-center rounded-2xl border-2 border-border bg-surface px-3 font-cofo text-2xl font-bold shadow-[0_3px_0_var(--border)] sm:h-16 sm:min-w-16 sm:text-3xl">
              {fmt(item)}
            </span>
          )}
          {i < items.length - 1 && (
            <svg className="size-4 text-muted sm:size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────── Growing triangle patterns ───────────── */

function Triangle({ count }: { count: number }) {
  // Rows 1, 2, 3… until we've placed `count` dots.
  const rows: number[] = [];
  for (let n = 1, left = count; left > 0; n++) {
    rows.push(Math.min(n, left));
    left -= n;
  }
  const S = 22;
  const width = rows.length * S;
  return (
    <svg viewBox={`0 0 ${Math.max(width, S)} ${rows.length * S}`} width={Math.max(width, S)} height={rows.length * S} aria-hidden="true">
      {rows.map((n, r) =>
        Array.from({ length: n }, (_, c) => {
          const cx = (width - n * S) / 2 + c * S + S / 2;
          const cy = r * S + S / 2;
          return (
            <g key={`${r}-${c}`}>
              <circle cx={cx} cy={cy + 1.5} r={8} fill="var(--accent-shadow)" />
              <circle cx={cx} cy={cy} r={8} fill="var(--accent)" />
            </g>
          );
        }),
      )}
    </svg>
  );
}

function Growing({ counts }: { counts: number[] }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
      {counts.map((count, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="grid min-h-[110px] min-w-[96px] place-items-center rounded-2xl border-2 border-border bg-surface p-3 shadow-[0_3px_0_var(--border)]">
            <Triangle count={count} />
          </div>
          <span className="font-cofo text-sm font-bold text-muted">Shape {i + 1}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2">
        <div className="grid min-h-[110px] min-w-[96px] place-items-center rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] font-cofo text-4xl font-bold text-[var(--accent)]">
          ?
        </div>
        <span className="font-cofo text-sm font-bold text-muted">Shape {counts.length + 1}</span>
      </div>
    </div>
  );
}

/* ───────────── Thermometer ───────────── */

function Thermometer({ value, min, max }: { value: number; min: number; max: number }) {
  const TOP = 16;
  const BOTTOM = 236;
  const y = (v: number) => BOTTOM - ((v - min) / (max - min)) * (BOTTOM - TOP);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <svg viewBox="0 0 170 300" className="mx-auto h-[240px] w-auto select-none sm:h-[280px]" aria-hidden="true">
      {/* Tube + bulb */}
      <rect x={58} y={TOP - 10} width={30} height={BOTTOM - TOP + 30} rx={15} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="3" />
      <circle cx={73} cy={262} r={26} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="3" />
      {/* Liquid */}
      <rect x={66} y={y(value)} width={14} height={BOTTOM - y(value) + 20} rx={7} fill="#ef4444" className="liquid-rise" />
      <circle cx={73} cy={262} r={19} fill="#ef4444" />
      <circle cx={66} cy={255} r={5} fill="white" opacity="0.4" />

      {ticks.map((v) => {
        const major = v % 5 === 0;
        return (
          <g key={v}>
            <line x1={96} y1={y(v)} x2={major ? 114 : 106} y2={y(v)} stroke="var(--foreground)" strokeWidth={major ? 2.5 : 1.5} opacity={major ? 1 : 0.5} strokeLinecap="round" />
            {major && (
              <text x={120} y={y(v) + 6} fontSize="16" fontWeight="700" fill="var(--foreground)" className="font-cofo">
                {fmt(v)}°
              </text>
            )}
          </g>
        );
      })}
      {/* Zero line across the tube */}
      <line x1={50} y1={y(0)} x2={58} y2={y(0)} stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ───────────── Fraction bars ───────────── */

function FractionBars({ bars }: { bars: { parts: number; shaded: number; label?: string }[] }) {
  const labelled = bars.some((b) => b.label);
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3">
      {bars.map((bar, i) => (
        <div key={i} className="flex items-center gap-3">
          {labelled && <span className="w-12 shrink-0 text-right font-cofo text-base font-bold sm:text-lg">{bar.label}</span>}
          <div className="flex h-11 flex-1 overflow-hidden rounded-xl border-2 border-foreground/70 shadow-[0_3px_0_var(--border-strong)] sm:h-12">
            {Array.from({ length: bar.parts }, (_, j) => (
              <span
                key={j}
                className={`flex-1 ${j > 0 ? "border-l-2 border-foreground/70" : ""} ${j < bar.shaded ? "bg-[var(--accent)]" : "bg-surface"}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────── Array of dots (rows × columns) ───────────── */

function DotArray({ rows, cols }: { rows: number; cols: number }) {
  const S = 34;
  const R = 11;
  return (
    <div className="mx-auto w-fit max-w-full rounded-2xl border-2 border-border bg-surface p-3 shadow-[0_3px_0_var(--border)]">
      <svg viewBox={`0 0 ${cols * S} ${rows * S}`} width={cols * S} height={rows * S} className="h-auto max-w-full" aria-hidden="true">
        {Array.from({ length: rows * cols }, (_, i) => {
          const cx = (i % cols) * S + S / 2;
          const cy = Math.floor(i / cols) * S + S / 2;
          return (
            <g key={i} className="dot-pop" style={{ animationDelay: `${i * 20}ms` }}>
              <circle cx={cx} cy={cy + 2} r={R} fill="var(--accent-shadow)" />
              <circle cx={cx} cy={cy} r={R} fill="var(--accent)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ───────────── Hundred grid ───────────── */

function PercentGrid({ shaded }: { shaded: number }) {
  const S = 22;
  return (
    <div className="mx-auto w-fit rounded-2xl border-2 border-border bg-surface p-3 shadow-[0_3px_0_var(--border)]">
      <svg viewBox={`0 0 ${10 * S} ${10 * S}`} className="size-[200px] sm:size-[230px]" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => (
          <rect
            key={i}
            x={(i % 10) * S + 1.5}
            y={Math.floor(i / 10) * S + 1.5}
            width={S - 3}
            height={S - 3}
            rx="3"
            fill={i < shaded ? "var(--accent)" : "var(--background)"}
            stroke={i < shaded ? "var(--accent-shadow)" : "var(--border-strong)"}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}

/* ───────────── Ratio counters ───────────── */

function RatioStrip({ groups }: { groups: { label: string; count: number; color: string }[] }) {
  return (
    <div className="mx-auto flex w-fit max-w-full flex-col gap-2.5 rounded-2xl border-2 border-border bg-surface p-4 shadow-[0_3px_0_var(--border)]">
      {groups.map((group) => (
        <div key={group.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 font-cofo text-sm font-bold text-muted sm:text-base">{group.label}</span>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: group.count }, (_, i) => (
              <span
                key={i}
                className="dot-pop size-7 rounded-full sm:size-8"
                style={{ background: group.color, boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.22)", animationDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
