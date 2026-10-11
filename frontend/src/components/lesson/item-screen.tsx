"use client";

// One exercise inside a level session: question, answer input, hints, feedback and the bottom bar.
// Remounted (keyed by exercise id) for every exercise, so all answer state starts fresh.

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { MascotMood } from "@/components/mascot";
import type { Response } from "@/lib/math/schema";
import { rng, seedFor, shuffle, xpFor, type Outcome, type SessionItem } from "@/lib/math/session";
import { answerText, validateExercise } from "@/lib/math/validate";
import { playCorrect, playSelect, playWrong } from "@/lib/sounds";
import { DragFill } from "./drag-fill";
import { FractionInput, NumberLineTap, NumericInput, OrderList, type FractionValue, type Mark } from "./inputs";
import { BottomBar, OptionButton, optionState, type ItemStatus } from "./player-parts";
import { ShadeGrid } from "./shade-grid";
import { Visual } from "./visuals";

const CORRECT_LINES = ["Right!", "Nice one!", "You got it!", "Brain power!"];
const WRONG_LINES = ["Not quite. Try again!", "Hmm, not that one.", "Oops! Give it another go."];
const PHASE_LABEL = { guided: "Guided practice", practice: "Practice", mastery: "Mastery challenge", review: "Review" } as const;
const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard", mastery: "Mastery" } as const;

/** Shuffled tray order for an order exercise; never the answer itself. */
function trayOrder(id: string, count: number) {
  const identity = Array.from({ length: count }, (_, i) => i);
  const shuffled = shuffle(identity, rng(seedFor(id, 0)));
  return shuffled.every((v, i) => v === i) ? [...identity.slice(1), 0] : shuffled;
}

export function ItemScreen({
  item,
  eyebrow,
  alreadyAwarded,
  onStatus,
  onSettled,
  onContinue,
  shakeRef,
}: {
  item: SessionItem;
  eyebrow: string;
  /** XP for this exercise was earned in an earlier session (no XP twice). */
  alreadyAwarded: boolean;
  onStatus: (status: ItemStatus) => void;
  /** Called once, when the exercise is finished (solved, or solution shown). */
  onSettled: (outcome: Outcome, xp: number) => void;
  onContinue: () => void;
  shakeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { exercise, phase } = item;
  const answer = exercise.answer;
  const mastery = phase === "mastery";
  const guided = phase === "guided";

  const [status, setStatusState] = useState<ItemStatus>("idle");
  const [choice, setChoice] = useState<number | null>(null);
  const [ruledOut, setRuledOut] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [fraction, setFraction] = useState<FractionValue>({ whole: "", num: "", den: "" });
  const [order, setOrder] = useState<number[]>([]);
  const [pool] = useState(() => (answer.type === "order" ? trayOrder(exercise.id, answer.items.length) : []));
  const [slots, setSlots] = useState<(number | null)[]>(() => (answer.type === "fill" ? answer.answer.map(() => null) : []));
  const [shaded, setShaded] = useState<boolean[]>(() => (answer.type === "shade" ? Array<boolean>(answer.rows * answer.cols).fill(false) : []));
  const [lineValue, setLineValue] = useState<number | null>(null);
  const [marks, setMarks] = useState<Mark[] | null>(null);
  const [wrong, setWrong] = useState(0);
  // Guided questions show the first hint for free.
  const [hintsShown, setHintsShown] = useState(guided ? Math.min(1, exercise.hints.length) : 0);
  const [message, setMessage] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [gained, setGained] = useState(0);
  const [reaction, setReaction] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const hintsUsed = Math.max(0, hintsShown - (guided ? 1 : 0));
  const locked = status !== "idle";
  const mark: Mark = marks?.[0] ?? null;

  const ready =
    answer.type === "choice"
      ? choice !== null
      : answer.type === "numeric" || answer.type === "expression"
        ? text.trim() !== ""
        : answer.type === "fraction"
          ? fraction.num.trim() !== "" && fraction.den.trim() !== ""
          : answer.type === "order"
            ? order.length === answer.items.length
            : answer.type === "fill"
              ? slots.every((s) => s !== null)
              : answer.type === "shade"
                ? shaded.some(Boolean)
                : lineValue !== null;

  function setStatus(next: ItemStatus) {
    setStatusState(next);
    onStatus(next);
  }

  function response(): Response {
    switch (answer.type) {
      case "choice":
        return { type: "choice", index: choice };
      case "numeric":
        return { type: "numeric", text };
      case "expression":
        return { type: "expression", text };
      case "fraction":
        return { type: "fraction", ...fraction };
      case "order":
        return { type: "order", order };
      case "fill":
        return { type: "fill", slots };
      case "shade":
        return { type: "shade", cells: shaded };
      case "numberLine":
        return { type: "numberLine", value: lineValue };
    }
  }

  /** Right / wrong per position (order, fill) or a single mark for everything else. */
  function marksFor(right: boolean): Mark[] {
    if (answer.type === "order") return order.map((it, i) => (answer.items[it] === answer.items[i] ? "right" : "wrong"));
    if (answer.type === "fill") return slots.map((t, i) => (t !== null && answer.tiles[t] === answer.answer[i] ? "right" : "wrong"));
    return [right ? "right" : "wrong"];
  }

  function settle(outcome: Omit<Outcome, "exerciseId" | "topic" | "difficulty" | "phase" | "hintsUsed">) {
    const full: Outcome = { exerciseId: exercise.id, topic: exercise.topic, difficulty: exercise.difficulty, phase, hintsUsed, ...outcome };
    const xp = xpFor(full, exercise, alreadyAwarded);
    setGained(xp);
    onSettled(full, xp);
  }

  function scrollToPanel() {
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  function check() {
    if (status !== "idle" || !ready) return;
    const result = validateExercise(exercise, response());
    if (result.status === "invalid") {
      setInvalid(result.message);
      return;
    }
    setInvalid(null);
    setReaction((r) => r + 1);

    if (result.status === "correct") {
      setMarks(marksFor(true));
      setMessage(null);
      setStatus("correct");
      settle({ wrongAttempts: wrong, solutionShown: false, correct: true });
      playCorrect();
      scrollToPanel();
      return;
    }

    const misses = wrong + 1;
    setWrong(misses);
    setMessage(result.message ?? null);
    setMarks(marksFor(false));
    if (answer.type === "choice" && choice !== null) setRuledOut((r) => [...r, choice]);
    shakeRef.current?.animate(
      [0, -8, 8, -6, 6, -3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
      { duration: 420, easing: "ease-out" },
    );
    playWrong();
    if (mastery) {
      // Mastery questions get one try: show the solution straight away.
      setStatus("revealed");
      setShowSteps(true);
      settle({ wrongAttempts: misses, solutionShown: false, correct: false });
    } else {
      setStatus("wrong");
    }
    scrollToPanel();
  }

  function tryAgain() {
    setStatus("idle");
    setMessage(null);
    if (answer.type === "choice") setChoice(null);
    if (answer.type === "order") {
      // Keep the correctly placed start of the list.
      const keep = marks ? marks.findIndex((m) => m !== "right") : 0;
      setOrder((o) => o.slice(0, keep === -1 ? o.length : keep));
    }
    if (answer.type === "fill") setSlots((s) => s.map((tile, i) => (marks?.[i] === "wrong" ? null : tile)));
    setMarks(null);
  }

  function showSolution() {
    setStatus("revealed");
    setShowSteps(true);
    settle({ wrongAttempts: wrong, solutionShown: true, correct: false });
    scrollToPanel();
  }

  function nextHint() {
    setHintsShown((h) => Math.min(h + 1, exercise.hints.length));
    scrollToPanel();
  }

  function choose(i: number) {
    if (choice !== i) playSelect();
    setChoice(i);
    setInvalid(null);
  }

  const primaryAction = status === "correct" || status === "revealed" ? onContinue : status === "wrong" ? tryAgain : check;
  const primaryLabel = status === "correct" || status === "revealed" ? "Continue" : status === "wrong" ? "Try again" : "Check";

  const hintsLeft = !mastery && hintsShown < exercise.hints.length;
  const secondary =
    status === "idle"
      ? hintsLeft
        ? { label: hintsShown ? "Next hint" : "Hint", onClick: nextHint }
        : null
      : status === "wrong"
        ? wrong >= 2
          ? { label: "Show solution", onClick: showSolution }
          : hintsLeft
            ? { label: "Hint", onClick: nextHint }
            : null
        : status === "correct"
          ? { label: showSteps ? "Hide steps" : "Steps", onClick: () => setShowSteps((s) => !s) }
          : null;

  const mood: MascotMood = status === "correct" ? "happy" : status === "idle" ? "idle" : "sad";
  const lines = status === "correct" ? CORRECT_LINES : WRONG_LINES;
  const headline = status === "revealed" ? (mastery ? "Not this time" : "Here's how") : lines[(exercise.id.length + wrong) % lines.length];
  const gainedLabel = status !== "correct" ? undefined : gained > 0 ? `+${gained} XP` : alreadyAwarded ? "XP already earned" : undefined;

  // Keyboard: 1–6 picks an option, Enter checks / continues (inputs handle their own Enter).
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (status !== "idle" || ready) primaryAction();
    } else if (answer.type === "choice" && status === "idle") {
      const n = Number(e.key) - 1;
      if (n >= 0 && n < answer.options.length && !ruledOut.includes(n)) choose(n);
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div ref={shakeRef} className="flex flex-1 flex-col items-center justify-center px-4 py-5 sm:px-5 sm:py-6 md:px-10">
        <div className="question-in w-full max-w-[640px]">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs">
              {eyebrow} · {PHASE_LABEL[phase]}
            </p>
            <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide text-muted sm:text-[11px]">
              {DIFFICULTY_LABEL[exercise.difficulty]}
            </span>
          </div>
          <p className="mb-1.5 text-xs text-muted sm:text-sm">
            {exercise.topic} · {exercise.subtopic}
          </p>
          <h1 className="font-cofo text-lg font-bold leading-snug sm:text-2xl">{exercise.prompt}</h1>
          {exercise.instructions && <p className="mt-1.5 text-sm text-muted sm:text-base">{exercise.instructions}</p>}

          {exercise.visual && (
            <div className="mt-5 sm:mt-7">
              <Visual visual={exercise.visual} />
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            {answer.type === "choice" && (
              <div className={`grid gap-2.5 sm:gap-3 ${answer.options.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
                {answer.options.map((option, i) => (
                  <OptionButton
                    key={option}
                    label={option}
                    state={optionState(i, choice, status, ruledOut, answer.correct)}
                    disabled={locked || ruledOut.includes(i)}
                    onClick={() => choose(i)}
                  />
                ))}
              </div>
            )}
            {(answer.type === "numeric" || answer.type === "expression") && (
              <NumericInput
                value={text}
                onChange={(t) => {
                  setText(t);
                  setInvalid(null);
                }}
                onSubmit={primaryAction}
                mark={mark}
                locked={locked}
                unit={answer.type === "numeric" ? answer.unit : undefined}
                placeholder={answer.placeholder}
              />
            )}
            {answer.type === "fraction" && (
              <FractionInput
                value={fraction}
                onChange={(f) => {
                  setFraction(f);
                  setInvalid(null);
                }}
                onSubmit={primaryAction}
                mark={mark}
                locked={locked}
                mixed={answer.mixed}
              />
            )}
            {answer.type === "order" && (
              <OrderList items={answer.items} pool={pool} order={order} onChange={setOrder} direction={answer.direction} marks={marks} locked={locked} />
            )}
            {answer.type === "fill" && (
              <DragFill
                question={answer}
                slots={slots}
                onChange={setSlots}
                marks={marks as ("right" | "wrong" | null)[] | null}
                locked={locked}
              />
            )}
            {answer.type === "shade" && <ShadeGrid question={answer} shaded={shaded} onChange={setShaded} mark={mark} locked={locked} />}
            {answer.type === "numberLine" && (
              <NumberLineTap
                min={answer.min}
                max={answer.max}
                step={answer.step}
                labels={answer.labels}
                value={lineValue}
                onChange={(v) => {
                  setLineValue(v);
                  setInvalid(null);
                }}
                mark={mark}
                locked={locked}
              />
            )}
          </div>

          {invalid && status === "idle" && (
            <p role="alert" className="question-in mt-3 text-center font-cofo text-sm font-bold text-amber-600 dark:text-amber-400">
              {invalid}
            </p>
          )}

          <div ref={panelRef} className="scroll-mb-44 md:scroll-mb-6">
            {/* Hints */}
            {hintsShown > 0 && status !== "correct" && status !== "revealed" && (
              <div className="question-in mt-5 rounded-2xl border-2 border-border bg-surface p-4 sm:mt-6 sm:p-5">
                {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                  <div key={i} className={i > 0 ? "mt-3 border-t border-border pt-3" : ""}>
                    <p className="font-cofo text-sm font-bold text-amber-500 sm:text-base">{guided && i === 0 ? "Tip" : `Hint ${guided ? i : i + 1}`}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Wrong answer: what the mistake usually means */}
            {status === "wrong" && (
              <div className="question-in mt-4 rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-4 sm:p-5">
                <p className="font-cofo text-sm font-bold text-amber-600 sm:text-base dark:text-amber-400">
                  {message ? "Check this" : "Not quite"}
                </p>
                <p className="mt-1 text-sm leading-relaxed sm:text-base">
                  {message ?? (wrong >= 2 ? "Still not it. You can look at the full solution." : "Have another look, or take a hint.")}
                </p>
              </div>
            )}

            {/* Correct: why it works */}
            {status === "correct" && (
              <div className="question-in mt-5 rounded-2xl border-2 border-primary/50 bg-primary/10 p-4 sm:mt-6 sm:p-5">
                <p className="font-cofo text-sm font-bold text-primary sm:text-base">Why it works</p>
                <p className="mt-1 text-sm leading-relaxed sm:text-base">{exercise.why}</p>
              </div>
            )}

            {/* Solution: after a correct answer (on request), after giving up, or after a missed mastery question */}
            {showSteps && (
              <div className="question-in mt-4 rounded-2xl border-2 border-border bg-surface p-4 sm:p-5">
                {status === "revealed" && (
                  <>
                    {mastery && message && <p className="mb-2 text-sm leading-relaxed text-amber-600 sm:text-base dark:text-amber-400">{message}</p>}
                    <p className="font-cofo text-sm font-bold sm:text-base">
                      Answer: <span className="text-primary">{answerText(answer)}</span>
                    </p>
                  </>
                )}
                <p className={`font-cofo text-sm font-bold text-muted sm:text-base ${status === "revealed" ? "mt-3" : ""}`}>Solution</p>
                <ol className="mt-1.5 flex flex-col gap-1.5">
                  {exercise.steps.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed sm:text-base">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-cofo text-[11px] font-bold text-[var(--accent-ink)]">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {status === "revealed" && (
                  <p className="mt-3 text-xs text-muted sm:text-sm">
                    {mastery ? "Mastery questions have one try and no hints." : "No XP for this one, but it goes into your review list."}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomBar
        status={status}
        ready={ready}
        headline={headline}
        gainedLabel={gainedLabel}
        mood={mood}
        reaction={reaction}
        primaryLabel={primaryLabel}
        onPrimary={primaryAction}
        secondary={secondary}
      />
    </>
  );
}
