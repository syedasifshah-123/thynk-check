// Integrity checks over the curriculum and every written exercise bank.

import { describe, expect, it } from "vitest";
import { BRANCHES, totalLevels } from "./curriculum";
import { BANK_SHAPE } from "./session";
import type { Difficulty } from "./schema";
import { correctResponse, validate } from "./validate";

const written = BRANCHES.flatMap((b) => b.levels).filter((l) => l.content);

describe("curriculum", () => {
  it("has all 15 branches in order, with every listed level", () => {
    expect(BRANCHES.map((b) => b.id)).toEqual([
      "arithmetic",
      "algebra",
      "geometry",
      "trigonometry",
      "calculus",
      "statistics",
      "probability",
      "linear-algebra",
      "number-theory",
      "discrete",
      "analysis",
      "abstract-algebra",
      "logic",
      "set-theory",
      "topology",
    ]);
    expect(BRANCHES.map((b) => b.levels.length)).toEqual([10, 8, 8, 7, 8, 7, 7, 7, 7, 7, 8, 7, 7, 6, 7]);
    expect(totalLevels()).toBe(111);
  });

  it("gives every level a title, a stage and topics with subtopics", () => {
    for (const level of BRANCHES.flatMap((b) => b.levels)) {
      expect(level.title.length, level.id).toBeGreaterThan(3);
      expect(level.topics.length, level.id).toBeGreaterThanOrEqual(2);
      for (const topic of level.topics) expect(topic.subtopics.length, `${level.id}: ${topic.title}`).toBeGreaterThanOrEqual(1);
      const subtopics = level.topics.reduce((sum, t) => sum + t.subtopics.length, 0);
      expect(subtopics, `${level.id} subtopic count`).toBeGreaterThanOrEqual(4);
    }
  });

  it("points prerequisites at real levels", () => {
    for (const branch of BRANCHES.filter((b) => b.prerequisite)) {
      const pre = BRANCHES.find((b) => b.id === branch.prerequisite!.branchId);
      expect(pre?.levels.some((l) => l.number === branch.prerequisite!.level), branch.id).toBe(true);
    }
  });

  it("has Arithmetic fully written", () => {
    const arithmetic = BRANCHES[0];
    expect(arithmetic.levels.every((l) => l.content)).toBe(true);
  });
});

describe.each(written.map((l) => [l.id, l] as const))("exercise bank %s", (_, level) => {
  const exercises = level.content!.exercises;

  it("has 10 easy, 10 medium, 5 hard and 5 mastery exercises", () => {
    const counts = exercises.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.difficulty]: (acc[e.difficulty] ?? 0) + 1 }), {});
    for (const d of Object.keys(BANK_SHAPE) as Difficulty[]) expect(counts[d] ?? 0, d).toBe(BANK_SHAPE[d]);
  });

  it("uses unique ids and no duplicate exercises", () => {
    expect(new Set(exercises.map((e) => e.id)).size).toBe(exercises.length);
    const fingerprint = (e: (typeof exercises)[number]) => JSON.stringify([e.prompt, e.visual ?? null, e.answer]);
    expect(new Set(exercises.map(fingerprint)).size).toBe(exercises.length);
  });

  it("has globally unique exercise ids", () => {
    const all = written.flatMap((l) => l.content!.exercises.map((e) => e.id));
    expect(new Set(all).size).toBe(all.length);
  });

  it("tags every exercise with a topic and subtopic from the level's curriculum", () => {
    for (const e of exercises) {
      const topic = level.topics.find((t) => t.title === e.topic);
      expect(topic, `${e.id}: topic "${e.topic}"`).toBeDefined();
      expect(
        topic!.subtopics.map((s) => s.toLowerCase()).includes(e.subtopic.toLowerCase()),
        `${e.id}: subtopic "${e.subtopic}"`,
      ).toBe(true);
    }
  });

  it("has at least one hint, a worked solution and an explanation for every exercise", () => {
    for (const e of exercises) {
      expect(e.hints.length, e.id).toBeGreaterThan(0);
      expect(e.steps.length, e.id).toBeGreaterThan(0);
      expect(e.why.length, e.id).toBeGreaterThan(10);
    }
  });

  it("accepts its own correct answer", () => {
    for (const e of exercises) expect(validate(e.answer, correctResponse(e.answer)).status, e.id).toBe("correct");
  });

  it("has well-formed answer data", () => {
    for (const e of exercises) {
      const a = e.answer;
      if (a.type === "choice") {
        expect(a.correct, e.id).toBeGreaterThanOrEqual(0);
        expect(a.correct, e.id).toBeLessThan(a.options.length);
        expect(new Set(a.options).size, `${e.id} duplicate options`).toBe(a.options.length);
      }
      if (a.type === "fill") for (const t of a.answer) expect(a.tiles, `${e.id} missing tile ${t}`).toContain(t);
      if (a.type === "shade") expect(a.target, e.id).toBeLessThanOrEqual(a.rows * a.cols);
      if (a.type === "numberLine") {
        expect(a.value, e.id).toBeGreaterThanOrEqual(a.min);
        expect(a.value, e.id).toBeLessThanOrEqual(a.max);
        const steps = (a.value - a.min) / a.step;
        expect(Math.abs(steps - Math.round(steps)), `${e.id} value not on a tick`).toBeLessThan(1e-9);
      }
      if (a.type === "order") expect(a.items.length, e.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("never lists the correct answer as a misconception", () => {
    for (const e of exercises) {
      for (const m of e.misconceptions ?? []) {
        if (e.answer.type === "choice") expect(m.match, e.id).not.toBe(e.answer.correct);
        if (e.answer.type === "numeric") expect(Number(m.match), e.id).not.toBe(e.answer.value);
      }
    }
  });
});
