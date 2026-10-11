// Thynk Math data model: Mathematics → Branch → Level → Topics → Lesson (intro + worked example)
// → Exercise bank (30 per level) → Mastery challenge.
//
// This file is pure types: no React, no browser APIs, so validation / session / progress logic
// can import it and be unit-tested.

import type { ScaleItem } from "@/components/lesson/scale";

export type Difficulty = "easy" | "medium" | "hard" | "mastery";

/** Equation token for fill-in-the-blank: plain text, a drop slot, or a variable term ("x", "3s"). */
export type Token = string | { slot: number };

/** Diagram shown above an exercise (or in an intro / worked example). */
export type Visual =
  | { type: "scale"; stacks: ScaleItem[][]; reading: string }
  | { type: "numberLine"; min: number; max: number; step: number; labels?: number[]; marker?: number }
  | { type: "blocks"; hundreds: number; tens: number; ones: number }
  | { type: "dots"; groups: number[] }
  | { type: "sequence"; items: (number | null)[] }
  | { type: "growing"; counts: number[] }
  | { type: "thermometer"; value: number; min: number; max: number }
  /** A bar split into equal parts, some shaded. Several bars stack (for comparing fractions). */
  | { type: "fractionBars"; bars: { parts: number; shaded: number; label?: string }[] }
  /** rows × cols array of dots (multiplication as groups / area). */
  | { type: "array"; rows: number; cols: number }
  /** 10 × 10 grid with `shaded` squares out of 100 (percentages, hundredths). */
  | { type: "percentGrid"; shaded: number }
  /** Ratio strip: coloured groups of counters, e.g. 3 red : 2 blue. */
  | { type: "ratio"; groups: { label: string; count: number; color: string }[] };

/** What the learner has to produce, and the data needed to check it. */
export type AnswerSpec =
  | { type: "choice"; options: string[]; correct: number }
  /** Any number equal to `value` (decimals, fractions, negatives accepted), within `tolerance`. */
  | { type: "numeric"; value: number; tolerance?: number; unit?: string; placeholder?: string }
  /** A fraction equivalent to num/den. `simplest` also requires lowest terms; `mixed` shows a whole-number box. */
  | { type: "fraction"; num: number; den: number; simplest?: boolean; mixed?: boolean }
  /** An algebraic expression equivalent to `expected` (checked by evaluating, not string matching). */
  | { type: "expression"; expected: string; variables: string[]; placeholder?: string }
  /** Put `items` in order. `items` is listed in the CORRECT order; the UI shuffles it. */
  | { type: "order"; items: string[]; direction?: string }
  /** Drag tiles into slots. `answer[i]` is the tile text that belongs in slot i. */
  | { type: "fill"; lines: Token[][]; tiles: string[]; answer: string[] }
  /** Tap squares to shade exactly `target` of rows × cols. */
  | { type: "shade"; rows: number; cols: number; target: number }
  /** Tap the point on a number line. */
  | { type: "numberLine"; min: number; max: number; step: number; labels?: number[]; value: number };

/** A predictable wrong answer and what it reveals. `match` is a choice index or a numeric value. */
export type Misconception = { match: number | string; message: string };

export type Exercise = {
  /** Globally unique, e.g. "ar1-e03". */
  id: string;
  difficulty: Difficulty;
  topic: string;
  subtopic: string;
  prompt: string;
  instructions?: string;
  visual?: Visual;
  answer: AnswerSpec;
  /** Ordered from gentle nudge to strong hint. */
  hints: string[];
  /** Full worked solution, revealed only after repeated misses (or after a correct answer). */
  steps: string[];
  /** One or two sentences on WHY the answer is right, shown when the learner gets it. */
  why: string;
  misconceptions?: Misconception[];
  /** Overrides the default XP for the difficulty. */
  xp?: number;
  /** Estimated seconds to solve. */
  seconds?: number;
};

export type Topic = { title: string; subtopics: string[] };

export type Stage = "Foundation" | "Core" | "Intermediate" | "Advanced" | "Expert";

/** The teaching part of a level, shown before the exercises. */
export type LevelLesson = {
  intro: { title: string; body: string[]; visual?: Visual };
  example: { title: string; problem: string; visual?: Visual; steps: string[]; answer: string };
};

export type LevelContent = LevelLesson & { exercises: Exercise[] };

export type Level = {
  /** Unique, e.g. "arithmetic-4". */
  id: string;
  branchId: string;
  number: number;
  title: string;
  stage: Stage;
  topics: Topic[];
  /** Missing until the level's lesson and full exercise bank have been written. */
  content?: LevelContent;
};

export type BranchColor = { main: string; shadow: string; ink: string };

export type Branch = {
  id: string;
  number: number;
  title: string;
  /** Short subtitle, e.g. "Numbers & Calculations". */
  subtitle: string;
  description: string;
  color: BranchColor;
  /** Must pass this level of another branch before this branch opens (advanced branches only). */
  prerequisite?: { branchId: string; level: number };
  levels: Level[];
};

/* ───────────── Responses (what the UI hands to the validator) ───────────── */

export type Response =
  | { type: "choice"; index: number | null }
  | { type: "numeric"; text: string }
  | { type: "fraction"; whole: string; num: string; den: string }
  | { type: "expression"; text: string }
  | { type: "order"; order: number[] }
  | { type: "fill"; slots: (number | null)[] }
  | { type: "shade"; cells: boolean[] }
  | { type: "numberLine"; value: number | null };

export type Validation =
  /** Not checkable yet (empty / unparseable); doesn't count as an attempt. */
  | { status: "invalid"; message: string }
  | { status: "correct" }
  | { status: "incorrect"; message?: string };
