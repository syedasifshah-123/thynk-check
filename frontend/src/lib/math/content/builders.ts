// Small helpers so exercise banks read like content, not boilerplate.

import type { AnswerSpec, Difficulty, Exercise, Misconception, Token, Visual } from "../schema";

type Extra = {
  hints: string[];
  steps: string[];
  why: string;
  visual?: Visual;
  instructions?: string;
  wrong?: Misconception[];
  xp?: number;
  seconds?: number;
};

/** Build an exercise. `topic` and `subtopic` should match the level's curriculum. */
export function ex(
  id: string,
  difficulty: Difficulty,
  topic: string,
  subtopic: string,
  prompt: string,
  answer: AnswerSpec,
  { wrong, ...extra }: Extra,
): Exercise {
  return { id, difficulty, topic, subtopic, prompt, answer, misconceptions: wrong, ...extra };
}

export const choice = (options: string[], correct: number): AnswerSpec => ({ type: "choice", options, correct });
export const num = (value: number, opts: { unit?: string; tolerance?: number; placeholder?: string } = {}): AnswerSpec => ({
  type: "numeric",
  value,
  ...opts,
});
export const frac = (n: number, d: number, opts: { simplest?: boolean; mixed?: boolean } = {}): AnswerSpec => ({
  type: "fraction",
  num: n,
  den: d,
  ...opts,
});
export const order = (itemsInCorrectOrder: string[], direction = "smallest first"): AnswerSpec => ({
  type: "order",
  items: itemsInCorrectOrder,
  direction,
});
export const fill = (lines: Token[][], tiles: string[], answer: string[]): AnswerSpec => ({ type: "fill", lines, tiles, answer });
export const shade = (rows: number, cols: number, target: number): AnswerSpec => ({ type: "shade", rows, cols, target });
export const tapLine = (min: number, max: number, step: number, value: number, labels?: number[]): AnswerSpec => ({
  type: "numberLine",
  min,
  max,
  step,
  value,
  labels,
});

export const slot = (n: number): Token => ({ slot: n });

// Visual shorthands
export const dots = (...groups: number[]): Visual => ({ type: "dots", groups });
export const blocks = (hundreds: number, tens: number, ones: number): Visual => ({ type: "blocks", hundreds, tens, ones });
export const line = (min: number, max: number, step: number, marker?: number, labels?: number[]): Visual => ({
  type: "numberLine",
  min,
  max,
  step,
  marker,
  labels,
});
export const bars = (...list: { parts: number; shaded: number; label?: string }[]): Visual => ({ type: "fractionBars", bars: list });
export const grid100 = (shaded: number): Visual => ({ type: "percentGrid", shaded });
export const array = (rows: number, cols: number): Visual => ({ type: "array", rows, cols });
export const ratio = (...groups: { label: string; count: number; color: string }[]): Visual => ({ type: "ratio", groups });
