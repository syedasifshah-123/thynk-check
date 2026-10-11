// Answer checking, kept separate from the UI so it's deterministic and unit-tested.

import { equivalent } from "./expression";
import { gcd, nearlyEqual, parseNumber } from "./numbers";
import type { AnswerSpec, Exercise, Response, Validation } from "./schema";

const NUMBER_HELP = "Type a number, like 12, −3, 0.5 or 3/4.";

export function validate(answer: AnswerSpec, response: Response): Validation {
  switch (answer.type) {
    case "choice": {
      if (response.type !== "choice" || response.index === null) return { status: "invalid", message: "Pick an answer first." };
      return response.index === answer.correct ? { status: "correct" } : { status: "incorrect" };
    }

    case "numeric": {
      if (response.type !== "numeric" || !response.text.trim()) return { status: "invalid", message: NUMBER_HELP };
      const parsed = parseNumber(response.text);
      if (!parsed) return { status: "invalid", message: NUMBER_HELP };
      return nearlyEqual(parsed.value, answer.value, answer.tolerance) ? { status: "correct" } : { status: "incorrect" };
    }

    case "fraction": {
      if (response.type !== "fraction") return { status: "invalid", message: "Fill in the fraction." };
      const wholeText = response.whole.trim().replace(/[−–]/g, "-");
      if (!/^\d+$/.test(response.num.trim()) || !/^\d+$/.test(response.den.trim()) || (wholeText && !/^-?\d+$/.test(wholeText))) {
        return { status: "invalid", message: "Use whole numbers in each box." };
      }
      const den = Number(response.den);
      if (den === 0) return { status: "invalid", message: "The bottom number can't be 0." };
      const whole = wholeText ? Number(wholeText) : 0;
      const sign = whole < 0 ? -1 : 1;
      const num = sign * (Math.abs(whole) * den + Number(response.num)); // as an improper fraction num/den

      // Equal value? Cross-multiply with integers (no floating point error).
      if (num * answer.den !== answer.num * den) return { status: "incorrect" };

      if (answer.simplest && gcd(Number(response.num), den) !== 1) {
        const g = gcd(Number(response.num), den);
        return { status: "incorrect", message: `Right value, but not in simplest form yet. Both numbers can be divided by ${g}.` };
      }
      if (answer.mixed && Number(response.num) >= den) {
        return { status: "incorrect", message: "Right value! Now write it as a mixed number: the top must be smaller than the bottom." };
      }
      return { status: "correct" };
    }

    case "expression": {
      if (response.type !== "expression" || !response.text.trim()) return { status: "invalid", message: "Type an expression first." };
      const result = equivalent(response.text, answer.expected, answer.variables);
      if (result === null) return { status: "invalid", message: "That expression couldn't be read. Check the brackets and symbols." };
      return result ? { status: "correct" } : { status: "incorrect" };
    }

    case "order": {
      if (response.type !== "order" || response.order.length !== answer.items.length) {
        return { status: "invalid", message: "Place every item first." };
      }
      // Compare text, so two identical items can be swapped freely.
      const ok = response.order.every((itemIndex, position) => answer.items[itemIndex] === answer.items[position]);
      return ok ? { status: "correct" } : { status: "incorrect" };
    }

    case "fill": {
      if (response.type !== "fill" || response.slots.some((s) => s === null)) return { status: "invalid", message: "Fill every box first." };
      const ok = response.slots.every((tile, i) => tile !== null && answer.tiles[tile] === answer.answer[i]);
      return ok ? { status: "correct" } : { status: "incorrect" };
    }

    case "shade": {
      if (response.type !== "shade") return { status: "invalid", message: "Shade some squares first." };
      const count = response.cells.filter(Boolean).length;
      if (count === 0) return { status: "invalid", message: "Shade some squares first." };
      return count === answer.target ? { status: "correct" } : { status: "incorrect", message: `You shaded ${count}.` };
    }

    case "numberLine": {
      if (response.type !== "numberLine" || response.value === null) return { status: "invalid", message: "Tap a point on the number line." };
      return nearlyEqual(response.value, answer.value) ? { status: "correct" } : { status: "incorrect" };
    }
  }
}

/** Validate, then attach the matching misconception message (if the wrong answer is a known one). */
export function validateExercise(exercise: Exercise, response: Response): Validation {
  const result = validate(exercise.answer, response);
  if (result.status !== "incorrect" || result.message || !exercise.misconceptions) return result;

  const hit = exercise.misconceptions.find((m) => {
    if (response.type === "choice") return m.match === response.index;
    if (response.type === "numeric" || response.type === "expression") {
      const got = parseNumber(response.text);
      const want = parseNumber(String(m.match));
      return got && want ? nearlyEqual(got.value, want.value) : response.text.trim() === String(m.match);
    }
    if (response.type === "numberLine") return Number(m.match) === response.value;
    if (response.type === "shade") return Number(m.match) === response.cells.filter(Boolean).length;
    return false;
  });
  return hit ? { status: "incorrect", message: hit.message } : result;
}

/** A response that is correct for this answer: used by tests and by "show me the answer". */
export function correctResponse(answer: AnswerSpec): Response {
  switch (answer.type) {
    case "choice":
      return { type: "choice", index: answer.correct };
    case "numeric":
      return { type: "numeric", text: String(answer.value) };
    case "fraction": {
      const g = answer.simplest || answer.mixed ? gcd(answer.num, answer.den) : 1;
      const num = answer.num / g;
      const den = answer.den / g;
      if (answer.mixed && Math.abs(num) >= den) {
        const whole = Math.trunc(num / den);
        return { type: "fraction", whole: String(whole), num: String(Math.abs(num) % den), den: String(den) };
      }
      return { type: "fraction", whole: "", num: String(num), den: String(den) };
    }
    case "expression":
      return { type: "expression", text: answer.expected };
    case "order":
      return { type: "order", order: answer.items.map((_, i) => i) };
    case "fill": {
      const used = new Set<number>();
      return {
        type: "fill",
        slots: answer.answer.map((text) => {
          const index = answer.tiles.findIndex((t, i) => t === text && !used.has(i));
          used.add(index);
          return index;
        }),
      };
    }
    case "shade":
      return { type: "shade", cells: Array.from({ length: answer.rows * answer.cols }, (_, i) => i < answer.target) };
    case "numberLine":
      return { type: "numberLine", value: answer.value };
  }
}

/** Human-readable correct answer, for the solution panel. */
export function answerText(answer: AnswerSpec): string {
  switch (answer.type) {
    case "choice":
      return answer.options[answer.correct];
    case "numeric":
      return `${answer.value < 0 ? `−${-answer.value}` : answer.value}${answer.unit ? ` ${answer.unit}` : ""}`;
    case "fraction": {
      const r = correctResponse(answer) as Extract<Response, { type: "fraction" }>;
      return r.whole ? `${r.whole} ${r.num}/${r.den}` : `${r.num}/${r.den}`;
    }
    case "expression":
      return answer.expected;
    case "order":
      return answer.items.join(", ");
    case "fill":
      return answer.answer.join(", ");
    case "shade":
      return `${answer.target} squares`;
    case "numberLine":
      return answer.value < 0 ? `−${-answer.value}` : String(answer.value);
  }
}
