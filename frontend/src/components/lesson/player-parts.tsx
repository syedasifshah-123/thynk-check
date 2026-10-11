"use client";

// Shared building blocks of the level player: option buttons, the bottom action bar, confetti, stats.

import { Mascot, type MascotMood } from "@/components/mascot";

export type ItemStatus = "idle" | "correct" | "wrong" | "revealed";

type OptionState = "idle" | "selected" | "correct" | "wrong" | "ruled-out";

export function OptionButton({ label, state, disabled, onClick }: { label: string; state: OptionState; disabled: boolean; onClick: () => void }) {
  const styles: Record<OptionState, string> = {
    idle: "border-border bg-surface hover:border-border-strong shadow-[0_3px_0_var(--border)]",
    selected:
      "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)] shadow-[0_3px_0_var(--accent-shadow)]",
    correct: "border-primary bg-primary/10 text-primary shadow-[0_3px_0_var(--primary-shadow)]",
    wrong: "border-amber-400 bg-amber-400/10 text-amber-500 shadow-[0_3px_0_#d97706]",
    "ruled-out": "border-border bg-surface text-muted opacity-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={`relative min-h-12 rounded-2xl border-2 px-3 py-2 font-cofo text-base font-bold leading-tight transition-[colors,transform] active:translate-y-0.5 disabled:cursor-default disabled:active:translate-y-0 sm:min-h-[68px] sm:text-xl ${styles[state]}`}
    >
      {label}
      {(state === "correct" || state === "wrong" || state === "ruled-out") && (
        <span
          className={`badge-pop absolute -right-2 -top-2 grid size-6 place-items-center rounded-md text-white ${
            state === "correct" ? "bg-primary" : state === "wrong" ? "bg-amber-400" : "bg-border-strong"
          }`}
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {state === "correct" ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M7 7l10 10M17 7L7 17" />}
          </svg>
        </span>
      )}
    </button>
  );
}

export function optionState(i: number, choice: number | null, status: ItemStatus, ruledOut: number[], correct: number): OptionState {
  if (status === "correct" && choice === i) return "correct";
  if (status === "revealed" && i === correct) return "correct";
  if ((status === "wrong" || status === "revealed") && choice === i) return "wrong";
  if (ruledOut.includes(i)) return "ruled-out";
  return choice === i ? "selected" : "idle";
}

/** Mobile: a sheet fixed to the bottom. Desktop: a plain row inside the card. */
export function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 rounded-t-[28px] border-t border-border bg-background px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5 md:static md:rounded-none md:border-0 md:bg-transparent md:px-8 md:pb-6 md:pt-2">
      <div className="mx-auto flex w-full max-w-[460px] gap-2.5 md:gap-3">{children}</div>
    </div>
  );
}

type Action = { label: string; onClick: () => void };

export function BottomBar({
  status,
  ready,
  headline,
  gainedLabel,
  mood,
  reaction,
  primaryLabel,
  onPrimary,
  secondary,
}: {
  status: ItemStatus;
  ready: boolean;
  headline: string;
  gainedLabel?: string;
  mood: MascotMood;
  reaction: number;
  primaryLabel: string;
  onPrimary: () => void;
  secondary: Action | null;
}) {
  const good = status === "correct";
  const bad = status === "wrong" || status === "revealed";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 rounded-t-[28px] px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5 transition-colors duration-300 md:static md:rounded-none md:border-0 md:bg-transparent md:px-8 md:pb-6 md:pt-2 ${
        good
          ? "border-t-2 border-primary bg-[color-mix(in_srgb,var(--primary)_18%,var(--background))]"
          : bad
            ? "border-t-2 border-amber-400 bg-[color-mix(in_srgb,#f5b301_18%,var(--background))]"
            : "border-t border-border bg-background"
      }`}
    >
      {/* Success gets a headline row on mobile. Wrong answers keep the sheet the same height as idle. */}
      {good && (
        <div className="question-in mb-2.5 flex items-center justify-between gap-3 md:hidden">
          <p className="font-cofo text-lg font-bold">
            {headline} {gainedLabel && <span className="ml-1 text-sm text-primary">{gainedLabel}</span>}
          </p>
          {secondary && (
            <button type="button" onClick={secondary.onClick} className="shrink-0 rounded-full bg-foreground/10 px-3.5 py-1.5 font-cofo text-sm font-bold">
              {secondary.label}
            </button>
          )}
        </div>
      )}

      <div className="relative flex items-center gap-3 md:min-h-24 md:justify-center">
        {/* Mascot (bottom-left) with a speech bubble on desktop */}
        <div className="relative shrink-0 md:absolute md:bottom-0 md:left-0">
          {status !== "idle" && (
            <div
              key={`bubble-${reaction}`}
              className={`bubble-in absolute bottom-full left-[70%] mb-1 hidden whitespace-nowrap rounded-2xl px-5 py-3 font-cofo text-lg font-bold md:block ${
                good ? "bg-primary text-primary-foreground" : "bg-amber-400 text-[#2a1f00]"
              }`}
            >
              {headline}
              {good && gainedLabel && <span className="ml-2 text-sm opacity-80">{gainedLabel}</span>}
            </div>
          )}
          {/* Sibling keys must differ: a shared key here left old bubbles stuck in the DOM */}
          <Mascot key={`mascot-${mood}-${reaction}`} mood={mood} className="size-12 md:size-20" />
          {good && <Confetti key={`confetti-${reaction}`} />}
        </div>

        <div className="flex flex-1 gap-2.5 md:w-full md:max-w-[460px] md:flex-none md:gap-3">
          {secondary && (
            <button
              type="button"
              onClick={secondary.onClick}
              className={`btn btn-secondary h-12 px-4 text-sm md:h-14 md:px-6 md:text-lg ${good ? "max-md:hidden" : ""}`}
            >
              {secondary.label}
            </button>
          )}
          <button
            type="button"
            onClick={onPrimary}
            disabled={status === "idle" && !ready}
            className={`btn h-12 flex-1 text-base disabled:cursor-not-allowed disabled:bg-border disabled:text-muted disabled:[box-shadow:none] md:h-14 md:text-lg ${
              status === "wrong" ? "btn-warning" : good || status === "revealed" ? "btn-primary" : "btn-accent"
            }`}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface px-3 py-3 shadow-[0_3px_0_var(--border)] sm:px-4 sm:py-4">
      <p className={`font-cofo text-2xl font-bold tabular-nums sm:text-3xl ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-muted sm:text-sm">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted/80 sm:text-xs">{sub}</p>}
    </div>
  );
}

// Little burst of brand-colored confetti around the mascot.
const CONFETTI_COLORS = ["#29c758", "#f6c343", "#6d8cff", "#ff7a7a", "#5ccbbb"];
const PIECES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
  const distance = 55 + (i % 3) * 18;
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance * 0.9 - 20),
    rot: (i * 47) % 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i % 4) * 30,
  };
});

export function Confetti() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={
            {
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              background: p.color,
              animationDelay: `${p.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
