import type { ScaleItem } from "@/components/lesson/scale";
import type { Question } from "@/components/lesson/types";

// Section 3 · Unit 2 — One-Step & Two-Step Equations. Lesson id → questions.

const tri = (label?: string): ScaleItem => ({ kind: "triangle", label });
const sq = (): ScaleItem => ({ kind: "square" });
const circle = (label?: string): ScaleItem => ({ kind: "circle", label });
const weight = (label: string): ScaleItem => ({ kind: "weight", label });

export const ALGEBRA_U2: Record<string, Question[]> = {
  "weigh-it-out": [
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
      visual: { type: "scale", stacks: [[tri()], [tri()]], reading: "8" },
      options: ["2", "4", "6", "8"],
      answer: 1,
      hint: "The two triangles are identical, so they share the 8 equally.",
      why: "Two equal triangles weigh 8 together, so one weighs 8 ÷ 2 = 4.",
    },
    {
      id: "square",
      kind: "choice",
      prompt: "What's the weight of one square?",
      visual: { type: "scale", stacks: [[sq()], [sq()], [weight("10")]], reading: "16" },
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
      visual: { type: "scale", stacks: [[circle("c")], [tri("t")]], reading: "12" },
      options: ["2t = 12", "c − t = 12", "c + t = 12", "ct = 12"],
      answer: 2,
      hint: "A scale adds up everything that's on it.",
      why: "The scale adds the weights together: one circle (c) plus one triangle (t) reads 12, so c + t = 12.",
    },
  ],

  "balancing-act": [
    {
      id: "three-triangles",
      kind: "choice",
      prompt: "What's the weight of one triangle?",
      visual: { type: "scale", stacks: [[tri(), tri()], [tri()], [weight("2")]], reading: "14" },
      options: ["3", "4", "5", "6"],
      answer: 1,
      hint: "Take off the 2 first, then share what's left between the three triangles.",
      why: "14 − 2 = 12 is left for three triangles, so one triangle weighs 12 ÷ 3 = 4.",
    },
    {
      id: "expand",
      kind: "fill",
      prompt: "Drag the tiles to expand the brackets.",
      lines: [
        ["2", "(", "x", "+", "5", ")"],
        ["=", { slot: 0 }, "x", "+", { slot: 1 }],
      ],
      tiles: ["2", "5", "7", "10", "25"],
      answer: ["2", "10"],
      hint: "Multiply the 2 outside by everything inside the brackets.",
      why: "2 × x = 2x and 2 × 5 = 10, so 2(x + 5) = 2x + 10.",
    },
    {
      id: "circles",
      kind: "choice",
      intro: "A triangle weighs 6.",
      prompt: "What's the weight of one circle?",
      visual: { type: "scale", stacks: [[circle("c")], [circle("c")], [tri("t")]], reading: "20" },
      options: ["5", "7", "10", "14"],
      answer: 1,
      hint: "Remove the triangle's 6 from the reading first.",
      why: "20 − 6 = 14 is left for two circles, so one circle weighs 14 ÷ 2 = 7.",
    },
    {
      id: "write-equation",
      kind: "choice",
      intro: "Let s be the weight of one square.",
      prompt: "Which equation matches the scale?",
      visual: { type: "scale", stacks: [[sq(), sq()], [sq()], [weight("4")]], reading: "19" },
      options: ["3s + 4 = 19", "s + 4 = 19", "3 + s + 4 = 19", "3s = 19 + 4"],
      answer: 0,
      hint: "Count the squares. Three of them weigh 3s together.",
      why: "Three squares weigh 3s. Add the 4 weight and the scale reads 19, so 3s + 4 = 19.",
    },
    {
      id: "solve",
      kind: "fill",
      prompt: "Now solve it. Drag the tiles.",
      lines: [
        ["3s", "+", "4", "=", "19"],
        ["3s", "=", { slot: 0 }],
        ["s", "=", { slot: 1 }],
      ],
      tiles: ["3", "5", "15", "19", "23"],
      answer: ["15", "5"],
      hint: "Take 4 away from both sides, then divide by 3.",
      why: "19 − 4 = 15, so 3s = 15. Dividing both sides by 3 gives s = 5.",
    },
  ],
};
