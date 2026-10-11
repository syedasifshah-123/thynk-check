import type { ScaleItem } from "./scale";

/** Equation token: plain text, the variable "x" (shown as a chip), or a drop slot. */
export type Token = string | { slot: number };

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
  scale: { stacks: ScaleItem[][]; reading: string };
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

export type Question = ChoiceQuestion | FillQuestion;

const tri = (label?: string): ScaleItem => ({ kind: "triangle", label });
const sq = (): ScaleItem => ({ kind: "square" });

// A short, easy warm-up set (try-out content).
export const QUESTIONS: Question[] = [
  {
    id: "combine",
    kind: "fill",
    prompt: "Drag the tiles to finish the equation.",
    lines: [
      ["(", "x", "+", "3", ")", "+", "(", "x", "+", "4", ")"],
      ["=", { slot: 0 }, "x", "+", { slot: 1 }],
    ],
    tiles: ["1", "2", "3", "7", "12"],
    answer: ["2", "7"],
    hint: "Count the x's first, then add up the plain numbers.",
    why: "There are two x's, so together they make 2x. The numbers add up too: 3 + 4 = 7. So (x + 3) + (x + 4) = 2x + 7.",
  },
  {
    id: "triangle",
    kind: "choice",
    prompt: "What's the weight of one triangle?",
    scale: { stacks: [[tri()], [tri()]], reading: "8" },
    options: ["2", "4", "6", "8"],
    answer: 1,
    hint: "The two triangles are identical, so they share the 8 equally.",
    why: "Two equal triangles weigh 8 together, so one weighs 8 ÷ 2 = 4.",
  },
  {
    id: "square",
    kind: "choice",
    prompt: "What's the weight of one square?",
    scale: { stacks: [[sq()], [sq()], [{ kind: "weight", label: "10" }]], reading: "16" },
    options: ["1", "3", "5", "8"],
    answer: 1,
    hint: "Take the 10 weight off first. What's left for the squares?",
    why: "Remove the 10 weight: 16 − 10 = 6. Two squares weigh 6, so one square weighs 6 ÷ 2 = 3.",
  },
  {
    id: "letters",
    kind: "choice",
    intro: "We can use the letter c for the weight of a circle, and t for a triangle.",
    prompt: "Which equation matches the scale?",
    scale: { stacks: [[{ kind: "circle", label: "c" }], [tri("t")]], reading: "12" },
    options: ["2t = 12", "c − t = 12", "c + t = 12", "ct = 12"],
    answer: 2,
    hint: "A scale adds up everything that's on it.",
    why: "The scale adds the weights together: one circle (c) plus one triangle (t) reads 12, so c + t = 12.",
  },
];
