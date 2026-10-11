import { describe, expect, it } from "vitest";
import { BRANCHES, findBranch, findLevel } from "./curriculum";
import {
  applySession,
  branchStatus,
  buildReview,
  buildSession,
  levelStatus,
  masteryScore,
  MATH_CONFIG,
  nextLevel,
  type MathProgressData,
  type Outcome,
  type SessionResult,
  xpFor,
} from "./session";

const level1 = findLevel("arithmetic", 1)!.level;
const arithmetic = findBranch("arithmetic")!;

function outcome(over: Partial<Outcome> = {}): Outcome {
  return {
    exerciseId: "x",
    topic: "T",
    difficulty: "easy",
    phase: "practice",
    wrongAttempts: 0,
    hintsUsed: 0,
    solutionShown: false,
    correct: true,
    ...over,
  };
}

/** A full level session result where `masteryRight` of the 5 mastery items are first-try correct. */
function levelResult(masteryRight: number, attempt = 0): SessionResult {
  const session = buildSession(level1, attempt);
  let masterySeen = 0;
  return {
    kind: "level",
    timeMs: 60_000,
    outcomes: session.items.map(({ exercise, phase }) => {
      const firstTry = phase !== "mastery" || masterySeen++ < masteryRight;
      return outcome({
        exerciseId: exercise.id,
        topic: exercise.topic,
        difficulty: exercise.difficulty,
        phase,
        wrongAttempts: firstTry ? 0 : 1,
      });
    }),
  };
}

const exerciseMap = Object.fromEntries(level1.content!.exercises.map((e) => [e.id, e]));

describe("buildSession", () => {
  it("picks 15 practice (easy → medium → hard) and 5 mastery items", () => {
    const { items } = buildSession(level1, 0);
    expect(items).toHaveLength(20);
    const practice = items.filter((i) => i.phase !== "mastery");
    expect(practice).toHaveLength(15);
    expect(practice.slice(0, 3).every((i) => i.phase === "guided")).toBe(true);
    expect(items.filter((i) => i.phase === "mastery").every((i) => i.exercise.difficulty === "mastery")).toBe(true);

    const rank = { easy: 0, medium: 1, hard: 2, mastery: 3 };
    const ranks = items.map((i) => rank[i.exercise.difficulty]);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(practice.map((i) => i.exercise.difficulty).filter((d) => d === "easy")).toHaveLength(MATH_CONFIG.session.easy);
  });

  it("is deterministic per attempt and varies between attempts", () => {
    const ids = (attempt: number) => buildSession(level1, attempt).items.map((i) => i.exercise.id);
    expect(ids(3)).toEqual(ids(3));
    expect(ids(0)).not.toEqual(ids(1));
  });

  it("never repeats an exercise within a session", () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const ids = buildSession(level1, attempt).items.map((i) => i.exercise.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("scoring and XP", () => {
  it("mastery score counts first-try mastery answers only", () => {
    expect(masteryScore(levelResult(4).outcomes)).toBeCloseTo(0.8);
    expect(masteryScore(levelResult(5).outcomes)).toBe(1);
    expect(masteryScore([outcome({ phase: "mastery", hintsUsed: 1 })])).toBe(0);
  });

  it("pays full XP first time, half after a retry or hint, nothing for a shown solution", () => {
    expect(xpFor(outcome({ difficulty: "hard" }), {}, false)).toBe(MATH_CONFIG.xp.hard);
    expect(xpFor(outcome({ difficulty: "hard", wrongAttempts: 2 }), {}, false)).toBe(MATH_CONFIG.xp.hard / 2);
    expect(xpFor(outcome({ hintsUsed: 1 }), {}, false)).toBe(MATH_CONFIG.xp.easy / 2);
    expect(xpFor(outcome({ solutionShown: true }), {}, false)).toBe(0);
    expect(xpFor(outcome({ correct: false }), {}, false)).toBe(0);
    expect(xpFor(outcome(), { xp: 40 }, false)).toBe(40);
  });

  it("never pays XP twice for the same exercise", () => {
    const first = applySession(undefined, levelResult(5, 0), exerciseMap, 1);
    const replay = applySession(first.record, levelResult(5, 0), exerciseMap, 2);
    expect(first.xpGained).toBeGreaterThan(0);
    expect(replay.xpGained).toBe(0);
    expect(replay.record.xp).toBe(first.record.xp);
  });

  it("passes at the 80% threshold and not below it", () => {
    expect(applySession(undefined, levelResult(4), exerciseMap, 1).record.passed).toBe(true);
    expect(applySession(undefined, levelResult(3), exerciseMap, 1).record.passed).toBe(false);
  });

  it("keeps a pass once earned, and tracks best mastery", () => {
    const passed = applySession(undefined, levelResult(5), exerciseMap, 1).record;
    const worse = applySession(passed, levelResult(1, 1), exerciseMap, 2);
    expect(worse.record.passed).toBe(true);
    expect(worse.record.bestMastery).toBe(1);
    expect(worse.record.lastMastery).toBeCloseTo(0.2);
    expect(worse.justPassed).toBe(false);
  });

  it("records stats, topic accuracy and mistakes for review", () => {
    const { record } = applySession(undefined, levelResult(3), exerciseMap, 1);
    expect(record.stats.attempted).toBe(20);
    expect(record.stats.incorrect).toBe(2);
    expect(record.missed).toHaveLength(2);
    const totalTopicAttempts = Object.values(record.topics).reduce((s, t) => s + t.attempts, 0);
    expect(totalTopicAttempts).toBe(20);
  });

  it("builds a review from missed exercises first", () => {
    const { record } = applySession(undefined, levelResult(3), exerciseMap, 1);
    const review = buildReview(level1, record, 0);
    expect(review.kind).toBe("review");
    expect(review.items.length).toBeGreaterThanOrEqual(2);
    expect(review.items.length).toBeLessThanOrEqual(MATH_CONFIG.reviewSize);
    expect(review.items.slice(0, 2).map((i) => i.exercise.id).sort()).toEqual([...record.missed].sort());
  });

  it("a successful review clears fixed mistakes but doesn't change the pass state", () => {
    const { record } = applySession(undefined, levelResult(3), exerciseMap, 1);
    const fixed = record.missed.map((id) => outcome({ exerciseId: id, phase: "review", difficulty: "mastery" }));
    const after = applySession(record, { kind: "review", outcomes: fixed, timeMs: 1000 }, exerciseMap, 2);
    expect(after.record.missed).toEqual([]);
    expect(after.record.passed).toBe(false);
    expect(after.mastery).toBeNull();
  });
});

describe("progression", () => {
  const empty: MathProgressData = { levels: {} };

  it("opens level 1 of every branch without a prerequisite", () => {
    expect(levelStatus(arithmetic.levels[0], arithmetic, BRANCHES, empty)).toBe("not-started");
    expect(branchStatus(findBranch("statistics")!, BRANCHES, empty)).toBe("open");
  });

  it("locks the next level until the previous one is passed", () => {
    expect(levelStatus(arithmetic.levels[1], arithmetic, BRANCHES, empty)).toBe("locked");
    const { record } = applySession(undefined, levelResult(4), exerciseMap, 1);
    const data = { levels: { [level1.id]: record } };
    expect(levelStatus(arithmetic.levels[0], arithmetic, BRANCHES, data)).toBe("completed");
    expect(levelStatus(arithmetic.levels[1], arithmetic, BRANCHES, data)).toBe("not-started");
  });

  it("shows a failed attempt as in progress, still blocking the next level", () => {
    const { record } = applySession(undefined, levelResult(2), exerciseMap, 1);
    const data = { levels: { [level1.id]: record } };
    expect(levelStatus(arithmetic.levels[0], arithmetic, BRANCHES, data)).toBe("in-progress");
    expect(levelStatus(arithmetic.levels[1], arithmetic, BRANCHES, data)).toBe("locked");
  });

  it("locks advanced branches behind their prerequisite level", () => {
    const calculus = findBranch("calculus")!;
    expect(branchStatus(calculus, BRANCHES, empty)).toBe("locked");
    const algebra7 = findLevel("algebra", 7)!.level;
    const data: MathProgressData = { levels: { [algebra7.id]: { ...applySession(undefined, levelResult(5), exerciseMap, 1).record } } };
    expect(branchStatus(calculus, BRANCHES, data)).toBe("open");
  });

  it("marks unwritten levels as coming soon and never completes a branch with missing content", () => {
    const algebra = findBranch("algebra")!;
    expect(levelStatus(algebra.levels[0], algebra, BRANCHES, empty)).toBe("coming-soon");
    const allPassed: MathProgressData = {
      levels: Object.fromEntries(algebra.levels.map((l) => [l.id, applySession(undefined, levelResult(5), exerciseMap, 1).record])),
    };
    expect(branchStatus(algebra, BRANCHES, allPassed)).toBe("open");
  });

  it("points Continue at an in-progress level first, then the next open one", () => {
    expect(nextLevel(BRANCHES, empty)?.level.id).toBe("arithmetic-1");
    const passed = applySession(undefined, levelResult(5), exerciseMap, 1).record;
    expect(nextLevel(BRANCHES, { levels: { "arithmetic-1": passed } })?.level.id).toBe("arithmetic-2");
  });
});
