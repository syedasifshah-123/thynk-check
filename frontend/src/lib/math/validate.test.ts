import { describe, expect, it } from "vitest";
import { equivalent } from "./expression";
import { parseNumber } from "./numbers";
import type { AnswerSpec, Exercise } from "./schema";
import { correctResponse, validate, validateExercise } from "./validate";

const numeric = (value: number, tolerance?: number): AnswerSpec => ({ type: "numeric", value, tolerance });
const status = (answer: AnswerSpec, text: string) => validate(answer, { type: "numeric", text }).status;

describe("parseNumber", () => {
  it("reads integers, decimals, negatives and the typographic minus", () => {
    expect(parseNumber("42")?.value).toBe(42);
    expect(parseNumber(" -3 ")?.value).toBe(-3);
    expect(parseNumber("−3")?.value).toBe(-3);
    expect(parseNumber(".5")?.value).toBe(0.5);
    expect(parseNumber("0.375")?.value).toBe(0.375);
  });

  it("reads fractions, mixed numbers, thousands separators and percentages", () => {
    expect(parseNumber("3/4")?.value).toBe(0.75);
    expect(parseNumber("-3 / 4")?.value).toBe(-0.75);
    expect(parseNumber("1 1/2")?.value).toBe(1.5);
    expect(parseNumber("−2 1/4")?.value).toBe(-2.25);
    expect(parseNumber("12,500")?.value).toBe(12500);
    expect(parseNumber("25%")?.value).toBe(25);
  });

  it("rejects garbage and zero denominators", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("3/0")).toBeNull();
    expect(parseNumber("1,25")).toBeNull();
  });
});

describe("numeric answers", () => {
  it("accepts any equivalent form", () => {
    expect(status(numeric(0.5), "1/2")).toBe("correct");
    expect(status(numeric(0.5), "0.50")).toBe("correct");
    expect(status(numeric(4.5), "4 1/2")).toBe("correct");
    expect(status(numeric(4.5), "9/2")).toBe("correct");
    expect(status(numeric(-4), "−4")).toBe("correct");
  });

  it("handles floating-point sums like 0.1 + 0.2", () => {
    expect(status(numeric(0.1 + 0.2), "0.3")).toBe("correct");
  });

  it("respects a custom tolerance", () => {
    expect(status(numeric(3.14159, 0.01), "3.14")).toBe("correct");
    expect(status(numeric(3.14159), "3.14")).toBe("incorrect");
  });

  it("treats unreadable input as invalid, not wrong", () => {
    expect(status(numeric(5), "")).toBe("invalid");
    expect(status(numeric(5), "five")).toBe("invalid");
  });

  it("gets the sign right", () => {
    expect(status(numeric(-4), "4")).toBe("incorrect");
  });
});

describe("fraction answers", () => {
  const f = (answer: AnswerSpec, whole: string, num: string, den: string) => validate(answer, { type: "fraction", whole, num, den });

  it("accepts equivalent fractions unless simplest form is required", () => {
    expect(f({ type: "fraction", num: 3, den: 4 }, "", "6", "8").status).toBe("correct");
    const simplest = f({ type: "fraction", num: 3, den: 4, simplest: true }, "", "6", "8");
    expect(simplest.status).toBe("incorrect");
    expect(simplest.status === "incorrect" && simplest.message).toMatch(/simplest/);
    expect(f({ type: "fraction", num: 3, den: 4, simplest: true }, "", "3", "4").status).toBe("correct");
  });

  it("checks mixed numbers, including negative ones", () => {
    const mixed: AnswerSpec = { type: "fraction", num: 7, den: 3, mixed: true };
    expect(f(mixed, "2", "1", "3").status).toBe("correct");
    expect(f(mixed, "", "7", "3").status).toBe("incorrect"); // right value, wrong form
    expect(f({ type: "fraction", num: -5, den: 2 }, "-2", "1", "2").status).toBe("correct");
    expect(f({ type: "fraction", num: -5, den: 2 }, "2", "1", "2").status).toBe("incorrect");
  });

  it("rejects bad input", () => {
    expect(f({ type: "fraction", num: 1, den: 2 }, "", "1", "0").status).toBe("invalid");
    expect(f({ type: "fraction", num: 1, den: 2 }, "", "a", "2").status).toBe("invalid");
  });
});

describe("expression equivalence", () => {
  it("treats algebraically equal expressions as equal", () => {
    expect(equivalent("2x + 6", "2(x+3)", ["x"])).toBe(true);
    expect(equivalent("6 + x*2", "2(x+3)", ["x"])).toBe(true);
    expect(equivalent("x^2 - 9", "(x-3)(x+3)", ["x"])).toBe(true);
    expect(equivalent("x·x", "x²", ["x"])).toBe(true);
    expect(equivalent("−(a − b)", "b - a", ["a", "b"])).toBe(true);
  });

  it("rejects different expressions and stray variables", () => {
    expect(equivalent("2x + 3", "2(x+3)", ["x"])).toBe(false);
    expect(equivalent("x^2 + 9", "(x-3)(x+3)", ["x"])).toBe(false);
    expect(equivalent("2y + 6", "2(x+3)", ["x"])).toBe(false);
  });

  it("returns null for unparseable input", () => {
    expect(equivalent("2x +", "2x", ["x"])).toBeNull();
    expect(equivalent("(x+1", "x+1", ["x"])).toBeNull();
  });
});

describe("other answer types", () => {
  it("orders by item text, so duplicate items can swap", () => {
    const answer: AnswerSpec = { type: "order", items: ["1", "2", "2", "3"] };
    expect(validate(answer, { type: "order", order: [0, 2, 1, 3] }).status).toBe("correct");
    expect(validate(answer, { type: "order", order: [3, 2, 1, 0] }).status).toBe("incorrect");
    expect(validate(answer, { type: "order", order: [0, 1] }).status).toBe("invalid");
  });

  it("checks fill slots by tile text and needs every slot filled", () => {
    const answer: AnswerSpec = { type: "fill", lines: [], tiles: ["4", "8", "4"], answer: ["4", "8"] };
    expect(validate(answer, { type: "fill", slots: [2, 1] }).status).toBe("correct");
    expect(validate(answer, { type: "fill", slots: [1, 0] }).status).toBe("incorrect");
    expect(validate(answer, { type: "fill", slots: [0, null] }).status).toBe("invalid");
  });

  it("counts shaded cells and number-line taps", () => {
    const shadeAnswer: AnswerSpec = { type: "shade", rows: 2, cols: 2, target: 3 };
    expect(validate(shadeAnswer, { type: "shade", cells: [true, true, false, true] }).status).toBe("correct");
    expect(validate(shadeAnswer, { type: "shade", cells: [false, false, false, false] }).status).toBe("invalid");
    const lineAnswer: AnswerSpec = { type: "numberLine", min: 0, max: 1, step: 0.1, value: 0.7 };
    expect(validate(lineAnswer, { type: "numberLine", value: 0.1 * 7 }).status).toBe("correct");
  });
});

describe("misconception feedback", () => {
  const exercise: Exercise = {
    id: "t1",
    difficulty: "easy",
    topic: "t",
    subtopic: "s",
    prompt: "2 + 3 × 4",
    answer: numeric(14),
    hints: [],
    steps: [],
    why: "",
    misconceptions: [{ match: 20, message: "Multiply first." }],
  };

  it("attaches the matching message to a known wrong answer", () => {
    const result = validateExercise(exercise, { type: "numeric", text: "20" });
    expect(result).toEqual({ status: "incorrect", message: "Multiply first." });
  });

  it("leaves other wrong answers without a message", () => {
    expect(validateExercise(exercise, { type: "numeric", text: "21" })).toEqual({ status: "incorrect" });
  });
});

describe("correctResponse", () => {
  it("builds a response that validates as correct for every answer type", () => {
    const answers: AnswerSpec[] = [
      { type: "choice", options: ["a", "b"], correct: 1 },
      numeric(-2.5),
      { type: "fraction", num: 53, den: 12, mixed: true, simplest: true },
      { type: "fraction", num: 6, den: 8, simplest: true },
      { type: "expression", expected: "2(x+1)", variables: ["x"] },
      { type: "order", items: ["a", "b", "c"] },
      { type: "fill", lines: [], tiles: ["1", "2"], answer: ["2", "1"] },
      { type: "shade", rows: 2, cols: 3, target: 4 },
      { type: "numberLine", min: -5, max: 5, step: 1, value: -2 },
    ];
    for (const answer of answers) expect(validate(answer, correctResponse(answer)).status, answer.type).toBe("correct");
  });
});
