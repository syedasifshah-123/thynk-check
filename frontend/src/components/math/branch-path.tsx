"use client";

import Link from "next/link";
import { BRANCHES, levelHref } from "@/lib/math/curriculum";
import type { Branch, Level } from "@/lib/math/schema";
import { hasContent, levelStatus, MATH_CONFIG, weakTopics, type LevelRecord, type LevelStatus, type MathProgressData } from "@/lib/math/session";
import { BranchArt } from "./branch-art";

const STATUS_LABEL: Record<LevelStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
  locked: "Locked",
  "coming-soon": "Coming soon",
};

function formatMinutes(ms: number) {
  const min = Math.round(ms / 60000);
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)}h ${min % 60}m`;
}

// Branch page: an info card (with stats) + the numbered levels, joined by a path.
export function BranchPath({ branch, data }: { branch: Branch; data: MathProgressData }) {
  const statuses = branch.levels.map((l) => levelStatus(l, branch, BRANCHES, data));
  const written = branch.levels.filter(hasContent);
  const passed = written.filter((l) => data.levels[l.id]?.passed).length;
  const current = branch.levels.find((_, i) => statuses[i] === "in-progress") ?? branch.levels.find((_, i) => statuses[i] === "not-started");

  const records = branch.levels.map((l) => data.levels[l.id]).filter((r): r is LevelRecord => Boolean(r));
  const answered = records.reduce((s, r) => s + r.stats.attempted, 0);
  const correct = records.reduce((s, r) => s + r.stats.correct, 0);
  const time = records.reduce((s, r) => s + r.stats.timeMs, 0);
  const hints = records.reduce((s, r) => s + r.stats.hints, 0);

  const accent = {
    "--accent": branch.color.main,
    "--accent-shadow": branch.color.shadow,
    "--accent-ink": branch.color.ink,
  } as React.CSSProperties;

  return (
    <div style={accent} className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Link href="/math" className="mb-4 inline-flex items-center gap-1.5 font-cofo text-sm font-bold text-muted hover:text-foreground">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          All branches
        </Link>
        <div className="rounded-[24px] border-2 border-border bg-surface p-5 shadow-[0_4px_0_var(--border)] sm:rounded-[28px] sm:p-7">
          <div className="flex items-center gap-4 lg:block">
            <BranchArt id={branch.id} color={branch.color} className="size-16 shrink-0 sm:size-24" />
            <div className="min-w-0 lg:mt-4">
              <p className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:text-xs">
                Branch {branch.number} · {branch.subtitle}
              </p>
              <h1 className="mt-1 font-cofo text-xl font-bold leading-tight sm:text-3xl">{branch.title}</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">{branch.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-cofo text-sm font-bold sm:mt-5">
            <span className="flex items-center gap-1.5">
              <LayersIcon /> {branch.levels.length} Levels
            </span>
            <span className="flex items-center gap-1.5">
              <PuzzleIcon /> {written.reduce((s, l) => s + (l.content?.exercises.length ?? 0), 0)} Exercises
            </span>
          </div>

          <div className="mt-4 sm:mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700" style={{ width: `${written.length ? (passed / written.length) * 100 : 0}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-muted sm:text-sm">
              {written.length ? `${passed}/${written.length} ready levels completed` : "No levels ready yet"}
              {written.length < branch.levels.length && ` · ${branch.levels.length - written.length} still being written`}
            </p>
          </div>

          {answered > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:mt-5">
              <Fact label="Answered" value={`${answered}`} />
              <Fact label="Correct" value={`${Math.round((correct / answered) * 100)}%`} />
              <Fact label="Hints used" value={`${hints}`} />
              <Fact label="Time" value={formatMinutes(time)} />
            </dl>
          )}
        </div>
      </aside>

      <ol className="relative flex flex-col gap-4 pb-6 sm:gap-5">
        {/* path behind the level nodes */}
        <span aria-hidden="true" className="absolute bottom-10 left-[26px] top-10 w-1 rounded-full bg-border sm:left-[32px]" />
        {branch.levels.map((level, i) => (
          <LevelRow key={level.id} level={level} status={statuses[i]} record={data.levels[level.id]} isCurrent={level.id === current?.id} />
        ))}
      </ol>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted sm:text-xs">{label}</dt>
      <dd className="font-cofo text-base font-bold tabular-nums sm:text-lg">{value}</dd>
    </div>
  );
}

function LevelRow({ level, status, record, isCurrent }: { level: Level; status: LevelStatus; record?: LevelRecord; isCurrent: boolean }) {
  const href = levelHref(level);
  const missed = record?.missed.length ?? 0;
  const weak = weakTopics(record);
  const muted = status === "locked" || status === "coming-soon";

  return (
    <li className="relative flex gap-3 sm:gap-5">
      <LevelNode number={level.number} status={status} isCurrent={isCurrent} />

      <div
        className={`min-w-0 flex-1 rounded-[22px] border-2 bg-surface p-4 sm:p-5 ${
          status === "coming-soon"
            ? "border-dashed border-border-strong"
            : isCurrent
              ? "border-[var(--accent)] shadow-[0_4px_0_var(--accent-shadow)]"
              : "border-border shadow-[0_4px_0_var(--border)]"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-cofo text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:text-xs">Level {level.number}</span>
          <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide text-muted sm:text-[11px]">
            {level.stage}
          </span>
          <StatusChip status={status} />
          {isCurrent && (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide text-[var(--accent-ink)] sm:text-[11px]">
              Up next
            </span>
          )}
        </div>
        <h2 className={`mt-1 font-cofo text-base font-bold leading-snug sm:text-lg ${muted ? "text-muted" : ""}`}>{level.title}</h2>

        <ul className="mt-2.5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
          {level.topics.map((topic) => (
            <li key={topic.title} className="min-w-0">
              <p className={`flex items-center gap-1.5 font-cofo text-sm font-bold ${weak.includes(topic.title) ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {topic.title}
                {weak.includes(topic.title) && <span className="text-[10px] font-bold uppercase tracking-wide">· practise</span>}
              </p>
              <p className="text-xs leading-relaxed text-muted">{topic.subtopics.join(" · ")}</p>
            </li>
          ))}
        </ul>

        {status === "coming-soon" ? (
          <p className="mt-3 rounded-xl bg-foreground/[0.04] px-3 py-2 text-xs text-muted sm:text-sm">
            Lessons and exercises for this level are still being written. It isn&apos;t playable yet.
          </p>
        ) : (
          <>
            <p className="mt-3 text-xs text-muted sm:text-sm">
              {level.content!.exercises.length} exercises · {MATH_CONFIG.session.easy + MATH_CONFIG.session.medium + MATH_CONFIG.session.hard} practice +{" "}
              {MATH_CONFIG.session.mastery} mastery per session
            </p>
            {record && record.sessions > 0 && (
              <div className="mt-2.5">
                <div className="relative h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${record.passed ? "bg-[var(--accent)]" : "bg-amber-400"}`}
                    style={{ width: `${record.bestMastery * 100}%` }}
                  />
                  <span className="absolute inset-y-0 w-0.5 bg-foreground/40" style={{ left: `${MATH_CONFIG.masteryThreshold * 100}%` }} aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs text-muted">
                  Best mastery {Math.round(record.bestMastery * 100)}% (need {Math.round(MATH_CONFIG.masteryThreshold * 100)}%) · {record.sessions} session
                  {record.sessions === 1 ? "" : "s"} · {record.xp} XP
                </p>
              </div>
            )}

            {status === "locked" ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-muted sm:text-sm">
                <LockIcon /> {level.number > 1 ? `Complete Level ${level.number - 1} to unlock.` : "Unlock this branch first."}
              </p>
            ) : (
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <Link href={href} className="btn btn-accent h-11 flex-1 px-5 text-sm sm:flex-none sm:text-base">
                  {status === "not-started" ? "Start" : status === "in-progress" ? "Continue" : "Replay"}
                </Link>
                {record && record.sessions > 0 && (
                  <Link href={`${href}/review`} className="btn btn-secondary h-11 flex-1 px-5 text-sm sm:flex-none sm:text-base">
                    {missed ? `Review mistakes (${missed})` : "Review"}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
}

function StatusChip({ status }: { status: LevelStatus }) {
  const look: Record<LevelStatus, string> = {
    completed: "bg-primary/15 text-primary",
    "in-progress": "bg-amber-400/15 text-amber-600 dark:text-amber-400",
    "not-started": "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]",
    locked: "bg-border text-muted",
    "coming-soon": "border border-dashed border-border-strong text-muted",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 font-cofo text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${look[status]}`}>{STATUS_LABEL[status]}</span>
  );
}

function LevelNode({ number, status, isCurrent }: { number: number; status: LevelStatus; isCurrent: boolean }) {
  const look: Record<LevelStatus, string> = {
    completed: "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_5px_0_var(--accent-shadow)]",
    "in-progress": "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_5px_0_var(--accent-shadow)]",
    "not-started": "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_5px_0_var(--accent-shadow)]",
    locked: "bg-border text-muted shadow-[0_5px_0_var(--border-strong)]",
    "coming-soon": "border-2 border-dashed border-border-strong bg-surface text-muted",
  };

  return (
    <div
      aria-hidden="true"
      className={`relative z-[1] mt-2 grid size-14 shrink-0 place-items-center rounded-full font-cofo text-lg font-bold sm:size-[68px] sm:text-xl ${look[status]} ${
        isCurrent ? "node-pulse" : ""
      }`}
    >
      {status === "completed" ? (
        <svg className="size-6 sm:size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : status === "locked" ? (
        <svg className="size-5 sm:size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      ) : (
        number
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}
function PuzzleIcon() {
  return (
    <svg className="size-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 3a2 2 0 0 1 4 0v2h4a1 1 0 0 1 1 1v4h-2a2 2 0 1 0 0 4h2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 1 0-4 0v2H6a1 1 0 0 1-1-1v-4h2a2 2 0 1 0 0-4H5V6a1 1 0 0 1 1-1h4z" />
    </svg>
  );
}
