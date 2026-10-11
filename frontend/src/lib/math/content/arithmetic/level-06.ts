import type { LevelContent } from "../../schema";
import { choice, ex, frac, grid100, num, order, shade } from "../builders";

const MEANING = "Meaning of percent";
const OF = "Percent of an amount";
const CHANGE = "Change";

export const LEVEL_6: LevelContent = {
  intro: {
    title: "Percent means “out of 100”",
    body: [
      "A percentage is a fraction with 100 on the bottom: 25% = 25/100 = 1/4 = 0.25.",
      "To find a percentage of an amount, find 10% (divide by 10) or 1% (divide by 100), then build up.",
      "A percentage change compares the change to the ORIGINAL amount.",
    ],
    visual: grid100(25),
  },
  example: {
    title: "Worked example",
    problem: "Find 15% of 80.",
    steps: [
      "10% of 80 = 80 ÷ 10 = 8.",
      "5% is half of 10%: 8 ÷ 2 = 4.",
      "15% = 10% + 5% = 8 + 4.",
    ],
    answer: "12",
  },
  exercises: [
    // ── Easy ──
    ex("ar6-e01", "easy", MEANING, "Out of 100", "What percentage of the grid is shaded?", num(40, { unit: "%" }), {
      visual: grid100(40),
      hints: ["The grid has 100 squares. Count the shaded ones."],
      steps: ["40 of the 100 squares are shaded.", "40 out of 100 = 40%."],
      why: "Percent literally means per hundred, so 40 of 100 squares is 40%.",
    }),
    ex("ar6-e02", "easy", MEANING, "Percent ⇄ fraction ⇄ decimal", "50% is the same as…", choice(["1/2", "1/5", "1/50", "5/100"], 0), {
      hints: ["50% = 50/100. Simplify."],
      steps: ["50/100 = 1/2."],
      why: "50 out of 100 is half.",
      wrong: [{ match: 1, message: "1/5 is 20%. 50% is 50/100, which simplifies to 1/2." }],
    }),
    ex("ar6-e03", "easy", OF, "10%, 25%, 50% shortcuts", "Find 10% of 60.", num(6), {
      hints: ["10% is one tenth: divide by 10."],
      steps: ["60 ÷ 10 = 6."],
      why: "10% = 1/10, so divide by 10.",
    }),
    ex("ar6-e04", "easy", OF, "10%, 25%, 50% shortcuts", "Find 50% of 48.", num(24), {
      hints: ["50% is a half."],
      steps: ["48 ÷ 2 = 24."],
      why: "Half of 48 is 24.",
    }),
    ex("ar6-e05", "easy", MEANING, "Percent ⇄ fraction ⇄ decimal", "Write 0.3 as a percentage.", num(30, { unit: "%" }), {
      hints: ["Multiply the decimal by 100."],
      steps: ["0.3 × 100 = 30.", "30%."],
      why: "0.3 = 3 tenths = 30 hundredths = 30%.",
      wrong: [{ match: 3, message: "0.3 is 3 tenths, which is 30 hundredths: 30%." }],
    }),
    ex("ar6-e06", "easy", MEANING, "Out of 100", "Shade 30% of the grid.", shade(2, 5, 3), {
      hints: ["The grid has 10 squares. What is 30% of 10?"],
      steps: ["30% = 3/10.", "3/10 of 10 squares = 3 squares."],
      why: "30% of 10 is 3, because 10% of 10 is 1.",
    }),
    ex("ar6-e07", "easy", OF, "10%, 25%, 50% shortcuts", "Find 25% of 80.", num(20), {
      hints: ["25% is a quarter: halve, then halve again."],
      steps: ["80 ÷ 2 = 40.", "40 ÷ 2 = 20."],
      why: "25% = 1/4, and a quarter of 80 is 20.",
    }),
    ex("ar6-e08", "easy", MEANING, "Percent ⇄ fraction ⇄ decimal", "Which is the largest?", choice(["0.6", "55%", "1/2", "58%"], 0), {
      hints: ["Change everything to percentages."],
      steps: ["0.6 = 60%, 1/2 = 50%.", "60% is the largest."],
      why: "Converting to one form (percent) lets you compare directly: 60% beats 58%, 55% and 50%.",
    }),
    ex("ar6-e09", "easy", OF, "Any percentage", "Find 100% of 37.", num(37), {
      hints: ["100% means the whole amount."],
      steps: ["100% of anything is all of it: 37."],
      why: "100% = 100/100 = 1 whole.",
    }),
    ex("ar6-e10", "easy", MEANING, "Percent ⇄ fraction ⇄ decimal", "Write 20% as a fraction in simplest form.", frac(1, 5, { simplest: true }), {
      hints: ["20% = 20/100. Divide top and bottom by 20."],
      steps: ["20/100 = 1/5."],
      why: "20 out of 100 is the same as 1 out of 5.",
    }),

    // ── Medium ──
    ex("ar6-m01", "medium", OF, "Any percentage", "Find 15% of 80.", num(12), {
      hints: ["Find 10%, then 5% (half of 10%), and add."],
      steps: ["10% = 8.", "5% = 4.", "15% = 12."],
      why: "Breaking 15% into 10% + 5% uses two easy steps.",
    }),
    ex("ar6-m02", "medium", OF, "Any percentage", "Find 35% of 200.", num(70), {
      hints: ["1% of 200 is 2."],
      steps: ["1% = 2.", "35% = 35 × 2 = 70."],
      why: "Finding 1% first lets you scale to any percentage.",
    }),
    ex("ar6-m03", "medium", CHANGE, "Discounts and interest", "A $40 shirt is 25% off. What is the sale price?", num(30, { unit: "$" }), {
      hints: ["Find 25% of 40 (the discount), then subtract it."],
      steps: ["25% of 40 = 10.", "40 − 10 = 30."],
      why: "The sale price is the original minus the discount. (Or: you pay 75% of 40 = 30.)",
      wrong: [{ match: 10, message: "10 is the discount. The sale price is what's left: 40 − 10." }],
    }),
    ex("ar6-m04", "medium", CHANGE, "Percentage increase", "Increase 60 by 10%.", num(66), {
      hints: ["Find 10% of 60 and add it on."],
      steps: ["10% of 60 = 6.", "60 + 6 = 66."],
      why: "An increase adds the percentage of the original. (Or: 110% of 60 = 66.)",
      wrong: [{ match: 6, message: "6 is the increase. Add it to the original 60." }],
    }),
    ex("ar6-m05", "medium", CHANGE, "Percentage decrease", "Decrease 250 by 20%.", num(200), {
      hints: ["20% of 250 = ? Then subtract."],
      steps: ["10% of 250 = 25, so 20% = 50.", "250 − 50 = 200."],
      why: "Decreasing by 20% leaves 80%: 0.8 × 250 = 200.",
    }),
    ex("ar6-m06", "medium", MEANING, "One number as a percentage of another", "What percentage of 50 is 13?", num(26, { unit: "%" }), {
      hints: ["Write 13 out of 50 as a fraction, then make the bottom 100."],
      steps: ["13/50 = 26/100.", "26%."],
      why: "Doubling top and bottom turns 13/50 into 26 out of 100.",
    }),
    ex("ar6-m07", "medium", MEANING, "Percent ⇄ fraction ⇄ decimal", "Which is the same as 0.07?", choice(["7%", "70%", "0.7%", "700%"], 0), {
      hints: ["Multiply the decimal by 100."],
      steps: ["0.07 × 100 = 7.", "7%."],
      why: "0.07 is 7 hundredths, which is 7%.",
      wrong: [{ match: 1, message: "70% would be 0.7. 0.07 is only 7 hundredths." }],
    }),
    ex("ar6-m08", "medium", MEANING, "Percent ⇄ fraction ⇄ decimal", "Put these in order.", order(["0.35", "3/8", "0.4", "45%"]), {
      hints: ["Convert each to a decimal."],
      steps: ["0.35, 3/8 = 0.375, 0.4, 45% = 0.45."],
      why: "One common form (decimals) makes the order clear: 0.35 < 0.375 < 0.4 < 0.45.",
    }),
    ex("ar6-m09", "medium", CHANGE, "Percentage increase", "A price rises from 80 to 100. What is the percentage increase?", num(25, { unit: "%" }), {
      hints: ["Change ÷ ORIGINAL × 100."],
      steps: ["Change = 20.", "20 ÷ 80 = 0.25.", "25%."],
      why: "Percentage change is measured against the starting value, 80.",
      wrong: [{ match: 20, message: "20 is the change in price. As a percentage of the original 80, it's 20 ÷ 80." }],
    }),
    ex("ar6-m10", "medium", OF, "Any percentage", "Find 12.5% of 64.", num(8), {
      hints: ["12.5% is one eighth."],
      steps: ["12.5% = 1/8.", "64 ÷ 8 = 8."],
      why: "Recognising 12.5% as 1/8 turns it into a simple division.",
    }),

    // ── Hard ──
    ex("ar6-h01", "hard", OF, "Reverse percentages", "After a 20% discount, a bike costs 240. What was the original price?", num(300), {
      hints: ["240 is 80% of the original. Find 1% or 10% of the original."],
      steps: ["240 = 80% of the original.", "10% = 240 ÷ 8 = 30.", "100% = 300."],
      why: "Work back from the percentage you know (80%) to 100%.",
      wrong: [{ match: 288, message: "That adds 20% of the SALE price. The 20% was taken off the original, so 240 is 80%." }],
    }),
    ex("ar6-h02", "hard", CHANGE, "Percentage increase", "A population of 1,000 grows by 10%, then grows by another 10%. What is the final population?", num(1210), {
      hints: ["The second 10% is of the new, larger number."],
      steps: ["After year 1: 1,000 + 100 = 1,100.", "After year 2: 1,100 + 110 = 1,210."],
      why: "Each increase is applied to the current amount, so growth compounds.",
      wrong: [{ match: 1200, message: "The second 10% is 10% of 1,100, not of 1,000." }],
    }),
    ex("ar6-h03", "hard", MEANING, "One number as a percentage of another", "In a test you score 42 out of 60. What percentage is that?", num(70, { unit: "%" }), {
      hints: ["42/60 simplifies. Then make the bottom 100."],
      steps: ["42/60 = 7/10.", "7/10 = 70/100 = 70%."],
      why: "Simplifying the fraction first makes the conversion to 100 easy.",
    }),
    ex(
      "ar6-h04",
      "hard",
      CHANGE,
      "Discounts and interest",
      "Which saves more on a $50 jacket?",
      choice(["30% off", "$12 off", "They're the same"], 0),
      {
        hints: ["Work out how much 30% of $50 is."],
        steps: ["30% of 50 = 15.", "$15 off beats $12 off."],
        why: "Turning the percentage into an amount lets you compare like with like.",
      },
    ),
    ex("ar6-h05", "hard", CHANGE, "Percentage decrease", "A price falls from 160 to 120. What is the percentage decrease?", num(25, { unit: "%" }), {
      hints: ["Change ÷ original × 100."],
      steps: ["Change = 40.", "40 ÷ 160 = 0.25 = 25%."],
      why: "The decrease is compared to the original 160, not the new 120.",
      wrong: [{ match: 33.33, message: "That divides by the new price. Percentage change uses the original, 160." }],
    }),

    // ── Mastery ──
    ex("ar6-x01", "mastery", OF, "Any percentage", "Find 17.5% of 400.", num(70), {
      hints: ["10% + 5% + 2.5%."],
      steps: ["10% = 40, 5% = 20, 2.5% = 10.", "40 + 20 + 10 = 70."],
      why: "Halving repeatedly (10% → 5% → 2.5%) builds awkward percentages.",
    }),
    ex("ar6-x02", "mastery", CHANGE, "Percentage increase", "A salary of 2,500 rises by 4%. What is the new salary?", num(2600), {
      hints: ["1% of 2,500 is 25."],
      steps: ["4% = 4 × 25 = 100.", "2,500 + 100 = 2,600."],
      why: "Add the 4% increase to the original salary.",
    }),
    ex("ar6-x03", "mastery", OF, "Reverse percentages", "After a 25% increase, a price is 150. What was the original price?", num(120), {
      hints: ["150 is 125% of the original."],
      steps: ["125% = 150.", "25% = 150 ÷ 5 = 30.", "100% = 120."],
      why: "The new price is 125% of the original, so divide back to 100%.",
      wrong: [{ match: 112.5, message: "Taking 25% off 150 doesn't undo a 25% increase. 150 is 125% of the original." }],
    }),
    ex("ar6-x04", "mastery", MEANING, "One number as a percentage of another", "What percentage of 80 is 28?", num(35, { unit: "%" }), {
      hints: ["Find what 1% of 80 is, or simplify 28/80."],
      steps: ["28/80 = 7/20.", "7/20 = 35/100 = 35%."],
      why: "Scaling the fraction to have 100 on the bottom gives the percentage.",
    }),
    ex("ar6-x05", "mastery", CHANGE, "Discounts and interest", "A bank pays 5% simple interest per year. How much interest does 600 earn in 3 years?", num(90), {
      hints: ["Simple interest is the same amount each year."],
      steps: ["5% of 600 = 30 per year.", "3 years × 30 = 90."],
      why: "With simple interest, each year earns 5% of the original 600.",
    }),
  ],
};
