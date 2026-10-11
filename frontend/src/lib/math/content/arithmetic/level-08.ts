import type { LevelContent } from "../../schema";
import { choice, ex, line, num, order, tapLine } from "../builders";

const NEG = "Negative numbers";
const ADDSUB = "Adding & subtracting";
const MULDIV = "Multiplying & dividing";

export const LEVEL_8: LevelContent = {
  intro: {
    title: "Below zero",
    body: [
      "Negative numbers sit to the left of 0 on the number line. Temperatures below freezing, debts and floors below ground are all negative.",
      "Adding moves right, subtracting moves left. Subtracting a negative is the same as adding: taking away a debt leaves you better off.",
      "When multiplying or dividing: same signs give a positive answer, different signs give a negative answer.",
    ],
    visual: { type: "thermometer", value: -3, min: -10, max: 10 },
  },
  example: {
    title: "Worked example",
    problem: "Work out −4 − (−7).",
    steps: [
      "Subtracting a negative is the same as adding its opposite: −4 − (−7) = −4 + 7.",
      "Start at −4 and move 7 to the right.",
      "−4 → 0 is 4 steps, then 3 more steps reaches 3.",
    ],
    answer: "3",
  },
  exercises: [
    // ── Easy ──
    ex("ar8-e01", "easy", NEG, "Real-life contexts", "What temperature does the thermometer show?", choice(["3°", "−3°", "−2°", "0°"], 1), {
      visual: { type: "thermometer", value: -3, min: -10, max: 10 },
      hints: ["Is the liquid above or below the 0 mark?"],
      steps: ["The liquid stops 3 marks below 0.", "That's −3°."],
      why: "Readings below zero are negative: 3 below 0 is −3.",
      wrong: [{ match: 0, message: "The liquid is below zero, so the temperature is negative." }],
    }),
    ex("ar8-e02", "easy", NEG, "The number line", "Tap −2 on the number line.", tapLine(-5, 5, 1, -2, [-5, 0, 5]), {
      hints: ["Negative numbers are to the LEFT of 0."],
      steps: ["Start at 0 and count 2 ticks to the left."],
      why: "−2 is 2 steps to the left of zero.",
    }),
    ex("ar8-e03", "easy", NEG, "Ordering integers", "Which temperature is colder?", choice(["−8°", "−3°"], 0), {
      hints: ["Colder means further left on the number line."],
      steps: ["−8 is 8 below zero; −3 is only 3 below.", "−8 is colder."],
      why: "The further below zero, the colder it is: −8 < −3.",
      wrong: [{ match: 1, message: "8 is bigger than 3, but −8 is further below zero than −3." }],
    }),
    ex("ar8-e04", "easy", ADDSUB, "Moving on the number line", "Work out −2 + 5.", num(3), {
      visual: line(-5, 5, 1, -2, [-5, 0, 5]),
      hints: ["Start at −2 and move 5 to the right."],
      steps: ["−2 → 0 is 2 steps.", "3 more steps reaches 3."],
      why: "Adding moves right on the number line: −2 + 5 = 3.",
      wrong: [{ match: -7, message: "Adding a positive moves right, towards bigger numbers." }],
    }),
    ex("ar8-e05", "easy", NEG, "Ordering integers", "Put these numbers in order.", order(["−4", "−1", "1"]), {
      hints: ["The smallest number is furthest left on the number line."],
      steps: ["−4 is furthest left, then −1, then 1."],
      why: "Negative numbers with bigger digits are smaller: −4 < −1 < 1.",
    }),
    ex("ar8-e06", "easy", ADDSUB, "Moving on the number line", "Work out 3 − 7.", num(-4), {
      hints: ["Start at 3 and move 7 to the left."],
      steps: ["3 → 0 is 3 steps.", "4 more steps left reaches −4."],
      why: "Subtracting more than you have takes you below zero.",
      wrong: [{ match: 4, message: "7 − 3 = 4, but this is 3 − 7. You go past zero." }],
    }),
    ex("ar8-e07", "easy", NEG, "Ordering integers", "Which number is the greatest?", choice(["−10", "−1", "−5", "−20"], 1), {
      hints: ["The greatest number is closest to zero (furthest right)."],
      steps: ["−1 is closest to 0."],
      why: "Among negatives, the one nearest zero is the largest.",
    }),
    ex("ar8-e08", "easy", NEG, "Real-life contexts", "The temperature is −6°. It rises by 9°. What is the new temperature?", num(3, { unit: "°" }), {
      hints: ["Rises means add: −6 + 9."],
      steps: ["−6 → 0 is 6.", "3 more gives 3°."],
      why: "Rising temperature moves up (right): −6 + 9 = 3.",
      wrong: [{ match: -15, message: "The temperature rises, so it gets warmer: add 9." }],
    }),
    ex("ar8-e09", "easy", MULDIV, "Sign rules", "Work out −3 × 4.", num(-12), {
      hints: ["Different signs give a negative answer."],
      steps: ["3 × 4 = 12.", "One negative → −12."],
      why: "Four lots of −3 is −12.",
      wrong: [{ match: 12, message: "One of the numbers is negative, so the product is negative." }],
    }),
    ex("ar8-e10", "easy", NEG, "The number line", "What is the opposite of −7?", choice(["7", "−7", "0", "1/7"], 0), {
      hints: ["Opposites are the same distance from 0, on different sides."],
      steps: ["−7 is 7 left of 0; its opposite is 7 right of 0."],
      why: "Opposites add to zero: −7 + 7 = 0.",
    }),

    // ── Medium ──
    ex("ar8-m01", "medium", ADDSUB, "Subtracting negatives", "Work out −4 − (−7).", num(3), {
      hints: ["Subtracting a negative is the same as adding."],
      steps: ["−4 − (−7) = −4 + 7.", "= 3."],
      why: "Removing a negative amount increases the total.",
      wrong: [{ match: -11, message: "Two minus signs here: subtracting −7 means adding 7." }],
    }),
    ex("ar8-m02", "medium", ADDSUB, "Moving on the number line", "Work out −6 + (−8).", num(-14), {
      hints: ["Adding a negative moves left."],
      steps: ["−6 + (−8) = −6 − 8.", "= −14."],
      why: "Combining two debts makes a bigger debt.",
      wrong: [{ match: 2, message: "Both numbers are negative, so the result is further below zero." }],
    }),
    ex("ar8-m03", "medium", MULDIV, "Sign rules", "Work out −5 × −6.", num(30), {
      hints: ["Same signs give a positive answer."],
      steps: ["5 × 6 = 30.", "Two negatives → positive: 30."],
      why: "A negative times a negative is positive.",
      wrong: [{ match: -30, message: "Two negative numbers multiply to give a positive." }],
    }),
    ex("ar8-m04", "medium", MULDIV, "Sign rules", "Work out −36 ÷ 4.", num(-9), {
      hints: ["Different signs give a negative answer."],
      steps: ["36 ÷ 4 = 9.", "Different signs → −9."],
      why: "Sharing a debt of 36 into 4 equal parts gives a debt of 9 each.",
    }),
    ex("ar8-m05", "medium", MULDIV, "Sign rules", "Work out −48 ÷ −6.", num(8), {
      hints: ["Same signs → positive."],
      steps: ["48 ÷ 6 = 8.", "Same signs → 8."],
      why: "The sign rules for division match those for multiplication.",
    }),
    ex("ar8-m06", "medium", NEG, "Ordering integers", "Put these numbers in order.", order(["−3", "−2.5", "−0.5", "0", "1.5"]), {
      hints: ["Picture them on a number line."],
      steps: ["Furthest left: −3, then −2.5, −0.5, 0, 1.5."],
      why: "−3 is further from zero (on the left) than −2.5, so it's smaller.",
    }),
    ex("ar8-m07", "medium", NEG, "Real-life contexts", "A lift is at floor −2 (underground). It goes up 7 floors. Which floor is it on now?", num(5), {
      hints: ["Going up means adding."],
      steps: ["−2 + 7 = 5."],
      why: "From −2, two floors up reaches ground (0), then 5 more.",
    }),
    ex("ar8-m08", "medium", NEG, "The number line", "What number is the arrow pointing to?", choice(["−6", "−4", "6", "−8"], 0), {
      visual: line(-10, 10, 2, -6, [-10, 0, 10]),
      hints: ["Each tick is 2. Count left from 0."],
      steps: ["0 → −2 → −4 → −6: three ticks left."],
      why: "Each jump is 2, and the arrow is three jumps left of zero.",
    }),
    ex("ar8-m09", "medium", ADDSUB, "Subtracting negatives", "Work out 7 − (−3) − 12.", num(-2), {
      hints: ["Rewrite subtracting −3 as adding 3."],
      steps: ["7 + 3 = 10.", "10 − 12 = −2."],
      why: "Working left to right after removing the double negative gives −2.",
    }),
    ex("ar8-m10", "medium", MULDIV, "Sign rules", "The product of two negative numbers is always…", choice(["Positive", "Negative", "Zero", "Could be either"], 0), {
      hints: ["Try an example, like −2 × −3."],
      steps: ["−2 × −3 = 6, which is positive."],
      why: "Same signs always multiply to a positive number.",
    }),

    // ── Hard ──
    ex("ar8-h01", "hard", MULDIV, "Mixed operations", "Work out (−3) × (−2) × (−5).", num(-30), {
      hints: ["Multiply two at a time and track the sign."],
      steps: ["(−3) × (−2) = 6.", "6 × (−5) = −30."],
      why: "Three negative factors give a negative product (an odd number of negatives).",
    }),
    ex("ar8-h02", "hard", NEG, "Real-life contexts", "The highest temperature was 14° and the lowest was −9°. What was the difference?", num(23, { unit: "°" }), {
      hints: ["Count from −9 up to 0, then up to 14."],
      steps: ["−9 → 0 is 9.", "0 → 14 is 14.", "9 + 14 = 23°."],
      why: "The gap crosses zero, so add the distances on each side.",
      wrong: [{ match: 5, message: "That's 14 − 9, but the low was −9, below zero. Count across zero." }],
    }),
    ex("ar8-h03", "hard", ADDSUB, "Subtracting negatives", "Work out −15 + 8 − (−4).", num(-3), {
      hints: ["Change − (−4) into + 4."],
      steps: ["−15 + 8 = −7.", "−7 + 4 = −3."],
      why: "After rewriting the double negative, add left to right.",
    }),
    ex(
      "ar8-h04",
      "hard",
      MULDIV,
      "Mixed operations",
      "Which expression has a positive answer?",
      choice(["−3 × −2 × −1", "−8 ÷ 2", "−5 − (−9)", "−2 + (−2)"], 2),
      {
        hints: ["Work out each one."],
        steps: ["−3 × −2 × −1 = −6.", "−8 ÷ 2 = −4.", "−5 − (−9) = −5 + 9 = 4.", "−2 + (−2) = −4."],
        why: "Only −5 − (−9) is positive: subtracting −9 adds 9.",
      },
    ),
    ex("ar8-h05", "hard", NEG, "Real-life contexts", "A bank balance is −45. You deposit 120, then withdraw 90. What is the balance?", num(-15), {
      hints: ["Deposit means add, withdraw means subtract."],
      steps: ["−45 + 120 = 75.", "75 − 90 = −15."],
      why: "Track each transaction in order: the account ends 15 in debt.",
    }),

    // ── Mastery ──
    ex("ar8-x01", "mastery", ADDSUB, "Moving on the number line", "Work out −9 − 14.", num(-23), {
      hints: ["Start at −9 and move 14 to the left."],
      steps: ["−9 − 14 = −23."],
      why: "Subtracting a positive moves further left.",
    }),
    ex("ar8-x02", "mastery", MULDIV, "Sign rules", "Work out −72 ÷ −8.", num(9), {
      hints: ["Same signs → positive."],
      steps: ["72 ÷ 8 = 9.", "Same signs → 9."],
      why: "Two negatives divide to a positive.",
    }),
    ex("ar8-x03", "mastery", MULDIV, "Mixed operations", "Work out (−4) × 7 + 10.", num(-18), {
      hints: ["Multiply first, then add."],
      steps: ["(−4) × 7 = −28.", "−28 + 10 = −18."],
      why: "Multiplication comes before addition; then −28 + 10 moves 10 to the right.",
    }),
    ex("ar8-x04", "mastery", NEG, "Real-life contexts", "A submarine is at −120 m. It rises 45 m, then dives 30 m. What is its depth now?", num(-105, { unit: "m" }), {
      hints: ["Rising adds, diving subtracts."],
      steps: ["−120 + 45 = −75.", "−75 − 30 = −105 m."],
      why: "Apply each move in order: up 45, then down 30.",
    }),
    ex("ar8-x05", "mastery", ADDSUB, "Subtracting negatives", "Work out −3 − (−3) − (−3).", num(3), {
      hints: ["Each “− (−3)” becomes “+ 3”."],
      steps: ["−3 + 3 + 3.", "= 3."],
      why: "Subtracting a negative twice adds 3 twice, leaving 3.",
    }),
  ],
};
