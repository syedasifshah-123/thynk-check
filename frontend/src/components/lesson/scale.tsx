// Kitchen-scale illustration: shapes stacked on the platform, reading on the display.
// Fixed colors (it's an illustration), so it reads the same in light and dark themes.

export type ScaleItem = { kind: "triangle" | "square" | "circle" | "weight"; label?: string };

export function Scale({ stacks, reading }: { stacks: ScaleItem[][]; reading: string }) {
  return (
    <div className="flex select-none flex-col items-center" aria-hidden="true">
      {/* Items: each stack is a column, bottom item first */}
      <div className="flex items-end justify-center gap-1">
        {stacks.map((stack, i) => (
          <div key={i} className="flex flex-col-reverse items-center gap-0.5">
            {stack.map((item, j) => (
              <Shape key={j} {...item} />
            ))}
          </div>
        ))}
      </div>

      {/* Platform */}
      <div className="relative h-3 w-[min(270px,72vw)] rounded-[3px] bg-[#c4c4c4]">
        <span className="absolute left-[20%] top-0 h-full w-6 bg-[#e0e0e0]" />
      </div>

      {/* Body + display */}
      <div className="mt-2 w-[min(250px,66vw)] rounded-lg bg-[#4b4b4b] p-2.5 [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)]">
        <div className="rounded bg-[#f3f3f3] px-5 py-2.5">
          <div className="rounded bg-[#b9b9b9] py-1 text-center font-mono text-2xl tracking-wide text-[#111] sm:text-[1.7rem]">{reading}</div>
        </div>
      </div>
      <div className="h-4 w-14 -translate-x-[60%] bg-[#383838]" />
    </div>
  );
}

function Shape({ kind, label }: ScaleItem) {
  if (kind === "triangle") {
    return (
      <svg viewBox="0 0 50 44" className="h-11 w-[50px]">
        <path d="M25 4 L46 40 H4 Z" fill="#f6c343" stroke="#c99212" strokeWidth="3" strokeLinejoin="round" />
        <path d="M25 11 L39 35 H11 Z" fill="#ffd970" opacity="0.55" />
        {label && (
          <text x="25" y="34" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#3a2a00">
            {label}
          </text>
        )}
      </svg>
    );
  }
  if (kind === "square") {
    return (
      <div className="relative grid size-11 place-items-center rounded-[6px] border-b-4 border-r-2 border-[#4363d8] bg-[#6d8cff] font-mono text-sm text-white">
        <span className="absolute left-1 top-1 size-2 border-l-2 border-t-2 border-white/80" />
        {label}
      </div>
    );
  }
  if (kind === "circle") {
    return (
      <div className="grid size-11 place-items-center rounded-full border-2 border-b-4 border-[#2f9e8f] bg-[#5ccbbb] font-mono text-sm text-[#0b2e29]">
        {label}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 64 56" className="h-12 w-16">
      <path d="M22 14 Q22 4 32 4 Q42 4 42 14" fill="none" stroke="#5a5a5a" strokeWidth="4" />
      <path d="M14 14 H50 L58 52 H6 Z" fill="#b5b5b5" stroke="#7d7d7d" strokeWidth="3" strokeLinejoin="round" />
      <text x="32" y="40" textAnchor="middle" fontSize="16" fontFamily="monospace" fill="#111">
        {label}
      </text>
    </svg>
  );
}
