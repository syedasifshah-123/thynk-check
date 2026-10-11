import type { LevelContent } from "../../schema";
import { bars, choice, ex, fill, frac, num, order, shade, slot, tapLine } from "../builders";

const UNDERSTAND = "Understanding fractions";
const EQUIV = "Equivalence";
const OPS = "Operations";

export const LEVEL_4: LevelContent = {
  intro: {
    title: "Parts of a whole",
    body: [
      "A fraction describes equal parts. The bottom number (denominator) says how many equal parts the whole is cut into; the top number (numerator) says how many you have.",
      "This bar is cut into 4 equal parts and 3 are shaded, so 3/4 is shaded.",
      "Different-looking fractions can be equal: 3/4 = 6/8 = 9/12. To add or subtract, first make the denominators match.",
    ],
    visual: bars({ parts: 4, shaded: 3 }),
  },
  example: {
    title: "Worked example",
    problem: "Work out 2/3 + 1/4.",
    steps: [
      "Thirds and quarters are different sizes, so find a common denominator: 12 works for both.",
      "2/3 = 8/12 (multiply top and bottom by 4).",
      "1/4 = 3/12 (multiply top and bottom by 3).",
      "8/12 + 3/12 = 11/12.",
    ],
    answer: "11/12",
  },
  exercises: [
    // ── Easy ──
    ex("ar4-e01", "easy", UNDERSTAND, "Numerator and denominator", "What fraction of the bar is shaded?", frac(2, 5), {
      visual: bars({ parts: 5, shaded: 2 }),
      instructions: "Type the top and bottom numbers.",
      hints: ["Count all the equal parts for the bottom number, then the shaded parts for the top."],
      steps: ["The bar has 5 equal parts → denominator 5.", "2 are shaded → numerator 2.", "2/5."],
      why: "The denominator counts equal parts in the whole; the numerator counts the shaded ones.",
    }),
    ex("ar4-e02", "easy", UNDERSTAND, "Parts of a whole", "Shade 3/4 of the grid.", shade(2, 4, 6), {
      hints: ["The grid has 8 squares. What is 3/4 of 8?"],
      steps: ["1/4 of 8 = 2.", "3/4 of 8 = 6.", "Shade any 6 squares."],
      why: "3/4 of the 8 squares is 6 squares, whichever 6 you choose.",
      wrong: [{ match: 3, message: "3 squares is 3/8 of this grid. The grid has 8 parts, so 3/4 needs 6." }],
    }),
    ex("ar4-e03", "easy", EQUIV, "Equivalent fractions", "Which fraction is equal to 1/2?", choice(["2/3", "3/6", "2/5", "1/4"], 1), {
      hints: ["A half means the top is exactly half of the bottom."],
      steps: ["3 is half of 6, so 3/6 = 1/2."],
      why: "Multiplying top and bottom of 1/2 by 3 gives 3/6, the same amount cut into more pieces.",
    }),
    ex("ar4-e04", "easy", UNDERSTAND, "Fractions on a number line", "Tap 3/4 on the number line.", tapLine(0, 1, 0.25, 0.75, [0, 1]), {
      hints: ["The line from 0 to 1 is split into 4 equal jumps."],
      steps: ["Each jump is 1/4.", "Three jumps from 0 is 3/4."],
      why: "Fractions are numbers too: 3/4 sits three quarters of the way from 0 to 1.",
    }),
    ex(
      "ar4-e05",
      "easy",
      UNDERSTAND,
      "Numerator and denominator",
      "In the fraction 5/8, what does the 8 tell you?",
      choice(["The whole is split into 8 equal parts", "8 parts are shaded", "There are 8 wholes", "5 is bigger than 8"], 0),
      {
        hints: ["The denominator is the bottom number."],
        steps: ["The denominator names the size of the parts: eighths."],
        why: "The bottom number says how many equal parts make one whole.",
      },
    ),
    ex("ar4-e06", "easy", EQUIV, "Simplifying", "Simplify 4/8.", frac(1, 2, { simplest: true }), {
      hints: ["What number divides both 4 and 8?"],
      steps: ["Divide top and bottom by 4.", "4 ÷ 4 = 1, 8 ÷ 4 = 2.", "4/8 = 1/2."],
      why: "Dividing top and bottom by the same number keeps the value but uses fewer, bigger parts.",
    }),
    ex("ar4-e07", "easy", EQUIV, "Comparing fractions", "Which symbol makes this true?  3/5 ___ 2/5", choice([">", "<", "="], 0), {
      hints: ["Both are fifths. Which has more of them?"],
      steps: ["Same denominator, so compare numerators: 3 > 2."],
      why: "When the parts are the same size, more parts means a bigger fraction.",
    }),
    ex("ar4-e08", "easy", OPS, "Fraction of an amount", "What is 1/4 of 20?", num(5), {
      hints: ["Finding a quarter means dividing by 4."],
      steps: ["20 ÷ 4 = 5."],
      why: "One quarter is one of 4 equal shares: 20 ÷ 4 = 5.",
    }),
    ex("ar4-e09", "easy", OPS, "Adding and subtracting", "Work out 1/5 + 2/5.", frac(3, 5, { simplest: true }), {
      hints: ["The parts are the same size (fifths). Just add how many there are."],
      steps: ["1 fifth + 2 fifths = 3 fifths.", "3/5."],
      why: "With equal denominators you add the numerators; the size of the parts doesn't change.",
    }),
    ex("ar4-e10", "easy", EQUIV, "Comparing fractions", "Put these fractions in order.", order(["1/8", "1/4", "1/2"]), {
      hints: ["With 1 on top, a bigger bottom number means smaller pieces."],
      steps: ["Halves are biggest, then quarters, then eighths.", "1/8 < 1/4 < 1/2."],
      why: "Cutting a whole into more pieces makes each piece smaller.",
    }),

    // ── Medium ──
    ex("ar4-m01", "medium", OPS, "Adding and subtracting", "Work out 2/3 + 1/4.", frac(11, 12, { simplest: true }), {
      hints: ["Find a denominator that both 3 and 4 divide into."],
      steps: ["Common denominator 12.", "2/3 = 8/12 and 1/4 = 3/12.", "8/12 + 3/12 = 11/12."],
      why: "You can only add parts of the same size, so convert both to twelfths first.",
    }),
    ex("ar4-m02", "medium", OPS, "Adding and subtracting", "Work out 3/4 − 1/3.", frac(5, 12, { simplest: true }), {
      hints: ["Use twelfths."],
      steps: ["3/4 = 9/12 and 1/3 = 4/12.", "9/12 − 4/12 = 5/12."],
      why: "Converting to a common denominator makes the pieces the same size before subtracting.",
    }),
    ex("ar4-m03", "medium", OPS, "Mixed and improper numbers", "Write 7/3 as a mixed number.", frac(7, 3, { mixed: true }), {
      hints: ["How many whole 3s fit in 7? What's left over?"],
      steps: ["7 ÷ 3 = 2 remainder 1.", "2 wholes and 1 third left: 2 1/3."],
      why: "Every 3 thirds make one whole, so 7 thirds is 2 wholes and 1 third.",
    }),
    ex("ar4-m04", "medium", OPS, "Mixed and improper numbers", "Write 2 3/5 as an improper fraction.", frac(13, 5), {
      hints: ["How many fifths are in 2 wholes?"],
      steps: ["2 wholes = 10 fifths.", "10 fifths + 3 fifths = 13 fifths.", "13/5."],
      why: "Multiply the whole by the denominator, then add the numerator: 2 × 5 + 3 = 13.",
    }),
    ex("ar4-m05", "medium", EQUIV, "Comparing fractions", "Which is larger?", choice(["3/4", "5/8", "They're equal"], 0), {
      hints: ["Change 3/4 into eighths."],
      steps: ["3/4 = 6/8.", "6/8 > 5/8."],
      why: "Converting to the same denominator lets you compare numerators directly.",
    }),
    ex("ar4-m06", "medium", OPS, "Fraction of an amount", "What is 2/3 of 18?", num(12), {
      hints: ["Find 1/3 first, then double it."],
      steps: ["1/3 of 18 = 6.", "2/3 = 2 × 6 = 12."],
      why: "Divide by the denominator to find one part, then multiply by the numerator.",
      wrong: [{ match: 6, message: "That's 1/3 of 18. You need two of those thirds." }],
    }),
    ex("ar4-m07", "medium", EQUIV, "Comparing fractions", "Which is bigger?", choice(["2/3", "3/4", "They're equal"], 1), {
      visual: bars({ parts: 3, shaded: 2, label: "2/3" }, { parts: 4, shaded: 3, label: "3/4" }),
      hints: ["Compare the shaded lengths, or convert both to twelfths."],
      steps: ["2/3 = 8/12.", "3/4 = 9/12.", "9/12 > 8/12, so 3/4 is bigger."],
      why: "3/4 leaves 1/4 unshaded, which is less than the 1/3 left by 2/3.",
    }),
    ex(
      "ar4-m08",
      "medium",
      EQUIV,
      "Equivalent fractions",
      "Drag the number that makes the fractions equal.",
      fill([["3/4", "=", slot(0), "/ 12"]], ["6", "8", "9", "12"], ["9"]),
      {
        hints: ["What do you multiply 4 by to get 12? Do the same to the top."],
        steps: ["4 × 3 = 12.", "3 × 3 = 9.", "3/4 = 9/12."],
        why: "Multiplying top and bottom by the same number gives an equivalent fraction.",
      },
    ),
    ex("ar4-m09", "medium", OPS, "Adding and subtracting", "Work out 5/6 − 1/2. Give your answer in simplest form.", frac(1, 3, { simplest: true }), {
      hints: ["Halves can be written as sixths."],
      steps: ["1/2 = 3/6.", "5/6 − 3/6 = 2/6.", "2/6 simplifies to 1/3."],
      why: "After subtracting, divide top and bottom by 2 to reach lowest terms.",
    }),
    ex("ar4-m10", "medium", EQUIV, "Comparing fractions", "Put these fractions in order.", order(["3/5", "2/3", "7/10"]), {
      hints: ["Turn each into a decimal, or use a common denominator of 30."],
      steps: ["3/5 = 18/30, 2/3 = 20/30, 7/10 = 21/30.", "So 3/5 < 2/3 < 7/10."],
      why: "A common denominator turns comparing fractions into comparing whole numbers.",
    }),

    // ── Hard ──
    ex("ar4-h01", "hard", OPS, "Mixed and improper numbers", "Work out 1 3/4 + 2 2/3. Give a mixed number.", frac(53, 12, { mixed: true, simplest: true }), {
      hints: ["Add the wholes, then add the fractions using twelfths."],
      steps: ["Wholes: 1 + 2 = 3.", "3/4 + 2/3 = 9/12 + 8/12 = 17/12 = 1 5/12.", "3 + 1 5/12 = 4 5/12."],
      why: "The fractions add to more than one whole, so 1 whole carries over into the whole-number part.",
    }),
    ex("ar4-h02", "hard", OPS, "Multiplying and dividing", "A recipe uses 3/4 cup of sugar per batch. How many cups for 6 batches?", num(4.5, { unit: "cups" }), {
      instructions: "You can answer as a decimal, a fraction or a mixed number.",
      hints: ["Multiply 3/4 by 6."],
      steps: ["3/4 × 6 = 18/4.", "18/4 = 4 2/4 = 4 1/2 cups."],
      why: "Six lots of three quarters is eighteen quarters, which is four and a half wholes.",
    }),
    ex("ar4-h03", "hard", OPS, "Multiplying and dividing", "Work out 2/3 × 3/5 in simplest form.", frac(2, 5, { simplest: true }), {
      hints: ["Multiply the tops together and the bottoms together."],
      steps: ["2 × 3 = 6; 3 × 5 = 15.", "6/15 simplifies to 2/5."],
      why: "Taking 2/3 of 3/5: multiply numerators and denominators, then simplify.",
    }),
    ex(
      "ar4-h04",
      "hard",
      OPS,
      "Adding and subtracting",
      "Sara ate 3/8 of a pizza and Leo ate 1/4 of it. What fraction is left?",
      choice(["3/8", "5/8", "1/2", "1/8"], 0),
      {
        hints: ["Find how much was eaten, then take it from 1 whole (8/8)."],
        steps: ["1/4 = 2/8.", "Eaten: 3/8 + 2/8 = 5/8.", "Left: 8/8 − 5/8 = 3/8."],
        why: "The whole pizza is 8/8; subtract the eaten 5/8.",
        wrong: [{ match: 1, message: "5/8 is how much was eaten. The question asks what's left." }],
      },
    ),
    ex("ar4-h05", "hard", OPS, "Multiplying and dividing", "Work out 3/4 ÷ 1/2.", frac(3, 2, { simplest: true }), {
      instructions: "An improper fraction is fine here.",
      hints: ["How many halves fit into three quarters? Or: multiply by the flipped fraction."],
      steps: ["3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4.", "6/4 = 3/2 (one and a half)."],
      why: "Dividing by 1/2 asks how many halves fit in: one and a half of them.",
    }),

    // ── Mastery ──
    ex("ar4-x01", "mastery", OPS, "Adding and subtracting", "Work out 5/6 + 3/4.", frac(19, 12, { simplest: true }), {
      instructions: "An improper fraction is fine here.",
      hints: ["Use twelfths."],
      steps: ["5/6 = 10/12 and 3/4 = 9/12.", "10/12 + 9/12 = 19/12."],
      why: "Converting to twelfths makes the parts equal size, then numerators add.",
    }),
    ex("ar4-x02", "mastery", EQUIV, "Simplifying", "Simplify 18/24.", frac(3, 4, { simplest: true }), {
      hints: ["Find the biggest number that divides both 18 and 24."],
      steps: ["The highest common factor is 6.", "18 ÷ 6 = 3, 24 ÷ 6 = 4.", "3/4."],
      why: "Dividing by the highest common factor reaches simplest form in one step.",
    }),
    ex("ar4-x03", "mastery", OPS, "Fraction of an amount", "What is 3/5 of 45?", num(27), {
      hints: ["Find 1/5 of 45 first."],
      steps: ["45 ÷ 5 = 9.", "3 × 9 = 27."],
      why: "One fifth is 9, so three fifths is 27.",
    }),
    ex("ar4-x04", "mastery", OPS, "Mixed and improper numbers", "Work out 4 1/2 − 1 3/4. Give a mixed number.", frac(11, 4, { mixed: true, simplest: true }), {
      hints: ["Convert both to quarters, or borrow a whole."],
      steps: ["4 1/2 = 18/4 and 1 3/4 = 7/4.", "18/4 − 7/4 = 11/4.", "11/4 = 2 3/4."],
      why: "Converting to improper fractions avoids the tricky borrow from the whole number.",
    }),
    ex("ar4-x05", "mastery", EQUIV, "Comparing fractions", "Which fraction is closest to 1?", choice(["7/8", "5/6", "9/10", "3/4"], 2), {
      hints: ["Look at how far each one is from 1: the missing piece."],
      steps: ["7/8 is 1/8 away; 5/6 is 1/6 away; 9/10 is 1/10 away; 3/4 is 1/4 away.", "1/10 is the smallest gap."],
      why: "The fraction with the smallest missing piece is closest to a whole.",
    }),
  ],
};
