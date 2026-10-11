// Flat, chunky illustrations for each math section, drawn in the section's colors
// (main + darker shadow) with a warm yellow accent, like Brilliant's topic icons.

import type { SectionColor } from "@/lib/math/curriculum";

const GOLD = "#f6c343";
const GOLD_DARK = "#c99212";

export function SectionArt({ id, color, className = "size-20" }: { id: string; color: SectionColor; className?: string }) {
  const m = color.main;
  const s = color.shadow;

  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      {ART[id]?.(m, s) ?? ART["number-sense"](m, s)}
    </svg>
  );
}

const ART: Record<string, (m: string, s: string) => React.ReactNode> = {
  "number-sense": (m, s) => (
    <>
      {[
        { x: 10, y: 46, n: "1", c: GOLD, d: GOLD_DARK },
        { x: 36, y: 30, n: "2", c: m, d: s },
        { x: 62, y: 14, n: "3", c: m, d: s },
      ].map((t) => (
        <g key={t.n}>
          <rect x={t.x + 3} y={t.y + 4} width="26" height="26" rx="6" fill={t.d} />
          <rect x={t.x} y={t.y} width="26" height="26" rx="6" fill={t.c} />
          <rect x={t.x + 3} y={t.y + 3} width="8" height="4" rx="2" fill="white" opacity="0.4" />
          <text x={t.x + 13} y={t.y + 19} textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="system-ui" fill="white">
            {t.n}
          </text>
        </g>
      ))}
      <path d="M14 84 H84" stroke={s} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </>
  ),

  fractions: (m, s) => (
    <>
      {/* three-quarter pie, with its shadow */}
      <path d="M44 48 L44 16 A32 32 0 1 1 12 48 Z" fill={s} transform="translate(3 4)" />
      <path d="M44 48 L44 16 A32 32 0 1 1 12 48 Z" fill={m} stroke="white" strokeOpacity="0.35" strokeWidth="2" />
      {/* lifted slice */}
      <path d="M54 40 L54 10 A30 30 0 0 1 84 40 Z" fill={GOLD_DARK} transform="translate(2 3)" />
      <path d="M54 40 L54 10 A30 30 0 0 1 84 40 Z" fill={GOLD} />
      <path d="M60 18 A22 22 0 0 1 74 30" stroke="white" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),

  algebra: (m, s) => (
    <>
      <rect x="45" y="22" width="6" height="56" rx="3" fill={s} />
      <path d="M30 84 H66 L60 74 H36 Z" fill={s} />
      <rect x="12" y="24" width="72" height="6" rx="3" fill={m} />
      <circle cx="48" cy="27" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      {/* left pan with x */}
      <path d="M14 30 L8 50 H34 L28 30" fill="none" stroke={s} strokeWidth="2" />
      <path d="M6 50 H36 Q36 58 21 58 Q6 58 6 50 Z" fill={m} />
      <rect x="12" y="34" width="18" height="16" rx="4" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <text x="21" y="47" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="system-ui" fill="#3a2a00">
        x
      </text>
      {/* right pan with weights */}
      <path d="M68 30 L62 50 H88 L82 30" fill="none" stroke={s} strokeWidth="2" />
      <path d="M60 50 H90 Q90 58 75 58 Q60 58 60 50 Z" fill={m} />
      <circle cx="69" cy="44" r="6" fill="white" stroke={s} strokeWidth="2" />
      <circle cx="81" cy="44" r="6" fill="white" stroke={s} strokeWidth="2" />
    </>
  ),

  patterns: (m, s) => (
    <>
      {[
        { x: 12, h: 22 },
        { x: 34, h: 38 },
        { x: 56, h: 56 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x + 3} y={84 - b.h + 3} width="18" height={b.h} rx="5" fill={s} />
          <rect x={b.x} y={84 - b.h} width="18" height={b.h} rx="5" fill={i === 2 ? GOLD : m} />
          <rect x={b.x + 3} y={84 - b.h + 3} width="5" height={Math.min(14, b.h - 8)} rx="2.5" fill="white" opacity="0.35" />
        </g>
      ))}
      <rect x="78" y="10" width="14" height="74" rx="5" fill="none" stroke={m} strokeWidth="3" strokeDasharray="5 5" />
      <path d="M14 18 Q40 4 70 14" fill="none" stroke={s} strokeWidth="3" strokeLinecap="round" />
      <path d="M64 8 L71 14 L62 18" fill="none" stroke={s} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  geometry: (m, s) => (
    <>
      <circle cx="66" cy="34" r="20" fill={GOLD_DARK} transform="translate(2 3)" />
      <circle cx="66" cy="34" r="20" fill={GOLD} />
      <path d="M58 22 A14 14 0 0 1 74 20" stroke="white" strokeOpacity="0.5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M12 84 L36 30 L60 84 Z" fill={s} transform="translate(3 3)" />
      <path d="M12 84 L36 30 L60 84 Z" fill={m} stroke={m} strokeWidth="2" strokeLinejoin="round" />
      <path d="M36 30 L36 84" stroke="white" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 4" />
      <rect x="62" y="60" width="24" height="24" rx="3" fill="none" stroke={m} strokeWidth="4" />
      <path d="M36 76 h6 v8" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" />
    </>
  ),

  measurement: (m, s) => (
    <>
      <g transform="rotate(-30 40 60)">
        <rect x="6" y="52" width="70" height="20" rx="4" fill={GOLD_DARK} transform="translate(2 3)" />
        <rect x="6" y="52" width="70" height="20" rx="4" fill={GOLD} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={12 + i * 7.5} y1="52" x2={12 + i * 7.5} y2={i % 2 ? 58 : 62} stroke="#3a2a00" strokeWidth="2" />
        ))}
      </g>
      <circle cx="64" cy="36" r="24" fill={s} transform="translate(2 3)" />
      <circle cx="64" cy="36" r="24" fill={m} />
      <circle cx="64" cy="36" r="18" fill="white" />
      <path d="M64 36 V24 M64 36 L72 41" stroke={s} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="64" cy="36" r="3" fill={s} />
    </>
  ),

  statistics: (m, s) => (
    <>
      {[
        { x: 54, h: 26 },
        { x: 68, h: 44 },
        { x: 82, h: 34 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={86 - b.h} width="11" height={b.h} rx="3" fill={i === 1 ? m : s} />
        </g>
      ))}
      <g transform="rotate(-12 30 46)">
        <rect x="9" y="25" width="42" height="42" rx="10" fill={s} transform="translate(3 4)" />
        <rect x="9" y="25" width="42" height="42" rx="10" fill="white" stroke={m} strokeWidth="3" />
        {[
          [20, 36],
          [40, 36],
          [30, 46],
          [20, 56],
          [40, 56],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill={m} />
        ))}
      </g>
      <circle cx="74" cy="20" r="8" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
    </>
  ),

  reasoning: (m, s) => (
    <>
      <path
        d="M14 34 h14 a8 8 0 1 1 16 0 h14 v14 a8 8 0 1 1 0 16 v14 h-44 z"
        fill={s}
        transform="translate(3 4)"
      />
      <path d="M14 34 h14 a8 8 0 1 1 16 0 h14 v14 a8 8 0 1 1 0 16 v14 h-44 z" fill={m} />
      <path d="M20 40 h6" stroke="white" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
      {/* light bulb */}
      <circle cx="74" cy="22" r="13" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2.5" />
      <rect x="68" y="34" width="12" height="7" rx="2" fill={GOLD_DARK} />
      <path d="M74 4 v-2 M88 10 l2 -2 M60 10 l-2 -2 M92 22 h2 M54 22 h2" stroke={GOLD_DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M69 20 a6 6 0 0 1 6 -5" stroke="white" strokeOpacity="0.7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
};
