// Flat, chunky illustrations for each math branch, drawn in the branch's colors
// (main + darker shadow) with a warm yellow accent, like Brilliant's topic icons.

import type { BranchColor } from "@/lib/math/schema";

const GOLD = "#f6c343";
const GOLD_DARK = "#c99212";

export function BranchArt({ id, color, className = "size-20" }: { id: string; color: BranchColor; className?: string }) {
  const m = color.main;
  const s = color.shadow;

  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      {(ART[id] ?? ART.arithmetic)(m, s)}
    </svg>
  );
}

const ART: Record<string, (m: string, s: string) => React.ReactNode> = {
  arithmetic: (m, s) => (
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

  algebra: (m, s) => (
    <>
      <rect x="45" y="22" width="6" height="56" rx="3" fill={s} />
      <path d="M30 84 H66 L60 74 H36 Z" fill={s} />
      <rect x="12" y="24" width="72" height="6" rx="3" fill={m} />
      <circle cx="48" cy="27" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <path d="M14 30 L8 50 H34 L28 30" fill="none" stroke={s} strokeWidth="2" />
      <path d="M6 50 H36 Q36 58 21 58 Q6 58 6 50 Z" fill={m} />
      <rect x="12" y="34" width="18" height="16" rx="4" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <text x="21" y="47" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="system-ui" fill="#3a2a00">
        x
      </text>
      <path d="M68 30 L62 50 H88 L82 30" fill="none" stroke={s} strokeWidth="2" />
      <path d="M60 50 H90 Q90 58 75 58 Q60 58 60 50 Z" fill={m} />
      <circle cx="69" cy="44" r="6" fill="white" stroke={s} strokeWidth="2" />
      <circle cx="81" cy="44" r="6" fill="white" stroke={s} strokeWidth="2" />
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

  trigonometry: (m, s) => (
    <>
      {/* right triangle with an angle arc */}
      <path d="M10 82 H70 V30 Z" fill={s} transform="translate(3 3)" />
      <path d="M10 82 H70 V30 Z" fill={m} strokeLinejoin="round" />
      <path d="M62 82 v-8 h8" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2.5" />
      <path d="M30 82 A20 20 0 0 0 27 70" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
      {/* sine wave */}
      <path d="M8 22 Q20 2 32 22 T56 22 T80 22" fill="none" stroke={GOLD_DARK} strokeWidth="5" strokeLinecap="round" transform="translate(1 2)" />
      <path d="M8 22 Q20 2 32 22 T56 22 T80 22" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  calculus: (m, s) => (
    <>
      {/* area under a curve */}
      <path d="M14 84 V60 Q34 20 54 40 T86 26 V84 Z" fill={s} transform="translate(3 3)" />
      <path d="M14 84 V60 Q34 20 54 40 T86 26 V84 Z" fill={m} />
      {[26, 38, 50, 62, 74].map((x) => (
        <line key={x} x1={x} y1="84" x2={x} y2="46" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
      ))}
      <path d="M14 60 Q34 20 54 40 T86 26" fill="none" stroke="white" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
      {/* tangent line */}
      <path d="M30 58 L78 22" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
      <circle cx="54" cy="40" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2.5" />
    </>
  ),

  statistics: (m, s) => (
    <>
      {[
        { x: 12, h: 30 },
        { x: 32, h: 52 },
        { x: 52, h: 66 },
        { x: 72, h: 40 },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x + 3} y={86 - b.h + 3} width="15" height={b.h} rx="4" fill={s} />
          <rect x={b.x} y={86 - b.h} width="15" height={b.h} rx="4" fill={i === 2 ? GOLD : m} />
          <rect x={b.x + 3} y={86 - b.h + 4} width="4" height={Math.min(14, b.h - 8)} rx="2" fill="white" opacity="0.35" />
        </g>
      ))}
      <path d="M14 46 Q40 18 60 16 T88 36" fill="none" stroke={s} strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />
    </>
  ),

  probability: (m, s) => {
    const pips = (cx: number, cy: number, points: number[][], fill: string) =>
      points.map(([dx, dy]) => <circle key={`${cx}-${dx}-${dy}`} cx={cx + dx} cy={cy + dy} r="3.6" fill={fill} />);
    return (
      <>
        <g transform="rotate(-14 32 56)">
          <rect x="10" y="34" width="44" height="44" rx="10" fill={s} transform="translate(3 4)" />
          <rect x="10" y="34" width="44" height="44" rx="10" fill={m} />
          {pips(32, 56, [[-11, -11], [11, -11], [0, 0], [-11, 11], [11, 11]], "white")}
        </g>
        <g transform="rotate(12 66 34)">
          <rect x="46" y="14" width="38" height="38" rx="9" fill={GOLD_DARK} transform="translate(2 3)" />
          <rect x="46" y="14" width="38" height="38" rx="9" fill={GOLD} />
          {pips(65, 33, [[-9, -9], [0, 0], [9, 9]], "#3a2a00")}
        </g>
      </>
    );
  },

  "linear-algebra": (m, s) => (
    <>
      {/* grid with two vectors */}
      {[24, 40, 56, 72].map((v) => (
        <g key={v} stroke={s} strokeOpacity="0.35" strokeWidth="2">
          <line x1={v} y1="12" x2={v} y2="84" />
          <line x1="12" y1={v} x2="84" y2={v} />
        </g>
      ))}
      <path d="M16 80 L66 30" stroke={s} strokeWidth="7" strokeLinecap="round" transform="translate(2 3)" />
      <path d="M16 80 L66 30" stroke={m} strokeWidth="7" strokeLinecap="round" />
      <path d="M72 24 L52 30 L66 44 Z" fill={m} />
      <path d="M16 80 L70 70" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
      <path d="M80 68 L64 60 L66 78 Z" fill={GOLD} />
      <circle cx="16" cy="80" r="6" fill={s} />
    </>
  ),

  "number-theory": (m, s) => (
    <>
      {/* prime blocks: 2, 3, 5 */}
      {[
        { x: 10, n: 2 },
        { x: 34, n: 3 },
        { x: 58, n: 5 },
      ].map((col, c) =>
        Array.from({ length: col.n }, (_, i) => (
          <g key={`${c}-${i}`}>
            <rect x={col.x + 2} y={74 - i * 13 + 2} width="22" height="11" rx="3" fill={c === 1 ? GOLD_DARK : s} />
            <rect x={col.x} y={74 - i * 13} width="22" height="11" rx="3" fill={c === 1 ? GOLD : m} />
          </g>
        )),
      )}
      <text x="20" y="40" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="system-ui" fill={s}>
        #
      </text>
    </>
  ),

  discrete: (m, s) => {
    const nodes = [
      [20, 24],
      [70, 18],
      [48, 50],
      [18, 76],
      [78, 74],
    ];
    const edges = [
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 4],
    ];
    return (
      <>
        {edges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={s} strokeWidth="4" strokeLinecap="round" />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x + 2} cy={y + 3} r="10" fill={i === 2 ? GOLD_DARK : s} />
            <circle cx={x} cy={y} r="10" fill={i === 2 ? GOLD : m} />
            <circle cx={x - 3} cy={y - 3} r="3" fill="white" opacity="0.45" />
          </g>
        ))}
      </>
    );
  },

  analysis: (m, s) => (
    <>
      {/* a sequence closing in on a limit */}
      <line x1="10" y1="40" x2="88" y2="40" stroke={GOLD} strokeWidth="4" strokeDasharray="6 5" strokeLinecap="round" />
      {[
        [14, 78],
        [28, 18],
        [40, 62],
        [52, 28],
        [62, 50],
        [71, 35],
        [79, 44],
        [86, 39],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x + 1.5} cy={y + 2} r={7 - i * 0.5} fill={s} />
          <circle cx={x} cy={y} r={7 - i * 0.5} fill={m} />
        </g>
      ))}
      <text x="12" y="30" fontSize="16" fontWeight="800" fontFamily="system-ui" fill={GOLD_DARK}>
        ε
      </text>
    </>
  ),

  "abstract-algebra": (m, s) => (
    <>
      {/* a hexagon and its rotation symmetry */}
      <path d="M48 14 L76 30 V62 L48 78 L20 62 V30 Z" fill={s} transform="translate(3 4)" />
      <path d="M48 14 L76 30 V62 L48 78 L20 62 V30 Z" fill={m} />
      <path d="M48 14 V78 M20 30 L76 62 M76 30 L20 62" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
      <circle cx="48" cy="46" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <path d="M84 40 A36 36 0 0 1 66 84" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 84 L68 90 L70 78 Z" fill={GOLD} />
    </>
  ),

  logic: (m, s) => (
    <>
      <path d="M14 34 h14 a8 8 0 1 1 16 0 h14 v14 a8 8 0 1 1 0 16 v14 h-44 z" fill={s} transform="translate(3 4)" />
      <path d="M14 34 h14 a8 8 0 1 1 16 0 h14 v14 a8 8 0 1 1 0 16 v14 h-44 z" fill={m} />
      <path d="M20 40 h6" stroke="white" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
      <circle cx="74" cy="22" r="13" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2.5" />
      <rect x="68" y="34" width="12" height="7" rx="2" fill={GOLD_DARK} />
      <path d="M74 4 v-2 M88 10 l2 -2 M60 10 l-2 -2 M92 22 h2 M54 22 h2" stroke={GOLD_DARK} strokeWidth="3" strokeLinecap="round" />
      <path d="M69 20 a6 6 0 0 1 6 -5" stroke="white" strokeOpacity="0.7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),

  "set-theory": (m, s) => (
    <>
      <circle cx="36" cy="50" r="26" fill={s} transform="translate(3 4)" />
      <circle cx="36" cy="50" r="26" fill={m} />
      <circle cx="62" cy="50" r="26" fill={GOLD} fillOpacity="0.85" />
      <path d="M49 27.5 A26 26 0 0 1 49 72.5 A26 26 0 0 1 49 27.5 Z" fill={s} />
      <circle cx="26" cy="40" r="5" fill="white" opacity="0.4" />
    </>
  ),

  topology: (m, s) => (
    <>
      {/* a doughnut (torus) */}
      <ellipse cx="50" cy="54" rx="38" ry="24" fill={s} />
      <ellipse cx="48" cy="50" rx="38" ry="24" fill={m} />
      <ellipse cx="48" cy="48" rx="15" ry="6" fill={s} />
      <path d="M33 47 Q48 58 63 47" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 40 Q26 30 40 29" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="3.5" strokeLinecap="round" />
      {[
        [24, 58, GOLD],
        [70, 60, "#ff7a7a"],
        [76, 40, GOLD],
        [56, 66, "#ffffff"],
      ].map(([x, y, c], i) => (
        <rect key={i} x={Number(x)} y={Number(y)} width="5" height="2.6" rx="1.3" fill={String(c)} transform={`rotate(${i * 40} ${x} ${y})`} />
      ))}
    </>
  ),
};
