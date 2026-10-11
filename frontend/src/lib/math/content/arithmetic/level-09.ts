import type { LevelContent } from "../../schema";
import { choice, ex, num, order } from "../builders";

const BODMAS = "Order of operations";
const POWERS = "Powers";
const ROOTS = "Roots";

export const LEVEL_9: LevelContent = {
  intro: {
    title: "Which operation goes first?",
    body: [
      "Everyone agrees on one order so a calculation has one answer: Brackets, then Orders (powers and roots), then Division and Multiplication (left to right), then Addition and Subtraction (left to right). That's BODMAS.",
      "A power is repeated multiplication: 5² = 5 × 5 = 25 and 2³ = 2 × 2 × 2 = 8.",
      "A root undoes a power: √49 = 7 because 7² = 49.",
    ],
  },
  example: {
    title: "Worked example",
    problem: "Work out 3 + 4 × (6 − 2)².",
    steps: [
      "Brackets: 6 − 2 = 4.",
      "Orders (powers): 4² = 16.",
      "Multiplication: 4 × 16 = 64.",
      "Addition: 3 + 64 = 67.",
    ],
    answer: "67",
  },
  exercises: [
    // ── Easy ──
    ex("ar9-e01", "easy", BODMAS, "BODMAS/BIDMAS", "Work out 2 + 3 × 4.", num(14), {
      hints: ["Multiplication comes before addition."],
      steps: ["3 × 4 = 12.", "2 + 12 = 14."],
      why: "Multiplying first is the agreed rule, so 2 + 3 × 4 = 14.",
      wrong: [{ match: 20, message: "That adds first. Multiplication goes before addition: 3 × 4 first." }],
    }),
    ex("ar9-e02", "easy", BODMAS, "Brackets first", "Work out (2 + 3) × 4.", num(20), {
      hints: ["Brackets come first."],
      steps: ["2 + 3 = 5.", "5 × 4 = 20."],
      why: "Brackets override the usual order, so the addition happens first.",
      wrong: [{ match: 14, message: "The brackets say to add first: (2 + 3) = 5." }],
    }),
    ex("ar9-e03", "easy", POWERS, "Squares and cubes", "Work out 5².", num(25), {
      hints: ["5² means 5 × 5."],
      steps: ["5 × 5 = 25."],
      why: "Squaring multiplies a number by itself.",
      wrong: [{ match: 10, message: "5² is 5 × 5, not 5 × 2." }],
    }),
    ex("ar9-e04", "easy", ROOTS, "Square roots", "Work out √49.", num(7), {
      hints: ["Which number times itself is 49?"],
      steps: ["7 × 7 = 49, so √49 = 7."],
      why: "A square root undoes squaring.",
    }),
    ex("ar9-e05", "easy", POWERS, "Squares and cubes", "Work out 2³.", num(8), {
      hints: ["2³ means 2 × 2 × 2."],
      steps: ["2 × 2 = 4.", "4 × 2 = 8."],
      why: "The small 3 says how many 2s to multiply together.",
      wrong: [{ match: 6, message: "2³ is 2 × 2 × 2, not 2 × 3." }],
    }),
    ex("ar9-e06", "easy", BODMAS, "BODMAS/BIDMAS", "Work out 20 − 12 ÷ 4.", num(17), {
      hints: ["Division comes before subtraction."],
      steps: ["12 ÷ 4 = 3.", "20 − 3 = 17."],
      why: "Divide first, then subtract.",
      wrong: [{ match: 2, message: "That subtracts first. Do 12 ÷ 4 before taking it from 20." }],
    }),
    ex("ar9-e07", "easy", BODMAS, "BODMAS/BIDMAS", "In 8 + 6 × 2, which part do you work out first?", choice(["6 × 2", "8 + 6"], 0), {
      hints: ["Multiplication beats addition."],
      steps: ["6 × 2 = 12 first, then 8 + 12 = 20."],
      why: "M comes before A in BODMAS.",
    }),
    ex("ar9-e08", "easy", POWERS, "Powers of 10", "Work out 10².", num(100), {
      hints: ["10 × 10."],
      steps: ["10 × 10 = 100."],
      why: "10² has two zeros: 100.",
    }),
    ex("ar9-e09", "easy", ROOTS, "Square roots", "Work out √100.", num(10), {
      hints: ["Which number squared is 100?"],
      steps: ["10 × 10 = 100, so √100 = 10."],
      why: "10² = 100, so the square root of 100 is 10.",
    }),
    ex(
      "ar9-e10",
      "easy",
      BODMAS,
      "BODMAS/BIDMAS",
      "Put the steps for 4 + 3 × 2 in order.",
      order(["Multiply first: 3 × 2 = 6", "Then add: 4 + 6", "Answer: 10"], "first step first"),
      {
        hints: ["Which operation comes first in BODMAS?"],
        steps: ["Multiplication, then addition, then the answer."],
        why: "Multiplying before adding gives 10.",
      },
    ),

    // ── Medium ──
    ex("ar9-m01", "medium", BODMAS, "Brackets first", "Work out 3 + 4 × (6 − 2)².", num(67), {
      hints: ["Brackets → power → multiply → add."],
      steps: ["(6 − 2) = 4.", "4² = 16.", "4 × 16 = 64.", "3 + 64 = 67."],
      why: "Following BODMAS step by step gives one clear answer.",
      wrong: [{ match: 112, message: "That added 3 + 4 too early. Multiplication comes before addition." }],
    }),
    ex("ar9-m02", "medium", BODMAS, "Left-to-right rules", "Work out 18 ÷ 3 × 2.", num(12), {
      hints: ["Division and multiplication have equal priority: go left to right."],
      steps: ["18 ÷ 3 = 6.", "6 × 2 = 12."],
      why: "With equal-priority operations, work from left to right.",
      wrong: [{ match: 3, message: "That multiplied first. Division and multiplication go left to right." }],
    }),
    ex("ar9-m03", "medium", BODMAS, "Brackets first", "Work out (8 − 3)² − 4.", num(21), {
      hints: ["Brackets, then the power, then subtract."],
      steps: ["8 − 3 = 5.", "5² = 25.", "25 − 4 = 21."],
      why: "The square applies to the whole bracket.",
    }),
    ex("ar9-m04", "medium", POWERS, "Index notation", "Work out 4³.", num(64), {
      hints: ["4 × 4 × 4."],
      steps: ["4 × 4 = 16.", "16 × 4 = 64."],
      why: "Cubing multiplies three 4s together.",
      wrong: [{ match: 12, message: "4³ means 4 × 4 × 4, not 4 × 3." }],
    }),
    ex("ar9-m05", "medium", ROOTS, "Square roots", "Work out √144 + √25.", num(17), {
      hints: ["Find each root separately."],
      steps: ["√144 = 12.", "√25 = 5.", "12 + 5 = 17."],
      why: "Roots are worked out before adding.",
      wrong: [{ match: 13, message: "√(144 + 25) = 13, but here each root is taken separately." }],
    }),
    ex("ar9-m06", "medium", POWERS, "Powers of 10", "Work out 7 × 10³.", num(7000), {
      hints: ["10³ = 1,000."],
      steps: ["10³ = 1,000.", "7 × 1,000 = 7,000."],
      why: "10³ is 1 followed by three zeros.",
    }),
    ex("ar9-m07", "medium", ROOTS, "Estimating roots", "√50 lies between which two whole numbers?", choice(["6 and 7", "7 and 8", "24 and 26", "49 and 51"], 1), {
      hints: ["Which square numbers are either side of 50?"],
      steps: ["7² = 49 and 8² = 64.", "50 is between 49 and 64, so √50 is between 7 and 8."],
      why: "Neighbouring square numbers trap the root.",
    }),
    ex("ar9-m08", "medium", BODMAS, "Left-to-right rules", "Work out 36 ÷ (2 + 4) × 3.", num(18), {
      hints: ["Brackets first, then divide and multiply left to right."],
      steps: ["2 + 4 = 6.", "36 ÷ 6 = 6.", "6 × 3 = 18."],
      why: "After the bracket, ÷ and × go left to right.",
      wrong: [{ match: 2, message: "That multiplied 6 × 3 first. Go left to right: 36 ÷ 6, then × 3." }],
    }),
    ex(
      "ar9-m09",
      "medium",
      BODMAS,
      "Brackets first",
      "Where should brackets go to make the answer 20?  2 + 3 × 4",
      choice(["(2 + 3) × 4", "2 + (3 × 4)", "2 + 3 × (4)"], 0),
      {
        hints: ["Without brackets the answer is 14. Which grouping gives 20?"],
        steps: ["(2 + 3) × 4 = 5 × 4 = 20."],
        why: "Bracketing the addition forces it to happen before the multiplication.",
      },
    ),
    ex("ar9-m10", "medium", ROOTS, "Cube roots", "Work out ∛27.", num(3), {
      hints: ["Which number cubed is 27?"],
      steps: ["3 × 3 × 3 = 27, so ∛27 = 3."],
      why: "A cube root undoes cubing.",
      wrong: [{ match: 9, message: "9 × 9 × 9 is much more than 27. Try 3 × 3 × 3." }],
    }),

    // ── Hard ──
    ex("ar9-h01", "hard", BODMAS, "BODMAS/BIDMAS", "Work out 2 × 3² + (10 − 4) ÷ 2.", num(21), {
      hints: ["Brackets, then power, then × and ÷, then +."],
      steps: ["10 − 4 = 6.", "3² = 9.", "2 × 9 = 18 and 6 ÷ 2 = 3.", "18 + 3 = 21."],
      why: "Each operation waits its turn: B, O, then D/M, then A.",
      wrong: [{ match: 39, message: "The power only applies to 3, not 2 × 3. Square first: 3² = 9." }],
    }),
    ex("ar9-h02", "hard", POWERS, "Squares and cubes", "Work out (−3)².", num(9), {
      hints: ["The bracket means the whole of −3 is squared."],
      steps: ["(−3) × (−3) = 9."],
      why: "A negative times a negative is positive.",
      wrong: [{ match: -9, message: "(−3)² means (−3) × (−3), and two negatives make a positive." }],
    }),
    ex("ar9-h03", "hard", BODMAS, "BODMAS/BIDMAS", "Work out 5 + 2 × 3² − 4.", num(19), {
      hints: ["Power first, then multiply."],
      steps: ["3² = 9.", "2 × 9 = 18.", "5 + 18 − 4 = 19."],
      why: "Orders before multiplication, multiplication before addition and subtraction.",
    }),
    ex("ar9-h04", "hard", POWERS, "Index notation", "Which is the largest?", choice(["2⁵", "5²", "3³", "4²"], 0), {
      hints: ["Work out each power."],
      steps: ["2⁵ = 32, 5² = 25, 3³ = 27, 4² = 16."],
      why: "2⁵ = 2 × 2 × 2 × 2 × 2 = 32 is the biggest.",
      wrong: [{ match: 1, message: "5² = 25, but 2⁵ = 32 is bigger: five 2s multiplied together." }],
    }),
    ex("ar9-h05", "hard", ROOTS, "Square roots", "Work out √(9 × 16).", num(12), {
      hints: ["Multiply inside first, or use √9 × √16."],
      steps: ["9 × 16 = 144.", "√144 = 12.", "(Or √9 × √16 = 3 × 4 = 12.)"],
      why: "The root of a product is the product of the roots.",
    }),

    // ── Mastery ──
    ex("ar9-x01", "mastery", BODMAS, "BODMAS/BIDMAS", "Work out 50 − 2 × (3 + 4)² ÷ 7.", num(36), {
      hints: ["Brackets, power, then × and ÷ left to right, then subtract."],
      steps: ["3 + 4 = 7.", "7² = 49.", "2 × 49 = 98; 98 ÷ 7 = 14.", "50 − 14 = 36."],
      why: "BODMAS keeps the subtraction until last.",
    }),
    ex("ar9-x02", "mastery", POWERS, "Index notation", "Work out 4² + 3³ − 2⁴.", num(27), {
      hints: ["Work out each power first."],
      steps: ["4² = 16, 3³ = 27, 2⁴ = 16.", "16 + 27 − 16 = 27."],
      why: "Evaluate the powers, then add and subtract left to right.",
    }),
    ex("ar9-x03", "mastery", ROOTS, "Square roots", "Work out √64 × 2³.", num(64), {
      hints: ["Root and power first, then multiply."],
      steps: ["√64 = 8.", "2³ = 8.", "8 × 8 = 64."],
      why: "Both orders (root and power) come before multiplication.",
    }),
    ex("ar9-x04", "mastery", BODMAS, "Brackets first", "Work out (12 − 4 ÷ 2) × 3.", num(30), {
      hints: ["Inside the brackets, BODMAS still applies."],
      steps: ["Inside: 4 ÷ 2 = 2, then 12 − 2 = 10.", "10 × 3 = 30."],
      why: "Division beats subtraction even inside the brackets.",
      wrong: [{ match: 12, message: "Inside the brackets, divide 4 ÷ 2 before subtracting from 12." }],
    }),
    ex("ar9-x05", "mastery", BODMAS, "BODMAS/BIDMAS", "Work out 6 + 18 ÷ 3².", num(8), {
      hints: ["Power first, then divide, then add."],
      steps: ["3² = 9.", "18 ÷ 9 = 2.", "6 + 2 = 8."],
      why: "Orders, then division, then addition.",
      wrong: [{ match: 2.67, message: "Don't add 6 + 18 first: division (and the power) come before addition." }],
    }),
  ],
};
