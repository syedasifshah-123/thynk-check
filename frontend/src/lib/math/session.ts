// Session building, scoring, XP and progression rules. Pure functions only (no React, no storage),
// so everything here is deterministic and unit-tested.

import type { Branch, Difficulty, Exercise, Level } from "./schema";

/* ───────────── Config ───────────── */

export const MATH_CONFIG = {
  /** Share of mastery questions that must be right first time (no hints) to pass a level. */
  masteryThreshold: 0.8,
  /** How a first-time session is assembled from the 30-exercise bank. */
  session: { easy: 6, medium: 6, hard: 3, mastery: 5, guided: 3 },
  /** Max questions in a "review my mistakes" session. */
  reviewSize: 8,
  xp: { easy: 10, medium: 15, hard: 20, mastery: 25 } satisfies Record<Difficulty, number>,
  /** Topics below this first-try accuracy are flagged for more practice. */
  weakTopicBelow: 0.7,
};

/** The bank shape every finished level must have. */
export const BANK_SHAPE: Record<Difficulty, number> = { easy: 10, medium: 10, hard: 5, mastery: 5 };

/* ───────────── Deterministic randomness ───────────── */

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** mulberry32: tiny seeded PRNG, so a given (level, attempt) always builds the same session. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const seedFor = (key: string, attempt: number) => hash(`${key}#${attempt}`);

/* ───────────── Sessions ───────────── */

export type Phase = "guided" | "practice" | "mastery" | "review";
export type SessionItem = { exercise: Exercise; phase: Phase };
export type Session = { kind: "level" | "review"; levelId: string; items: SessionItem[] };

/**
 * First-time / replay session: 15 practice (easy → medium → hard, the first few guided)
 * followed by the 5 mastery challenges. `attempt` varies which practice exercises are picked.
 */
export function buildSession(level: Level, attempt: number): Session {
  const bank = level.content?.exercises ?? [];
  const random = rng(seedFor(level.id, attempt));
  const { easy, medium, hard, mastery, guided } = MATH_CONFIG.session;
  const pick = (d: Difficulty, n: number) => shuffle(bank.filter((e) => e.difficulty === d), random).slice(0, n);

  const practice = [...pick("easy", easy), ...pick("medium", medium), ...pick("hard", hard)];
  const items: SessionItem[] = [
    ...practice.map((exercise, i) => ({ exercise, phase: (i < guided ? "guided" : "practice") as Phase })),
    ...pick("mastery", mastery).map((exercise) => ({ exercise, phase: "mastery" as Phase })),
  ];
  return { kind: "level", levelId: level.id, items };
}

/** Targeted review: the exercises missed last time, topped up with others from the same topics. */
export function buildReview(level: Level, record: LevelRecord | undefined, attempt: number): Session {
  const bank = level.content?.exercises ?? [];
  const random = rng(seedFor(`${level.id}:review`, attempt));
  const missed = bank.filter((e) => record?.missed.includes(e.id));
  const weak = new Set([...missed.map((e) => e.topic), ...weakTopics(record)]);
  const extra = shuffle(
    bank.filter((e) => weak.has(e.topic) && !missed.includes(e) && e.difficulty !== "mastery"),
    random,
  );
  const chosen = [...missed, ...extra].slice(0, MATH_CONFIG.reviewSize);
  return { kind: "review", levelId: level.id, items: chosen.map((exercise) => ({ exercise, phase: "review" })) };
}

/* ───────────── Results, scoring, XP ───────────── */

export type Outcome = {
  exerciseId: string;
  topic: string;
  difficulty: Difficulty;
  phase: Phase;
  /** Wrong submissions before getting it (0 = first try). */
  wrongAttempts: number;
  hintsUsed: number;
  solutionShown: boolean;
  correct: boolean;
};

export type SessionResult = { kind: Session["kind"]; outcomes: Outcome[]; timeMs: number };

export const firstTry = (o: Outcome) => o.correct && o.wrongAttempts === 0 && o.hintsUsed === 0 && !o.solutionShown;

/** Share of mastery questions answered right first time without hints (0–1). */
export function masteryScore(outcomes: Outcome[]) {
  const mastery = outcomes.filter((o) => o.phase === "mastery");
  return mastery.length ? mastery.filter(firstTry).length / mastery.length : 0;
}

export const passes = (score: number) => score >= MATH_CONFIG.masteryThreshold - 1e-9;

/** XP for one outcome, given which exercises already paid out. */
export function xpFor(outcome: Outcome, exercise: Pick<Exercise, "xp">, alreadyAwarded: boolean) {
  if (alreadyAwarded || !outcome.correct || outcome.solutionShown) return 0;
  const base = exercise.xp ?? MATH_CONFIG.xp[outcome.difficulty];
  return firstTry(outcome) ? base : Math.round(base / 2);
}

/* ───────────── Stored progress per level ───────────── */

export type LevelRecord = {
  /** Finished level sessions (not counting reviews). */
  sessions: number;
  passed: boolean;
  bestMastery: number;
  lastMastery: number | null;
  /** Lifetime XP earned in this level. */
  xp: number;
  /** Exercise ids that have already paid out XP (prevents double counting on replays). */
  awarded: string[];
  stats: { attempted: number; correct: number; incorrect: number; hints: number; timeMs: number };
  /** First-try results by topic, across all sessions. */
  topics: Record<string, { attempts: number; correct: number }>;
  /** Exercises missed first time in the latest session (fuel for review). */
  missed: string[];
  completedAt: number | null;
  updatedAt: number;
};

export const emptyRecord = (): LevelRecord => ({
  sessions: 0,
  passed: false,
  bestMastery: 0,
  lastMastery: null,
  xp: 0,
  awarded: [],
  stats: { attempted: 0, correct: 0, incorrect: 0, hints: 0, timeMs: 0 },
  topics: {},
  missed: [],
  completedAt: null,
  updatedAt: 0,
});

/** Fold a finished session into the level record. Returns the new record and the XP gained. */
export function applySession(
  previous: LevelRecord | undefined,
  result: SessionResult,
  exercises: Record<string, Pick<Exercise, "xp">>,
  now: number,
): { record: LevelRecord; xpGained: number; mastery: number | null; justPassed: boolean } {
  const record = structuredClone(previous ?? emptyRecord());
  const awarded = new Set(record.awarded);
  let xpGained = 0;

  for (const o of result.outcomes) {
    const xp = xpFor(o, exercises[o.exerciseId] ?? {}, awarded.has(o.exerciseId));
    if (xp > 0) awarded.add(o.exerciseId);
    xpGained += xp;

    record.stats.attempted += 1;
    record.stats.correct += o.correct ? 1 : 0;
    record.stats.incorrect += o.wrongAttempts;
    record.stats.hints += o.hintsUsed;

    const t = (record.topics[o.topic] ??= { attempts: 0, correct: 0 });
    t.attempts += 1;
    t.correct += firstTry(o) ? 1 : 0;
  }

  record.awarded = [...awarded];
  record.xp += xpGained;
  record.stats.timeMs += result.timeMs;
  record.updatedAt = now;

  let mastery: number | null = null;
  let justPassed = false;
  if (result.kind === "level") {
    mastery = masteryScore(result.outcomes);
    record.sessions += 1;
    record.lastMastery = mastery;
    record.bestMastery = Math.max(record.bestMastery, mastery);
    record.missed = result.outcomes.filter((o) => !firstTry(o)).map((o) => o.exerciseId);
    if (passes(mastery) && !record.passed) {
      record.passed = true;
      record.completedAt = now;
      justPassed = true;
    }
  } else {
    // A review clears the mistakes you've now fixed.
    const fixed = new Set(result.outcomes.filter(firstTry).map((o) => o.exerciseId));
    record.missed = record.missed.filter((id) => !fixed.has(id));
  }

  return { record, xpGained, mastery, justPassed };
}

/** Topics whose first-try accuracy is below the "needs practice" bar (with enough data). */
export function weakTopics(record: LevelRecord | undefined) {
  if (!record) return [];
  return Object.entries(record.topics)
    .filter(([, t]) => t.attempts >= 2 && t.correct / t.attempts < MATH_CONFIG.weakTopicBelow)
    .map(([topic]) => topic);
}

/* ───────────── Progression ───────────── */

export type LevelStatus = "locked" | "not-started" | "in-progress" | "completed" | "coming-soon";
export type BranchStatus = "locked" | "open" | "completed";

export type MathProgressData = { levels: Record<string, LevelRecord> };

export const hasContent = (level: Level) => Boolean(level.content?.exercises.length);

export function branchStatus(branch: Branch, all: Branch[], data: MathProgressData): BranchStatus {
  if (branch.prerequisite) {
    const pre = all.find((b) => b.id === branch.prerequisite!.branchId);
    const preLevel = pre?.levels.find((l) => l.number === branch.prerequisite!.level);
    if (!preLevel || !data.levels[preLevel.id]?.passed) return "locked";
  }
  // "Completed" only when every level exists and is passed: never fake completion.
  return branch.levels.every((l) => hasContent(l) && data.levels[l.id]?.passed) ? "completed" : "open";
}

export function levelStatus(level: Level, branch: Branch, all: Branch[], data: MathProgressData): LevelStatus {
  if (!hasContent(level)) return "coming-soon";
  if (branchStatus(branch, all, data) === "locked") return "locked";
  const record = data.levels[level.id];
  if (record?.passed) return "completed";
  const previous = branch.levels.find((l) => l.number === level.number - 1);
  if (previous && !data.levels[previous.id]?.passed) return "locked";
  return record && (record.sessions > 0 || record.stats.attempted > 0) ? "in-progress" : "not-started";
}

/** Where "Continue" should take the learner: an in-progress level first, then the next open one. */
export function nextLevel(all: Branch[], data: MathProgressData) {
  let fallback: { branch: Branch; level: Level } | undefined;
  for (const branch of all) {
    for (const level of branch.levels) {
      const status = levelStatus(level, branch, all, data);
      if (status === "in-progress") return { branch, level };
      if (status === "not-started") fallback ??= { branch, level };
    }
  }
  return fallback;
}
