import type { ScaleItem } from "./scale";

/**
 * Equation token: plain text, a drop slot, or a variable term. A token that is a single
 * lowercase letter with an optional number in front ("x", "3s") renders as a variable chip.
 */
export type Token = string | { slot: number };

/** Diagram shown above a multiple-choice question. */
export type Visual =
  | { type: "scale"; stacks: ScaleItem[][]; reading: string }
  /** Number line from min to max. `labels` defaults to every tick; `marker` draws an arrow. */
  | { type: "numberLine"; min: number; max: number; step: number; labels?: number[]; marker?: number }
  /** Base-ten blocks: hundred flats, ten rods, one cubes. */
  | { type: "blocks"; hundreds: number; tens: number; ones: number }
  /** One or more dot groups (two groups get A/B labels for comparing). */
  | { type: "dots"; groups: number[] }
  /** A row of numbers with a gap (null) to fill. */
  | { type: "sequence"; items: (number | null)[] }
  /** Triangular dot patterns that grow, followed by a "?" card. */
  | { type: "growing"; counts: number[] }
  /** Thermometer reading, °C. */
  | { type: "thermometer"; value: number; min: number; max: number };

type Base = {
  id: string;
  /** Optional lead-in line shown above the question. */
  intro?: string;
  prompt: string;
  hint: string;
  why: string;
};

export type ChoiceQuestion = Base & {
  kind: "choice";
  visual?: Visual;
  options: string[];
  answer: number;
};

export type FillQuestion = Base & {
  kind: "fill";
  lines: Token[][];
  tiles: string[];
  /** Correct tile text for each slot, in slot order. */
  answer: string[];
};

/** Tap squares in a grid to shade exactly `target` of them. */
export type ShadeQuestion = Base & {
  kind: "shade";
  rows: number;
  cols: number;
  target: number;
};

export type Question = ChoiceQuestion | FillQuestion | ShadeQuestion;

export type LessonContent = {
  id: string;
  title: string;
  questions: Question[];
};
