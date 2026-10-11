"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Mascot, type MascotMood } from "@/components/mascot";
import { isMuted, playComplete, playCorrect, playWrong, setMuted } from "@/lib/sounds";
import { DragFill, type SlotMark } from "./drag-fill";
import { QUESTIONS, type Question } from "./questions";
import { Scale } from "./scale";

type Status = "idle" | "correct" | "wrong";

const XP_FIRST_TRY = 15;
const XP_RETRY = 5;
const CORRECT_LINES = ["Right!", "Nice one!", "You got it!", "Brain power!"];
const WRONG_LINES = ["Not quite. Try again!", "Hmm, not that one.", "Oops! Give it another go."];

const emptySlots = (q: Question) => (q.kind === "fill" ? q.answer.map(() => null) : []);

// Brilliant-style lesson: question → Check → mascot reacts (happy + chime / grumpy + bwomp) → Continue.
export function LessonPlayer({ onExitHref = "/" }: { onExitHref?: string }) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [choice, setChoice] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [slots, setSlots] = useState<(number | null)[]>(() => emptySlots(QUESTIONS[0]));
  const [slotMarks, setSlotMarks] = useState<SlotMark[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [xp, setXp] = useState(0);
  const [gained, setGained] = useState(0);
  const [streak, setStreak] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [panel, setPanel] = useState<"why" | "hint" | null>(null);
  const [finished, setFinished] = useState(false);
  const [reaction, setReaction] = useState(0);
  const [muted, setMutedState] = useState(isMuted);
  const cardRef = useRef<HTMLDivElement>(null);

  const q = QUESTIONS[index];
  const ready = q.kind === "choice" ? choice !== null : slots.every((s) => s !== null);
  const mood: MascotMood = finished || status === "correct" ? "happy" : status === "wrong" ? "sad" : "idle";
  const line = (status === "correct" ? CORRECT_LINES : WRONG_LINES)[(index + attempts) % (status === "correct" ? CORRECT_LINES.length : WRONG_LINES.length)];

  function resetQuestion(next: Question) {
    setStatus("idle");
    setChoice(null);
    setWrongChoices([]);
    setSlots(emptySlots(next));
    setSlotMarks(null);
    setAttempts(0);
    setPanel(null);
  }

  function check() {
    if (!ready || status !== "idle") return;
    const right =
      q.kind === "choice" ? choice === q.answer : slots.every((tile, i) => tile !== null && q.tiles[tile] === q.answer[i]);

    setAttempts((a) => a + 1);
    setReaction((r) => r + 1);
    setPanel(null);

    if (right) {
      const earned = attempts === 0 ? XP_FIRST_TRY : XP_RETRY;
      setXp((x) => x + earned);
      setGained(earned);
      setStreak((s) => s + 1);
      if (attempts === 0) setFirstTry((n) => n + 1);
      setStatus("correct");
      if (q.kind === "fill") setSlotMarks(q.answer.map(() => "right"));
      playCorrect();
    } else {
      setStreak(0);
      setStatus("wrong");
      if (q.kind === "choice" && choice !== null) setWrongChoices((w) => [...w, choice]);
      if (q.kind === "fill") setSlotMarks(slots.map((tile, i) => (tile !== null && q.tiles[tile] === q.answer[i] ? "right" : "wrong")));
      cardRef.current?.animate(
        [0, -8, 8, -6, 6, -3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
        { duration: 420, easing: "ease-out" },
      );
      playWrong();
    }
  }

  function tryAgain() {
    setStatus("idle");
    setPanel(null);
    if (q.kind === "choice") setChoice(null);
    else {
      // Keep the tiles that were right; send the wrong ones back to the tray.
      setSlots((s) => s.map((tile, i) => (slotMarks?.[i] === "wrong" ? null : tile)));
      setSlotMarks(null);
    }
  }

  function next() {
    if (index === QUESTIONS.length - 1) {
      setFinished(true);
      setReaction((r) => r + 1);
      playComplete();
      return;
    }
    setIndex(index + 1);
    resetQuestion(QUESTIONS[index + 1]);
  }

  function restart() {
    setIndex(0);
    resetQuestion(QUESTIONS[0]);
    setXp(0);
    setStreak(0);
    setFirstTry(0);
    setFinished(false);
  }

  function toggleMute() {
    setMuted(!muted);
    setMutedState(!muted);
  }

  const primaryAction = status === "correct" ? next : status === "wrong" ? tryAgain : check;

  // Keyboard: 1–4 picks an option, Enter checks / continues.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (finished || e.target instanceof HTMLInputElement) return;
    if (e.key === "Enter") {
      e.preventDefault();
      primaryAction();
    } else if (q.kind === "choice" && status === "idle") {
      const n = Number(e.key) - 1;
      if (n >= 0 && n < q.options.length && !wrongChoices.includes(n)) setChoice(n);
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const done = index + (status === "correct" || finished ? 1 : 0);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Soft glow from the bottom that matches the result */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-2/3 transition-opacity duration-500 ${
          status === "idle" && !finished ? "opacity-0" : "opacity-100"
        } ${
          status === "wrong"
            ? "bg-[radial-gradient(ellipse_at_bottom,rgba(245,179,1,0.22),transparent_65%)]"
            : "bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--primary)_24%,transparent),transparent_65%)]"
        }`}
      />

      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center gap-3 px-3 sm:gap-6 sm:px-8">
        <Link
          href={onExitHref}
          aria-label="Exit lesson"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>

        <div className="mx-auto flex w-full max-w-md gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={done}>
          {QUESTIONS.map((question, i) => (
            <span
              key={question.id}
              className={`h-2.5 flex-1 rounded-full transition-colors duration-500 ${i < done ? "bg-primary" : i === index ? "bg-border-strong" : "bg-border"}`}
            />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" />
              {muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
            </svg>
          </button>
          <span key={xp} className="xp-bump flex items-center gap-1 font-cofo text-lg font-bold tabular-nums text-muted">
            {xp}
            <svg className="size-5 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" />
            </svg>
          </span>
          <svg
            className={`size-6 transition-colors ${streak > 0 ? "text-amber-400" : "text-border-strong"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label={`Streak ${streak}`}
          >
            <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
          </svg>
        </div>
      </header>

      <main className="flex flex-1 flex-col pb-44 md:px-8 md:pb-6">
        <div
          ref={cardRef}
          className={`relative mx-auto flex w-full max-w-6xl flex-1 flex-col transition-colors duration-300 md:rounded-[28px] md:border-2 ${
            status === "correct" || finished ? "md:border-primary" : status === "wrong" ? "md:border-amber-400" : "md:border-border"
          }`}
        >
          {finished ? (
            <Finished xp={xp} firstTry={firstTry} total={QUESTIONS.length} reaction={reaction} onRestart={restart} exitHref={onExitHref} />
          ) : (
            <>
              <div className="flex flex-1 flex-col items-center justify-center px-5 py-6 md:px-10">
                <div key={q.id} className="question-in w-full max-w-[640px]">
                  {q.intro && <p className="mb-5 font-cofo text-lg font-medium sm:text-xl">{q.intro}</p>}
                  <h1 className="mb-8 font-cofo text-lg font-bold sm:text-xl">{q.prompt}</h1>

                  {q.kind === "fill" ? (
                    <DragFill question={q} slots={slots} onChange={setSlots} marks={slotMarks} locked={status !== "idle"} />
                  ) : (
                    <>
                      <Scale stacks={q.scale.stacks} reading={q.scale.reading} />
                      <div className="mt-8 grid grid-cols-2 gap-3">
                        {q.options.map((option, i) => (
                          <OptionButton
                            key={option}
                            label={option}
                            state={
                              status === "correct" && choice === i
                                ? "correct"
                                : status === "wrong" && choice === i
                                  ? "wrong"
                                  : wrongChoices.includes(i)
                                    ? "ruled-out"
                                    : choice === i
                                      ? "selected"
                                      : "idle"
                            }
                            disabled={status !== "idle" || wrongChoices.includes(i)}
                            onClick={() => setChoice(i)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {panel && (
                    <div className="question-in mt-6 rounded-2xl border-2 border-border bg-surface p-4 sm:p-5">
                      <p className={`font-cofo font-bold ${panel === "why" ? "text-primary" : "text-amber-500"}`}>
                        {panel === "why" ? "Why?" : "Hint"}
                      </p>
                      <p className="mt-1 leading-relaxed text-muted">{panel === "why" ? q.why : q.hint}</p>
                    </div>
                  )}
                </div>
              </div>

              <BottomBar
                status={status}
                ready={ready}
                gained={gained}
                line={line}
                mood={mood}
                reaction={reaction}
                onPrimary={primaryAction}
                onSecondary={() => setPanel(panel ? null : status === "correct" ? "why" : "hint")}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

type OptionState = "idle" | "selected" | "correct" | "wrong" | "ruled-out";

function OptionButton({ label, state, disabled, onClick }: { label: string; state: OptionState; disabled: boolean; onClick: () => void }) {
  const styles: Record<OptionState, string> = {
    idle: "border-border bg-surface hover:border-border-strong shadow-[0_3px_0_var(--border)]",
    selected: "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-300 shadow-[0_3px_0_#0284c7]",
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
      className={`relative h-14 rounded-2xl border-2 font-cofo text-lg font-medium transition-[colors,transform] active:translate-y-0.5 disabled:cursor-default disabled:active:translate-y-0 sm:h-[68px] sm:text-xl ${styles[state]}`}
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

function BottomBar({
  status,
  ready,
  gained,
  line,
  mood,
  reaction,
  onPrimary,
  onSecondary,
}: {
  status: Status;
  ready: boolean;
  gained: number;
  line: string;
  mood: MascotMood;
  reaction: number;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const secondaryLabel = status === "correct" ? "Why?" : "Get help";

  return (
    // Mobile: a sheet fixed to the bottom that turns green/amber. Desktop: a row inside the card.
    <div
      className={`fixed inset-x-0 bottom-0 z-20 rounded-t-[28px] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 transition-colors duration-300 md:static md:rounded-none md:bg-transparent md:px-8 md:pb-6 md:pt-2 ${
        status === "correct"
          ? "bg-[color-mix(in_srgb,var(--primary)_18%,var(--background))]"
          : status === "wrong"
            ? "bg-[color-mix(in_srgb,#f5b301_18%,var(--background))]"
            : "border-t border-border bg-background md:border-0"
      }`}
    >
      {status !== "idle" && (
        <div className="question-in mb-3 flex items-center justify-between gap-3 md:hidden">
          <p className="font-cofo text-xl font-bold">
            {status === "correct" ? (
              <>
                {line} <span className="ml-1 text-sm text-primary">+{gained} XP</span>
              </>
            ) : (
              <span className="text-amber-500">{line}</span>
            )}
          </p>
          <button type="button" onClick={onSecondary} className="shrink-0 rounded-full bg-foreground/10 px-4 py-2 font-cofo text-sm font-bold">
            {secondaryLabel}
          </button>
        </div>
      )}

      <div className="relative flex items-center gap-3 md:min-h-24 md:justify-center">
        {/* Mascot (bottom-left) with a speech bubble on desktop */}
        <div className="relative shrink-0 md:absolute md:bottom-0 md:left-0">
          {status !== "idle" && (
            <div
              key={`bubble-${reaction}`}
              className={`bubble-in absolute bottom-full left-[70%] mb-1 hidden whitespace-nowrap rounded-2xl px-5 py-3 font-cofo text-lg font-bold md:block ${
                status === "correct" ? "bg-primary text-primary-foreground" : "bg-amber-400 text-[#2a1f00]"
              }`}
            >
              {line}
              {status === "correct" && <span className="ml-2 text-sm opacity-80">+{gained} XP</span>}
            </div>
          )}
          {/* Sibling keys must differ: a shared key here left old bubbles stuck in the DOM */}
          <Mascot key={`mascot-${mood}-${reaction}`} mood={mood} className="size-14 md:size-20" />
          {status === "correct" && <Confetti key={`confetti-${reaction}`} />}
        </div>

        <div className="flex flex-1 gap-3 md:w-full md:max-w-[460px] md:flex-none">
          {status !== "idle" && (
            <button type="button" onClick={onSecondary} className="btn btn-secondary hidden h-14 px-6 text-lg md:inline-flex">
              {secondaryLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onPrimary}
            disabled={status === "idle" && !ready}
            className={`btn h-14 flex-1 text-lg disabled:cursor-not-allowed disabled:bg-border disabled:text-muted disabled:[box-shadow:none] ${
              status === "wrong" ? "btn-warning" : "btn-primary"
            }`}
          >
            {status === "correct" ? "Continue" : status === "wrong" ? "Try again" : "Check"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Finished({
  xp,
  firstTry,
  total,
  reaction,
  onRestart,
  exitHref,
}: {
  xp: number;
  firstTry: number;
  total: number;
  reaction: number;
  onRestart: () => void;
  exitHref: string;
}) {
  return (
    <div className="question-in flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="relative">
        <Mascot key={reaction} mood="happy" className="size-28 sm:size-32" />
        <Confetti />
      </div>
      <h1 className="mt-6 font-headline text-4xl tracking-[-0.02em] sm:text-5xl">Puzzle complete!</h1>
      <p className="mt-2 text-muted">Your brain just got a little sharper.</p>

      <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
        <Stat label="XP earned" value={`${xp}`} accent="text-primary" />
        <Stat label="First try" value={`${firstTry}/${total}`} accent="text-sky-500" />
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <button type="button" onClick={onRestart} className="btn btn-primary h-14 w-full text-lg">
          Play again
        </button>
        <Link href={exitHref} className="btn btn-secondary h-14 w-full text-lg">
          Back to start
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface px-4 py-4 shadow-[0_3px_0_var(--border)]">
      <p className={`font-cofo text-3xl font-bold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
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

function Confetti() {
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
