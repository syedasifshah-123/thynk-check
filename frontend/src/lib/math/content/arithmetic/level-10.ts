import type { LevelContent } from "../../schema";
import { choice, ex, num, order } from "../builders";

const MULTI = "Multi-step problems";
const REAL = "Real-world maths";
const REASON = "Reasoning";

export const LEVEL_10: LevelContent = {
  intro: {
    title: "Plan, solve, check",
    body: [
      "Real problems rarely say which operation to use. Start by asking: what do I know, and what do I need to find?",
      "Break the problem into steps and write down each result so you don't lose track.",
      "Finish by sense-checking: estimate, or work backwards from your answer to see if it fits the story.",
    ],
  },
  example: {
    title: "Worked example",
    problem: "Notebooks cost $3.50 each. You buy 4 and pay with a $20 note. How much change do you get?",
    steps: [
      "What do I need? The change: money paid minus total cost.",
      "Total cost: 4 × 3.50 = 14.",
      "Change: 20 − 14 = 6.",
      "Check: 14 + 6 = 20. ✓",
    ],
    answer: "$6",
  },
  exercises: [
    // ── Easy ──
    ex("ar10-e01", "easy", REAL, "Money and budgets", "You buy 3 pens at $1.20 each and pay with $5. How much change do you get?", num(1.4, { unit: "$" }), {
      hints: ["Find the total cost first."],
      steps: ["3 × 1.20 = 3.60.", "5 − 3.60 = 1.40."],
      why: "Change is what you paid minus what it cost.",
      wrong: [{ match: 3.6, message: "3.60 is the cost. The change is 5 − 3.60." }],
    }),
    ex("ar10-e02", "easy", REAL, "Time and rates", "A film starts at 4:45 and lasts 1 hour 30 minutes. When does it end?", choice(["6:15", "6:05", "5:75", "6:30"], 0), {
      hints: ["Add the hour first, then the 30 minutes."],
      steps: ["4:45 + 1 hour = 5:45.", "5:45 + 30 minutes = 6:15."],
      why: "Time rolls over at 60 minutes, so 5:45 + 30 min is 6:15, not 5:75.",
      wrong: [{ match: 2, message: "There are only 60 minutes in an hour, so 75 minutes rolls over into the next hour." }],
    }),
    ex("ar10-e03", "easy", MULTI, "Mixed operations", "A box holds 6 rows of 8 eggs. 5 eggs break. How many good eggs are left?", num(43), {
      hints: ["Find the total, then subtract the broken ones."],
      steps: ["6 × 8 = 48.", "48 − 5 = 43."],
      why: "Multiply to find how many eggs, then subtract the broken ones.",
    }),
    ex("ar10-e04", "easy", REAL, "Money and budgets", "Ali saves $15 a week. How many weeks until he has saved $120?", num(8, { unit: "weeks" }), {
      hints: ["How many 15s make 120?"],
      steps: ["120 ÷ 15 = 8."],
      why: "Each week adds 15, so divide the target by 15.",
    }),
    ex("ar10-e05", "easy", REASON, "Estimation and sense-checking", "Which is the best estimate for 49 × 21?", choice(["1,000", "100", "10,000", "700"], 0), {
      hints: ["Round to 50 × 20."],
      steps: ["49 ≈ 50, 21 ≈ 20.", "50 × 20 = 1,000."],
      why: "Rounding both numbers gives a quick estimate (exact: 1,029).",
    }),
    ex("ar10-e06", "easy", REASON, "Working backwards", "I think of a number and add 7. The answer is 19. What was my number?", num(12), {
      hints: ["Undo adding 7."],
      steps: ["19 − 7 = 12."],
      why: "Working backwards reverses each step: the opposite of +7 is −7.",
      wrong: [{ match: 26, message: "That adds 7 again. To undo +7, subtract 7." }],
    }),
    ex("ar10-e07", "easy", MULTI, "Mixed operations", "3 buses each have 45 seats. 128 students get on. How many seats are empty?", num(7), {
      hints: ["Find the total number of seats first."],
      steps: ["3 × 45 = 135 seats.", "135 − 128 = 7 empty."],
      why: "Empty seats are total seats minus students.",
    }),
    ex("ar10-e08", "easy", MULTI, "Mixed operations", "There are 3 pizzas with 8 slices each. 6 friends share them equally. How many slices does each friend get?", num(4), {
      hints: ["Total slices first, then share."],
      steps: ["3 × 8 = 24 slices.", "24 ÷ 6 = 4 each."],
      why: "Multiply to get all the slices, then divide among the friends.",
    }),
    ex("ar10-e09", "easy", REASON, "Working backwards", "Three consecutive whole numbers add up to 33. What is the smallest?", num(10), {
      hints: ["The middle number is the average: 33 ÷ 3."],
      steps: ["33 ÷ 3 = 11 is the middle number.", "So the numbers are 10, 11, 12."],
      why: "Consecutive numbers are balanced around the middle one.",
      wrong: [{ match: 11, message: "11 is the middle number. The smallest is one less." }],
    }),
    ex(
      "ar10-e10",
      "easy",
      MULTI,
      "Planning a solution",
      "Tickets cost $12 each. 5 friends go and use a $10-off coupon on the total. Put the steps in order.",
      order(["Multiply: 12 × 5 = 60", "Take off the coupon: 60 − 10 = 50", "Answer: $50"], "first step first"),
      {
        hints: ["The coupon comes off the TOTAL, so find the total first."],
        steps: ["Total for 5 tickets, then subtract the coupon, then state the answer."],
        why: "Planning the order matters: the discount applies after you know the total.",
      },
    ),

    // ── Medium ──
    ex("ar10-m01", "medium", REAL, "Percentages in context", "A shirt costs $24 and trousers cost $36. Everything is 25% off. What is the total?", num(45, { unit: "$" }), {
      hints: ["Add the prices, then take off 25%."],
      steps: ["24 + 36 = 60.", "25% of 60 = 15.", "60 − 15 = 45."],
      why: "25% off the total is the same as 25% off each item, but one calculation is quicker.",
      wrong: [{ match: 15, message: "15 is the discount. Take it off the total of 60." }],
    }),
    ex("ar10-m02", "medium", REAL, "Time and rates", "A car uses 6 litres of fuel per 100 km. Fuel costs $1.50 per litre. How much does a 250 km trip cost?", num(22.5, { unit: "$" }), {
      hints: ["Find the litres needed first."],
      steps: ["250 km = 2.5 × 100 km.", "Fuel: 2.5 × 6 = 15 litres.", "Cost: 15 × 1.50 = 22.50."],
      why: "Chain the rates: distance → litres → cost.",
    }),
    ex("ar10-m03", "medium", REASON, "Working backwards", "I think of a number, multiply it by 3, then subtract 5. The answer is 22. What was my number?", num(9), {
      hints: ["Undo the steps in reverse order: add 5, then divide by 3."],
      steps: ["22 + 5 = 27.", "27 ÷ 3 = 9.", "Check: 9 × 3 − 5 = 22. ✓"],
      why: "Reverse the operations and the order: the last step is undone first.",
      wrong: [{ match: 5.67, message: "Undo the steps in reverse order: add 5 first, then divide by 3." }],
    }),
    ex("ar10-m04", "medium", REAL, "Money and budgets", "A phone plan costs $15 a month plus $0.10 per text. What is the bill for a month with 80 texts?", num(23, { unit: "$" }), {
      hints: ["Find the cost of the texts, then add the monthly fee."],
      steps: ["80 × 0.10 = 8.", "15 + 8 = 23."],
      why: "Fixed fee plus a charge per text.",
    }),
    ex("ar10-m05", "medium", REASON, "Estimation and sense-checking", "Is 4.95 × 21 more or less than 100?", choice(["More than 100", "Less than 100", "Exactly 100"], 0), {
      hints: ["Compare with 5 × 20 = 100. Is 4.95 × 21 bigger or smaller?"],
      steps: ["4.95 × 21 = 4.95 × 20 + 4.95 = 99 + 4.95 = 103.95."],
      why: "Rounding 4.95 down and 21 up partly cancel, but the extra 21st lot tips it over 100.",
    }),
    ex("ar10-m06", "medium", MULTI, "Mixed operations", "A garden is 12 m long and 8 m wide. Fencing costs $5 per metre. How much does it cost to fence all the way round?", num(200, { unit: "$" }), {
      hints: ["Fencing goes round the edge: that's the perimeter."],
      steps: ["Perimeter = 12 + 8 + 12 + 8 = 40 m.", "40 × 5 = 200."],
      why: "Fence length is the perimeter, not the area.",
      wrong: [{ match: 480, message: "That uses the area (12 × 8). Fencing goes around the edge: the perimeter." }],
    }),
    ex("ar10-m07", "medium", MULTI, "Mixed operations", "What is the average of the scores 70, 85, 90 and 75?", num(80), {
      hints: ["Add them up, then divide by how many there are."],
      steps: ["70 + 85 + 90 + 75 = 320.", "320 ÷ 4 = 80."],
      why: "The mean shares the total equally among the four scores.",
    }),
    ex("ar10-m08", "medium", REAL, "Time and rates", "A train leaves at 09:40 and arrives at 13:15. How many minutes is the journey?", num(215, { unit: "minutes" }), {
      hints: ["Count to the next hour, then whole hours, then the extra minutes."],
      steps: ["09:40 → 10:00 is 20 min.", "10:00 → 13:00 is 180 min.", "13:00 → 13:15 is 15 min.", "20 + 180 + 15 = 215."],
      why: "Breaking the time at whole hours avoids subtracting clock times directly.",
      wrong: [{ match: 375, message: "Clock times aren't ordinary numbers: 1315 − 940 doesn't give minutes. Count up in steps." }],
    }),
    ex("ar10-m09", "medium", MULTI, "Mixed operations", "A tank holds 240 litres and is 3/8 full. How many more litres are needed to fill it?", num(150, { unit: "litres" }), {
      hints: ["If it's 3/8 full, what fraction is empty?"],
      steps: ["Empty part: 5/8.", "1/8 of 240 = 30.", "5/8 = 150 litres."],
      why: "The space left is the empty fraction of the tank.",
      wrong: [{ match: 90, message: "90 litres is how much is already in the tank. The question asks what's still needed." }],
    }),
    ex("ar10-m10", "medium", REAL, "Percentages in context", "A price of $80 goes up by 10%, then down by 10%. What is the final price?", num(79.2, { unit: "$" }), {
      hints: ["The 10% decrease is of the NEW price."],
      steps: ["Up 10%: 80 + 8 = 88.", "Down 10% of 88: 88 − 8.80 = 79.20."],
      why: "The decrease is 10% of a bigger number, so you don't get back to 80.",
      wrong: [{ match: 80, message: "The second 10% is taken from 88, not 80, so it's a bigger amount." }],
    }),

    // ── Hard ──
    ex("ar10-h01", "hard", REASON, "Working backwards", "Two numbers add up to 50 and their difference is 14. What is the larger number?", num(32), {
      hints: ["Remove the difference, then split the rest equally."],
      steps: ["50 − 14 = 36.", "36 ÷ 2 = 18 (the smaller).", "18 + 14 = 32."],
      why: "Taking away the difference leaves two equal amounts.",
    }),
    ex("ar10-h02", "hard", REASON, "Working backwards", "A mother is 3 times as old as her son. In 12 years she will be twice as old as him. How old is the son now?", num(12), {
      hints: ["Try a few ages for the son and test both clues."],
      steps: ["Son 12, mother 36 now.", "In 12 years: son 24, mother 48.", "48 = 2 × 24. ✓"],
      why: "Testing values against both conditions (or using algebra) finds the only age that works.",
    }),
    ex("ar10-h03", "hard", REAL, "Time and rates", "One painter paints a room in 4 hours. How many hours will 2 painters take to paint 10 rooms, working at the same rate?", num(20, { unit: "hours" }), {
      hints: ["How many painter-hours do 10 rooms need?"],
      steps: ["10 rooms × 4 hours = 40 painter-hours.", "Shared by 2 painters: 40 ÷ 2 = 20 hours."],
      why: "Total work is fixed; more painters share it.",
      wrong: [{ match: 80, message: "More painters should take less time, not more." }],
    }),
    ex("ar10-h04", "hard", REAL, "Percentages in context", "A trader buys an item for $60 and sells it for $75. What is the percentage profit?", num(25, { unit: "%" }), {
      hints: ["Profit ÷ cost price × 100."],
      steps: ["Profit = 15.", "15 ÷ 60 = 0.25 = 25%."],
      why: "Percentage profit compares the profit to what was paid.",
      wrong: [{ match: 20, message: "That divides by the selling price. Profit is compared to the cost price, 60." }],
    }),
    ex(
      "ar10-h05",
      "hard",
      REASON,
      "Estimation and sense-checking",
      "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      choice(["$0.05", "$0.10", "$0.15", "$1.00"], 0),
      {
        hints: ["Check your answer: if the ball were $0.10, the bat would be $1.10. What's the total then?"],
        steps: ["Take away the $1.00 difference: 1.10 − 1.00 = 0.10.", "Split equally: ball = 0.05, bat = 1.05.", "Check: 0.05 + 1.05 = 1.10. ✓"],
        why: "Sense-checking catches the tempting answer $0.10, which would make the total $1.20.",
        wrong: [{ match: 1, message: "If the ball is $0.10, the bat is $1.10 and the total is $1.20. Check against $1.10." }],
      },
    ),

    // ── Mastery ──
    ex("ar10-x01", "mastery", REAL, "Money and budgets", "A holiday costs $1,200. You pay a 15% deposit, then the rest in 6 equal payments. How much is each payment?", num(170, { unit: "$" }), {
      hints: ["Find the deposit, then what's left, then share it."],
      steps: ["15% of 1,200 = 180.", "1,200 − 180 = 1,020.", "1,020 ÷ 6 = 170."],
      why: "Three steps in a row: percentage, subtraction, division.",
    }),
    ex("ar10-x02", "mastery", REAL, "Time and rates", "A car drives at 60 km/h for 1.5 hours, then at 80 km/h for 2 hours. How far does it go in total?", num(250, { unit: "km" }), {
      hints: ["Find the distance for each part separately."],
      steps: ["60 × 1.5 = 90 km.", "80 × 2 = 160 km.", "90 + 160 = 250 km."],
      why: "Each stage has its own speed, so work out the distances separately and add.",
    }),
    ex("ar10-x03", "mastery", REASON, "Working backwards", "I halve a number, then add 6. The answer is 15. What was my number?", num(18), {
      hints: ["Undo in reverse: subtract 6, then double."],
      steps: ["15 − 6 = 9.", "9 × 2 = 18."],
      why: "Reversing each step in the opposite order recovers the starting number.",
      wrong: [{ match: 4.5, message: "Undo halving by doubling, not halving again." }],
    }),
    ex("ar10-x04", "mastery", REASON, "Working backwards", "3 notebooks and 2 pens cost $13. 1 notebook and 2 pens cost $7. How much is one notebook?", num(3, { unit: "$" }), {
      hints: ["Compare the two purchases: what's the difference?"],
      steps: ["The difference is 2 notebooks.", "13 − 7 = 6, so 2 notebooks cost 6.", "One notebook costs 3."],
      why: "The pens are the same in both, so the price difference comes only from the 2 extra notebooks.",
    }),
    ex("ar10-x05", "mastery", MULTI, "Checking answers", "The average of 5 numbers is 12. Four of them are 10, 14, 9 and 15. What is the fifth?", num(12), {
      hints: ["The total of all 5 numbers is 5 × 12."],
      steps: ["Total: 5 × 12 = 60.", "Known four: 10 + 14 + 9 + 15 = 48.", "Fifth: 60 − 48 = 12."],
      why: "An average fixes the total, so the missing number is whatever's needed to reach it.",
    }),
  ],
};
