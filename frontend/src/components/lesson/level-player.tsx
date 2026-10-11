"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/mascot";
import type { Branch, Level } from "@/lib/math/schema";
import { firstTry, MATH_CONFIG, passes, type LevelRecord, type Outcome, type Session, type SessionResult } from "@/lib/math/session";
import { isMuted, playComplete, setMuted } from "@/lib/sounds";
import { ItemScreen } from "./item-screen";
import { Confetti, Footer, Stat, type ItemStatus } from "./player-parts";
import { Visual } from "./visuals";

type Stage = "intro" | "example" | "items" | "gate" | "results";

export type FinishSummary = { record: LevelRecord; xpGained: number; mastery: number | null; justPassed: boolean };

type LevelPlayerProps = {
  session: Session;
  branch: Branch;
  level: Level;
  /** Exercise ids whose XP was already earned in earlier sessions. */
  awarded: string[];
  exitHref: string;
  /** The next level, if there is one. `ready` is false while its content is still being written. */
  next?: { href: string; title: string; number: number; ready: boolean };
  /** Saves the session and returns the updated record (called once, at the end). */
  onFinish: (result: SessionResult) => FinishSummary;
  onRetry: () => void;
  onReview: () => void;
};

// A full level: intro → worked example → guided practice → practice → mastery challenge → results.
// Review sessions skip straight to the questions.
export function LevelPlayer({ session, branch, level, awarded, exitHref, next, onFinish, onRetry, onReview }: LevelPlayerProps) {
  const content = level.content!;
  const items = session.items;
  const review = session.kind === "review";

  const [stage, setStage] = useState<Stage>(review ? "items" : "intro");
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<ItemStatus>("idle");
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [summary, setSummary] = useState<FinishSummary | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [muted, setMutedState] = useState(isMuted);
  const startedAt = useRef(0);
  // Shake target for wrong answers. Deliberately NOT the card: a transform on the card would
  // re-anchor the mobile bottom sheet (position: fixed) to the card and make it jump up.
  const shakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const accentStyle = {
    "--accent": branch.color.main,
    "--accent-shadow": branch.color.shadow,
    "--accent-ink": branch.color.ink,
  } as React.CSSProperties;

  function settled(outcome: Outcome, gained: number) {
    setOutcomes((list) => [...list, outcome]);
    setXp((x) => x + gained);
    setStreak((s) => (firstTry(outcome) ? s + 1 : 0));
  }

  function advance() {
    const nextIndex = index + 1;
    setStatus("idle");
    if (nextIndex >= items.length) {
      const result: SessionResult = { kind: session.kind, outcomes, timeMs: Date.now() - startedAt.current };
      setSummary(onFinish(result));
      setTimeMs(result.timeMs);
      setStage("results");
      playComplete();
      return;
    }
    setIndex(nextIndex);
    if (items[nextIndex].phase === "mastery" && items[index].phase !== "mastery") setStage("gate");
  }

  function toggleMute() {
    setMuted(!muted);
    setMutedState(!muted);
  }

  const practiceCount = items.filter((i) => i.phase !== "mastery").length;
  const done = outcomes.length;
  const passedNow = summary ? summary.record.passed : false;
  const glow = stage === "results" ? (review || passedNow ? "good" : "bad") : stage === "items" && status !== "idle" ? (status === "correct" ? "good" : "bad") : null;

  return (
    // Solid background hides the page-wide grid; the grid lives only inside the card below.
    // `isolate` keeps the result glow (z-index:-10) above this background.
    <div className="relative isolate flex min-h-dvh flex-col bg-background" style={accentStyle}>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-2/3 transition-opacity duration-500 ${glow ? "opacity-100" : "opacity-0"} ${
          glow === "bad"
            ? "bg-[radial-gradient(ellipse_at_bottom,rgba(245,179,1,0.22),transparent_65%)]"
            : "bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--primary)_24%,transparent),transparent_65%)]"
        }`}
      />

      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 px-2 sm:h-16 sm:gap-6 sm:px-8">
        <Link
          href={exitHref}
          aria-label="Exit level"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>

        <div
          className="mx-auto flex w-full max-w-md items-center gap-2"
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={done}
        >
          <Segments from={0} to={practiceCount} done={done} current={stage === "items" ? index : -1} />
          {practiceCount < items.length && (
            <>
              <svg className="size-4 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" />
              </svg>
              <Segments from={practiceCount} to={items.length} done={done} current={stage === "items" ? index : -1} className="max-w-[34%]" />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
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
          <span key={xp} className="xp-bump flex items-center gap-1 font-cofo text-base font-bold tabular-nums text-muted sm:text-lg" aria-label={`${xp} XP this session`}>
            {xp}
            <svg className="size-4 text-primary sm:size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" />
            </svg>
          </span>
          <svg
            className={`size-5 transition-colors sm:size-6 ${streak > 0 ? "text-amber-400" : "text-border-strong"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label={`Streak ${streak}`}
          >
            <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
          </svg>
        </div>
      </header>

      <main className="flex flex-1 flex-col pb-40 md:px-8 md:pb-6">
        <div
          className={`grid-surface mx-auto flex w-full max-w-6xl flex-1 flex-col transition-colors duration-300 md:rounded-[28px] md:border-2 ${
            glow === "good" ? "md:border-primary" : glow === "bad" ? "md:border-amber-400" : "md:border-border"
          }`}
        >
          {stage === "intro" && <Intro branch={branch} level={level} onNext={() => setStage("example")} />}
          {stage === "example" && <Example example={content.example} level={level} onNext={() => setStage("items")} />}
          {stage === "gate" && <MasteryGate count={items.length - practiceCount} onStart={() => setStage("items")} />}
          {stage === "items" && (
            <ItemScreen
              key={items[index].exercise.id}
              item={items[index]}
              eyebrow={`Level ${level.number} · ${index + 1}/${items.length}`}
              alreadyAwarded={awarded.includes(items[index].exercise.id)}
              onStatus={setStatus}
              onSettled={settled}
              onContinue={advance}
              shakeRef={shakeRef}
            />
          )}
          {stage === "results" && summary && (
            <Results
              review={review}
              level={level}
              outcomes={outcomes}
              summary={summary}
              timeMs={timeMs}
              exitHref={exitHref}
              branchTitle={branch.title}
              next={next}
              onRetry={onRetry}
              onReview={onReview}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Segments({ from, to, done, current, className = "" }: { from: number; to: number; done: number; current: number; className?: string }) {
  return (
    <div className={`flex flex-1 gap-1 ${className}`}>
      {Array.from({ length: to - from }, (_, k) => {
        const i = from + k;
        return (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-500 sm:h-2.5 ${
              i < done ? "bg-[var(--accent)]" : i === current ? "bg-border-strong" : "bg-border"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ───────────── Intro ───────────── */

function Intro({ branch, level, onNext }: { branch: Branch; level: Level; onNext: () => void }) {
  const { intro } = level.content!;
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-5 sm:px-5 sm:py-8 md:px-10">
        <div className="question-in w-full max-w-[640px]">
          <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs">
            {branch.title} · Level {level.number} · {level.stage}
          </p>
          <h1 className="mt-1 font-headline text-[1.75rem] leading-tight tracking-[-0.02em] sm:text-4xl">{level.title}</h1>
          <h2 className="mt-4 font-cofo text-lg font-bold sm:text-xl">{intro.title}</h2>
          <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-muted sm:text-base">
            {intro.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {intro.visual && (
            <div className="mt-6">
              <Visual visual={intro.visual} />
            </div>
          )}
          <div className="mt-6 rounded-2xl border-2 border-border bg-surface p-4 shadow-[0_3px_0_var(--border)] sm:p-5">
            <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">In this level</p>
            <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
              {level.topics.map((topic) => (
                <li key={topic.title}>
                  <p className="font-cofo text-sm font-bold sm:text-base">{topic.title}</p>
                  <p className="text-xs leading-relaxed text-muted sm:text-sm">{topic.subtopics.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer>
        <button type="button" onClick={onNext} className="btn btn-accent h-12 flex-1 text-base md:h-14 md:text-lg">
          See a worked example
        </button>
      </Footer>
    </>
  );
}

/* ───────────── Worked example ───────────── */

function Example({ example, level, onNext }: { example: NonNullable<Level["content"]>["example"]; level: Level; onNext: () => void }) {
  const [shown, setShown] = useState(1);
  const all = shown >= example.steps.length;

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-5 sm:px-5 sm:py-8 md:px-10">
        <div className="question-in w-full max-w-[640px]">
          <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs">
            Level {level.number} · {example.title}
          </p>
          <h1 className="mt-1 font-cofo text-lg font-bold leading-snug sm:text-2xl">{example.problem}</h1>
          {example.visual && (
            <div className="mt-5">
              <Visual visual={example.visual} />
            </div>
          )}
          <ol className="mt-5 flex flex-col gap-2.5 sm:mt-6">
            {example.steps.slice(0, shown).map((step, i) => (
              <li key={i} className="question-in flex gap-3 rounded-2xl border-2 border-border bg-surface p-3.5 shadow-[0_3px_0_var(--border)] sm:p-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-cofo text-sm font-bold text-[var(--accent-ink)]">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
          {all && (
            <p className="question-in mt-4 rounded-2xl border-2 border-primary/50 bg-primary/10 px-4 py-3 font-cofo text-base font-bold sm:text-lg">
              Answer: <span className="text-primary">{example.answer}</span>
            </p>
          )}
        </div>
      </div>
      <Footer>
        {all ? (
          <button type="button" onClick={onNext} className="btn btn-accent h-12 flex-1 text-base md:h-14 md:text-lg">
            Start practice
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setShown(example.steps.length)} className="btn btn-secondary h-12 px-4 text-sm md:h-14 md:px-6 md:text-lg">
              Show all
            </button>
            <button type="button" onClick={() => setShown((s) => s + 1)} className="btn btn-accent h-12 flex-1 text-base md:h-14 md:text-lg">
              Next step
            </button>
          </>
        )}
      </Footer>
    </>
  );
}

/* ───────────── Mastery gate ───────────── */

function MasteryGate({ count, onStart }: { count: number; onStart: () => void }) {
  const needed = Math.ceil(count * MATH_CONFIG.masteryThreshold - 1e-9);
  return (
    <>
      <div className="question-in flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
        <div className="relative">
          <Mascot mood="happy" className="size-24 sm:size-28" />
        </div>
        <p className="mt-5 font-cofo text-xs font-bold uppercase tracking-[0.14em] text-amber-500">Practice done</p>
        <h1 className="mt-1 font-headline text-3xl tracking-[-0.02em] sm:text-4xl">Mastery challenge</h1>
        <p className="mt-3 max-w-md text-sm text-muted sm:text-base">
          {count} questions. No hints and one try each. Get <strong className="text-foreground">{needed} of {count}</strong> right (
          {Math.round(MATH_CONFIG.masteryThreshold * 100)}%) to complete the level.
        </p>
      </div>
      <Footer>
        <button type="button" onClick={onStart} className="btn btn-accent h-12 flex-1 text-base md:h-14 md:text-lg">
          Start challenge
        </button>
      </Footer>
    </>
  );
}

/* ───────────── Results ───────────── */

function formatTime(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

function Results({
  review,
  level,
  outcomes,
  summary,
  timeMs,
  exitHref,
  branchTitle,
  next,
  onRetry,
  onReview,
}: {
  review: boolean;
  level: Level;
  outcomes: Outcome[];
  summary: FinishSummary;
  timeMs: number;
  exitHref: string;
  branchTitle: string;
  next?: LevelPlayerProps["next"];
  onRetry: () => void;
  onReview: () => void;
}) {
  const right = outcomes.filter(firstTry).length;
  const accuracy = outcomes.length ? right / outcomes.length : 0;
  const masteryItems = outcomes.filter((o) => o.phase === "mastery");
  const masteryRight = masteryItems.filter(firstTry).length;
  const passedThis = summary.mastery !== null && passes(summary.mastery);
  const passed = summary.record.passed;
  const missed = summary.record.missed.length;

  const topics = Object.entries(
    outcomes.reduce<Record<string, { attempts: number; correct: number }>>((acc, o) => {
      const t = (acc[o.topic] ??= { attempts: 0, correct: 0 });
      t.attempts += 1;
      t.correct += firstTry(o) ? 1 : 0;
      return acc;
    }, {}),
  ).map(([topic, t]) => ({ topic, ...t, strong: t.correct / t.attempts >= MATH_CONFIG.weakTopicBelow }));

  const title = review ? "Review done!" : passedThis ? (summary.justPassed ? "Level complete!" : "Mastered again!") : "Almost there";
  const subtitle = review
    ? missed
      ? `${missed} mistake${missed === 1 ? "" : "s"} still on your review list.`
      : "Your review list is clear. Nice work."
    : passedThis
      ? `You mastered ${level.title}.${summary.justPassed && next ? ` Level ${next.number} is unlocked.` : ""}`
      : passed
        ? "You already completed this level. Keep practising to sharpen up."
        : `You need ${Math.ceil(masteryItems.length * MATH_CONFIG.masteryThreshold - 1e-9)}/${masteryItems.length} in the mastery challenge. Review your mistakes and try again.`;

  return (
    <div className="question-in flex flex-1 flex-col items-center px-4 py-8 text-center sm:px-5 sm:py-10">
      <div className="relative">
        <Mascot mood={review || passedThis ? "happy" : "sad"} className="size-24 sm:size-28" />
        {(review || passedThis) && <Confetti />}
      </div>
      <h1 className="mt-5 font-headline text-3xl tracking-[-0.02em] sm:text-5xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted sm:text-base">{subtitle}</p>

      <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${Math.round(accuracy * 100)}%`} sub={`${right}/${outcomes.length} first try`} accent="text-[var(--accent)]" />
        {review ? (
          <Stat label="Still to fix" value={`${missed}`} accent={missed ? "text-amber-500" : "text-primary"} />
        ) : (
          <Stat
            label="Mastery"
            value={`${masteryRight}/${masteryItems.length}`}
            sub={`need ${Math.round(MATH_CONFIG.masteryThreshold * 100)}%`}
            accent={passedThis ? "text-primary" : "text-amber-500"}
          />
        )}
        <Stat label="XP earned" value={`${summary.xpGained}`} accent="text-primary" />
        <Stat label="Time" value={formatTime(timeMs)} accent="text-foreground" />
      </div>

      {topics.length > 0 && (
        <div className="mt-6 w-full max-w-lg rounded-2xl border-2 border-border bg-surface p-4 text-left shadow-[0_3px_0_var(--border)] sm:p-5">
          <p className="font-cofo text-xs font-bold uppercase tracking-[0.12em] text-muted">Topics</p>
          <ul className="mt-3 flex flex-col gap-3">
            {topics.map((t) => (
              <li key={t.topic}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-cofo text-sm font-bold sm:text-base">{t.topic}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${
                      t.strong ? "bg-primary/15 text-primary" : "bg-amber-400/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {t.strong ? "Strong" : "Needs practice"}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                  <div className={`h-full rounded-full ${t.strong ? "bg-primary" : "bg-amber-400"}`} style={{ width: `${(t.correct / t.attempts) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {t.correct}/{t.attempts} first try
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-8">
        {passed && next?.ready ? (
          <Link href={next.href} className="btn btn-accent h-12 w-full text-base sm:h-14 sm:text-lg">
            Next: Level {next.number}
          </Link>
        ) : !passed && missed > 0 ? (
          <button type="button" onClick={onReview} className="btn btn-accent h-12 w-full text-base sm:h-14 sm:text-lg">
            Review mistakes ({missed})
          </button>
        ) : null}
        <button type="button" onClick={onRetry} className="btn btn-secondary h-12 w-full text-base sm:h-14 sm:text-lg">
          {passed ? "Replay level" : "Try the level again"}
        </button>
        {passed && missed > 0 && (
          <button type="button" onClick={onReview} className="btn btn-secondary h-12 w-full text-base sm:h-14 sm:text-lg">
            Review mistakes ({missed})
          </button>
        )}
        {passed && next && !next.ready && (
          <p className="text-sm text-muted">Level {next.number} is still being written. Check back soon!</p>
        )}
        <Link href={exitHref} className="mt-1 font-cofo text-sm font-bold text-muted hover:text-foreground sm:text-base">
          Back to {branchTitle}
        </Link>
      </div>
    </div>
  );
}
