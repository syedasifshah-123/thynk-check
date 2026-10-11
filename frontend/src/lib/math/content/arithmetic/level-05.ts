import type { LevelContent } from "../../schema";
import { choice, ex, fill, grid100, line, num, order, slot, tapLine } from "../builders";

const PV = "Decimal place value";
const CALC = "Calculating";
const ROUND = "Rounding";

export const LEVEL_5: LevelContent = {
  intro: {
    title: "Places after the point",
    body: [
      "Place value keeps going to the right of the decimal point: tenths, then hundredths, then thousandths.",
      "This grid has 100 squares and 37 are shaded: 37 hundredths, written 0.37.",
      "When you add or subtract decimals, line up the decimal points so tenths stay with tenths.",
    ],
    visual: grid100(37),
  },
  example: {
    title: "Worked example",
    problem: "Work out 3.75 + 2.6.",
    steps: [
      "Line up the decimal points. Write 2.6 as 2.60 so both have two decimal places.",
      "Hundredths: 5 + 0 = 5.",
      "Tenths: 7 + 6 = 13 → write 3, carry 1.",
      "Ones: 3 + 2 + 1 = 6.",
    ],
    answer: "6.35",
  },
  exercises: [
    // ── Easy ──
    ex("ar5-e01", "easy", PV, "Tenths and hundredths", "What decimal does the shaded part of the grid show?", num(0.37), {
      visual: grid100(37),
      hints: ["The grid is 100 squares. How many hundredths are shaded?"],
      steps: ["37 out of 100 squares are shaded.", "37 hundredths = 0.37."],
      why: "Each small square is one hundredth, so 37 of them make 0.37.",
      wrong: [{ match: 37, message: "37 is the count of squares. As part of the whole grid, that's 37 hundredths." }],
    }),
    ex("ar5-e02", "easy", PV, "Tenths and hundredths", "What is the value of the 4 in 2.48?", choice(["4 tenths", "4 hundredths", "4 ones", "40"], 0), {
      hints: ["The first place after the point is tenths."],
      steps: ["2 is ones, 4 is tenths, 8 is hundredths."],
      why: "The first digit after the decimal point counts tenths.",
    }),
    ex("ar5-e03", "easy", PV, "Decimals on a number line", "Tap 0.7 on the number line.", tapLine(0, 1, 0.1, 0.7, [0, 0.5, 1]), {
      hints: ["Each tick is one tenth. Count on from 0.5."],
      steps: ["0.5 is labelled.", "Two more ticks: 0.6, 0.7."],
      why: "There are ten tenths between 0 and 1; 0.7 is the seventh.",
    }),
    ex("ar5-e04", "easy", PV, "Comparing decimals", "Which is larger?", choice(["0.5", "0.45"], 0), {
      hints: ["Compare tenths first: 5 tenths vs 4 tenths."],
      steps: ["0.5 = 0.50.", "50 hundredths > 45 hundredths."],
      why: "More digits doesn't mean bigger. Compare place by place, starting with tenths.",
      wrong: [{ match: 1, message: "0.45 has more digits but only 4 tenths. 0.5 has 5 tenths." }],
    }),
    ex("ar5-e05", "easy", CALC, "Adding and subtracting decimals", "Work out 2.5 + 1.3.", num(3.8), {
      hints: ["Add the tenths, then the ones."],
      steps: ["Tenths: 5 + 3 = 8.", "Ones: 2 + 1 = 3.", "3.8."],
      why: "Lined up by the decimal point, each place adds just like whole numbers.",
    }),
    ex("ar5-e06", "easy", CALC, "Multiplying by 10, 100, 1000", "Work out 3.6 × 10.", num(36), {
      hints: ["Multiplying by 10 moves every digit one place to the left."],
      steps: ["3 ones → 3 tens; 6 tenths → 6 ones.", "3.6 × 10 = 36."],
      why: "Each digit becomes ten times bigger, so the 6 tenths become 6 ones.",
      wrong: [{ match: 3.60, message: "Adding a zero after a decimal doesn't change it. Move the digits instead." }],
    }),
    ex("ar5-e07", "easy", CALC, "Multiplying by 10, 100, 1000", "Work out 45 ÷ 100.", num(0.45), {
      hints: ["Dividing by 100 moves digits two places to the right."],
      steps: ["4 tens → 4 tenths; 5 ones → 5 hundredths.", "0.45."],
      why: "Dividing by 100 makes every digit a hundred times smaller.",
    }),
    ex("ar5-e08", "easy", ROUND, "Nearest whole number", "Round 6.7 to the nearest whole number.", num(7), {
      hints: ["Is 6.7 closer to 6 or to 7?"],
      steps: ["The tenths digit is 7, which is 5 or more.", "Round up to 7."],
      why: "6.7 is only 0.3 away from 7 but 0.7 away from 6.",
    }),
    ex("ar5-e09", "easy", CALC, "Decimal ⇄ fraction", "Write 3/10 as a decimal.", num(0.3), {
      hints: ["Tenths go in the first place after the point."],
      steps: ["3 tenths = 0.3."],
      why: "The first decimal place counts tenths, so 3/10 = 0.3.",
    }),
    ex("ar5-e10", "easy", PV, "Comparing decimals", "Put these decimals in order.", order(["0.09", "0.35", "0.4"]), {
      hints: ["Write them all with two decimal places."],
      steps: ["0.09, 0.35, 0.40.", "9 < 35 < 40 hundredths."],
      why: "Giving every number the same number of decimal places makes comparing easy.",
    }),

    // ── Medium ──
    ex("ar5-m01", "medium", CALC, "Adding and subtracting decimals", "Work out 3.75 + 2.6.", num(6.35), {
      hints: ["Line up the decimal points. 2.6 = 2.60."],
      steps: ["3.75 + 2.60.", "Hundredths 5, tenths 7 + 6 = 13 (carry 1), ones 3 + 2 + 1 = 6.", "6.35."],
      why: "Lining up the points keeps tenths with tenths and hundredths with hundredths.",
      wrong: [{ match: 4.01, message: "It looks like the digits were lined up on the right instead of at the decimal point." }],
    }),
    ex("ar5-m02", "medium", CALC, "Adding and subtracting decimals", "Work out 10 − 3.45.", num(6.55), {
      hints: ["Count up from 3.45: to 4, then to 10."],
      steps: ["3.45 → 4 is 0.55.", "4 → 10 is 6.", "0.55 + 6 = 6.55."],
      why: "Counting up through whole numbers avoids borrowing across the decimal point.",
    }),
    ex("ar5-m03", "medium", CALC, "Multiplying and dividing decimals", "Work out 0.6 × 4.", num(2.4), {
      hints: ["6 tenths × 4 = how many tenths?"],
      steps: ["6 × 4 = 24.", "24 tenths = 2.4."],
      why: "Multiply as whole numbers, then keep track of the tenths.",
      wrong: [{ match: 0.24, message: "24 tenths is 2.4, not 24 hundredths." }],
    }),
    ex("ar5-m04", "medium", ROUND, "Decimal places", "Round 3.456 to 1 decimal place.", num(3.5), {
      hints: ["Look at the hundredths digit to decide."],
      steps: ["1 d.p. means keep the tenths: 3.4…", "The next digit is 5, so round up.", "3.5."],
      why: "The hundredths digit (5) is 5 or more, so the tenths digit goes up by one.",
      wrong: [{ match: 3.4, message: "The digit after the tenths is 5, which rounds up." }],
    }),
    ex("ar5-m05", "medium", ROUND, "Decimal places", "Round 12.349 to 2 decimal places.", num(12.35), {
      hints: ["Keep two digits after the point and look at the third."],
      steps: ["12.34|9.", "9 is 5 or more, so round up the 4.", "12.35."],
      why: "The thousandths digit 9 pushes the hundredths digit up from 4 to 5.",
    }),
    ex("ar5-m06", "medium", CALC, "Decimal ⇄ fraction", "Which is the same as 0.25?", choice(["1/4", "2/5", "1/25", "25/10"], 0), {
      hints: ["0.25 = 25/100. Simplify."],
      steps: ["25/100 = 1/4 (divide by 25)."],
      why: "0.25 is 25 hundredths, and 25 out of 100 is one quarter.",
    }),
    ex("ar5-m07", "medium", CALC, "Multiplying by 10, 100, 1000", "Work out 7.2 ÷ 100.", num(0.072), {
      hints: ["Move each digit two places to the right."],
      steps: ["7.2 ÷ 10 = 0.72.", "0.72 ÷ 10 = 0.072."],
      why: "Dividing by 100 shifts every digit two places right; a 0 fills the tenths.",
    }),
    ex("ar5-m08", "medium", CALC, "Multiplying and dividing decimals", "Pens cost 1.35 each. How much do 4 pens cost?", num(5.4), {
      hints: ["Double 1.35, then double again."],
      steps: ["1.35 × 2 = 2.70.", "2.70 × 2 = 5.40."],
      why: "Four lots of 1.35 is 5.40: doubling twice is the same as × 4.",
    }),
    ex("ar5-m09", "medium", PV, "Decimals on a number line", "What number is the arrow pointing to?", choice(["2.4", "2.6", "2.7", "2.06"], 1), {
      visual: line(2, 3, 0.1, 2.6, [2, 3]),
      hints: ["Between 2 and 3 there are 10 jumps. Each is one tenth."],
      steps: ["Each tick is 0.1.", "The arrow is 6 ticks past 2.", "2.6."],
      why: "Six tenths past 2 is 2.6. (2.06 would be only six hundredths past 2.)",
    }),
    ex(
      "ar5-m10",
      "medium",
      CALC,
      "Decimal ⇄ fraction",
      "Drag the numbers to complete the equivalent fractions.",
      fill([["0.8", "=", slot(0), "/ 10", "=", slot(1), "/ 100"]], ["8", "80", "0.8", "18"], ["8", "80"]),
      {
        hints: ["0.8 is 8 tenths. How many hundredths is that?"],
        steps: ["0.8 = 8/10.", "8/10 = 80/100."],
        why: "Each tenth is ten hundredths, so 8 tenths is 80 hundredths.",
      },
    ),

    // ── Hard ──
    ex("ar5-h01", "hard", CALC, "Multiplying and dividing decimals", "Work out 4.8 × 2.5.", num(12), {
      hints: ["Try 4.8 × 2 + 4.8 × 0.5."],
      steps: ["4.8 × 2 = 9.6.", "4.8 × 0.5 = 2.4.", "9.6 + 2.4 = 12."],
      why: "Splitting 2.5 into 2 and a half makes the multiplication mental.",
    }),
    ex("ar5-h02", "hard", CALC, "Multiplying and dividing decimals", "Work out 9.6 ÷ 0.3.", num(32), {
      hints: ["Multiply both numbers by 10 so you divide by a whole number."],
      steps: ["9.6 ÷ 0.3 = 96 ÷ 3.", "96 ÷ 3 = 32."],
      why: "Scaling both numbers by 10 keeps the answer the same but removes the decimal divisor.",
      wrong: [{ match: 3.2, message: "Dividing by a number less than 1 makes the answer bigger. Try 96 ÷ 3." }],
    }),
    ex("ar5-h03", "hard", ROUND, "Estimation", "Estimate 7.8 × 4.1 by rounding each number to the nearest whole number.", num(32), {
      hints: ["7.8 ≈ 8 and 4.1 ≈ 4."],
      steps: ["8 × 4 = 32."],
      why: "Rounding first gives a quick estimate (the exact answer is 31.98).",
    }),
    ex("ar5-h04", "hard", PV, "Comparing decimals", "Put these decimals in order.", order(["1.052", "1.205", "1.25", "1.502"]), {
      hints: ["Give them all three decimal places, then compare."],
      steps: ["1.052, 1.205, 1.250, 1.502.", "Compare as thousandths: 1052 < 1205 < 1250 < 1502."],
      why: "Writing 1.25 as 1.250 shows it sits between 1.205 and 1.502.",
    }),
    ex("ar5-h05", "hard", CALC, "Multiplying and dividing decimals", "A runner runs 3.75 km a day for 6 days. How far does she run in total?", num(22.5, { unit: "km" }), {
      hints: ["3.75 × 6: try 3 × 6 + 0.75 × 6."],
      steps: ["3 × 6 = 18.", "0.75 × 6 = 4.5.", "18 + 4.5 = 22.5 km."],
      why: "Splitting into the whole and decimal parts makes the multiplication manageable.",
    }),

    // ── Mastery ──
    ex("ar5-x01", "mastery", CALC, "Adding and subtracting decimals", "Work out 12.6 − 4.75.", num(7.85), {
      hints: ["Write 12.6 as 12.60, then subtract."],
      steps: ["12.60 − 4.75.", "Count up: 4.75 → 5 is 0.25; 5 → 12.6 is 7.6.", "0.25 + 7.6 = 7.85."],
      why: "Matching decimal places (12.60) keeps every column aligned.",
    }),
    ex("ar5-x02", "mastery", CALC, "Multiplying by 10, 100, 1000", "Work out 0.35 × 1,000.", num(350), {
      hints: ["Move each digit three places to the left."],
      steps: ["0.35 × 10 = 3.5; × 10 = 35; × 10 = 350."],
      why: "Multiplying by 1,000 shifts every digit three places left.",
    }),
    ex("ar5-x03", "mastery", ROUND, "Decimal places", "Round 0.0486 to 2 decimal places.", num(0.05), {
      hints: ["Keep two digits after the point (0.04…) and look at the next digit."],
      steps: ["0.04|86.", "8 is 5 or more, so round 0.04 up to 0.05."],
      why: "The third decimal digit (8) rounds the hundredths up from 4 to 5.",
    }),
    ex("ar5-x04", "mastery", CALC, "Decimal ⇄ fraction", "Write 7/8 as a decimal.", num(0.875), {
      hints: ["1/8 = 0.125. What is 7 of those?"],
      steps: ["1/8 = 0.125.", "7 × 0.125 = 0.875."],
      why: "Knowing 1/8 = 0.125 lets you scale up to 7/8.",
    }),
    ex("ar5-x05", "mastery", CALC, "Multiplying and dividing decimals", "Work out 6.3 ÷ 0.7.", num(9), {
      hints: ["Multiply both by 10."],
      steps: ["6.3 ÷ 0.7 = 63 ÷ 7 = 9."],
      why: "Scaling both numbers by 10 gives a times-table fact: 63 ÷ 7 = 9.",
    }),
  ],
};
