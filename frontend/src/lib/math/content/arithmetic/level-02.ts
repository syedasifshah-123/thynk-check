import type { LevelContent } from "../../schema";
import { choice, ex, fill, line, num, order, slot, tapLine } from "../builders";

const ADD = "Adding";
const SUB = "Subtracting";
const LINKS = "Connections";

export const LEVEL_2: LevelContent = {
  intro: {
    title: "Add and subtract place by place",
    body: [
      "Column methods work one place at a time: ones, then tens, then hundreds.",
      "When a column adds up to 10 or more, carry the extra ten to the next column. When you can't subtract, borrow a ten from the next column.",
      "Addition and subtraction undo each other, so you can always check one with the other.",
    ],
    visual: line(0, 20, 1, 13, [0, 10, 20]),
  },
  example: {
    title: "Worked example",
    problem: "Work out 347 + 285.",
    steps: [
      "Ones: 7 + 5 = 12. Write 2, carry 1 ten.",
      "Tens: 4 + 8 + 1 (carried) = 13. Write 3, carry 1 hundred.",
      "Hundreds: 3 + 2 + 1 (carried) = 6.",
      "Check by estimating: 350 + 290 ≈ 640. ✓",
    ],
    answer: "632",
  },
  exercises: [
    // ── Easy ──
    ex("ar2-e01", "easy", ADD, "Column addition", "Work out 36 + 23.", num(59), {
      hints: ["Add the ones, then the tens."],
      steps: ["Ones: 6 + 3 = 9.", "Tens: 3 + 2 = 5.", "36 + 23 = 59."],
      why: "No column reaches 10, so each place adds on its own: 5 tens and 9 ones.",
    }),
    ex("ar2-e02", "easy", ADD, "Carrying", "Work out 58 + 7.", num(65), {
      hints: ["8 + 7 is more than 10. What gets carried?"],
      steps: ["Ones: 8 + 7 = 15. Write 5, carry 1 ten.", "Tens: 5 + 1 = 6.", "58 + 7 = 65."],
      why: "15 ones regroup as 1 ten and 5 ones, so the tens go from 5 to 6.",
      wrong: [{ match: 515, message: "15 ones can't sit in one column. Carry the ten: 5 tens + 1 ten = 6 tens." }],
    }),
    ex("ar2-e03", "easy", SUB, "Column subtraction", "Work out 84 − 31.", num(53), {
      hints: ["Subtract the ones, then the tens."],
      steps: ["Ones: 4 − 1 = 3.", "Tens: 8 − 3 = 5.", "84 − 31 = 53."],
      why: "Each top digit is bigger, so every column subtracts directly.",
    }),
    ex("ar2-e04", "easy", ADD, "Column addition", "Start at 8 and jump +5. Tap where you land.", tapLine(0, 20, 1, 13, [0, 10, 20]), {
      hints: ["Count 5 ticks to the right of 8."],
      steps: ["From 8: 9, 10, 11, 12, 13.", "You land on 13."],
      why: "Adding moves right on a number line: 8 + 5 = 13.",
    }),
    ex("ar2-e05", "easy", ADD, "Adding several numbers", "Which is the same as 40 + 30?", choice(["7", "70", "700", "43"], 1), {
      hints: ["4 tens + 3 tens = how many tens?"],
      steps: ["40 is 4 tens, 30 is 3 tens.", "4 + 3 = 7 tens = 70."],
      why: "Adding tens is like adding ones, just a place higher: 7 tens is 70.",
      wrong: [{ match: 0, message: "4 tens + 3 tens = 7 tens, which is 70, not 7." }],
    }),
    ex("ar2-e06", "easy", LINKS, "Inverse operations", "Drag the missing number.", fill([["25", "+", slot(0), "=", "40"]], ["5", "15", "25", "65"], ["15"]), {
      hints: ["What do you add to 25 to reach 40? Try 40 − 25."],
      steps: ["40 − 25 = 15.", "Check: 25 + 15 = 40. ✓"],
      why: "A missing addend is found by subtracting: 40 − 25 = 15.",
    }),
    ex("ar2-e07", "easy", SUB, "Borrowing", "Work out 100 − 45.", num(55), {
      hints: ["Count up from 45 to 100: to 50 first, then to 100."],
      steps: ["45 → 50 is 5.", "50 → 100 is 50.", "5 + 50 = 55."],
      why: "Counting up to friendly numbers is a quick, reliable way to subtract from 100.",
      wrong: [{ match: 65, message: "Check the ones: 45 + 65 = 110. Try counting up from 45 to 50, then to 100." }],
    }),
    ex("ar2-e08", "easy", ADD, "Adding several numbers", "Put these in order of their answers.", order(["12 + 9", "19 + 6", "30 − 2"]), {
      hints: ["Work out each one first."],
      steps: ["12 + 9 = 21.", "19 + 6 = 25.", "30 − 2 = 28.", "21 < 25 < 28."],
      why: "Comparing calculations means comparing their results.",
    }),
    ex("ar2-e09", "easy", LINKS, "Fact families", "If 9 + 6 = 15, which must also be true?", choice(["15 − 6 = 9", "9 − 6 = 15", "6 − 15 = 9", "15 + 9 = 6"], 0), {
      hints: ["Subtraction undoes addition."],
      steps: ["9, 6 and 15 form a fact family.", "Taking 6 back away from 15 leaves 9."],
      why: "If 9 + 6 = 15, then 15 − 6 = 9 and 15 − 9 = 6: addition and subtraction are inverses.",
    }),
    ex("ar2-e10", "easy", ADD, "Column addition", "Work out 47 + 30.", num(77), {
      hints: ["Adding 30 only changes the tens."],
      steps: ["47 has 4 tens; add 3 tens to get 7 tens.", "The ones stay 7.", "47 + 30 = 77."],
      why: "Adding a multiple of 10 leaves the ones digit unchanged.",
    }),

    // ── Medium ──
    ex("ar2-m01", "medium", ADD, "Carrying", "Work out 347 + 285.", num(632), {
      hints: ["Start with the ones. 7 + 5 = 12, so something gets carried."],
      steps: ["Ones: 7 + 5 = 12 → write 2, carry 1.", "Tens: 4 + 8 + 1 = 13 → write 3, carry 1.", "Hundreds: 3 + 2 + 1 = 6.", "Total: 632."],
      why: "Each carry moves a full ten (or hundred) into the next place, keeping every column a single digit.",
      wrong: [{ match: 522, message: "It looks like the carried tens and hundreds were dropped. 7 + 5 = 12: carry the 1." }],
    }),
    ex("ar2-m02", "medium", SUB, "Subtracting across zeros", "Work out 503 − 268.", num(235), {
      hints: ["3 − 8 won't work, and the tens column is 0. Borrow from the hundreds first."],
      steps: ["Borrow: 503 = 4 hundreds, 9 tens, 13 ones.", "Ones: 13 − 8 = 5.", "Tens: 9 − 6 = 3.", "Hundreds: 4 − 2 = 2.", "503 − 268 = 235."],
      why: "Borrowing across a zero turns 5 hundreds into 4 hundreds, 9 tens and 10 ones.",
      wrong: [{ match: 365, message: "Careful: you can't flip a column (8 − 3). Borrow instead so the top digit is bigger." }],
    }),
    ex("ar2-m03", "medium", ADD, "Column addition", "Work out 1,250 + 875.", num(2125), {
      hints: ["Line up the ones digits. 875 has no thousands."],
      steps: ["Ones: 0 + 5 = 5.", "Tens: 5 + 7 = 12 → write 2, carry 1.", "Hundreds: 2 + 8 + 1 = 11 → write 1, carry 1.", "Thousands: 1 + 1 = 2.", "2,125."],
      why: "Lining up by place value (not by the first digit) keeps hundreds with hundreds.",
    }),
    ex(
      "ar2-m04",
      "medium",
      ADD,
      "Carrying",
      "Which digit fills the gap?",
      fill([["4", slot(0), "6", "+", "238", "=", "704"]], ["2", "5", "6", "7"], ["6"]),
      {
        hints: ["Work out 704 − 238 to find the first number."],
        steps: ["704 − 238 = 466.", "So the missing digit is 6.", "Check: 466 + 238 = 704. ✓"],
        why: "Subtraction undoes addition, so 704 − 238 reveals the missing number.",
      },
    ),
    ex("ar2-m05", "medium", LINKS, "Word problems", "Ali has 125 marbles and gives away 48. How many are left?", num(77), {
      hints: ["“Gives away” means subtract."],
      steps: ["125 − 48.", "Ones: 15 − 8 = 7 (after borrowing).", "Tens: 1 − 4 won't work: borrow → 11 − 4 = 7.", "Left: 77."],
      why: "Taking away a part from a whole is subtraction: 125 − 48 = 77.",
      wrong: [{ match: 173, message: "Giving marbles away makes the number smaller. Subtract instead." }],
    }),
    ex("ar2-m06", "medium", ADD, "Adding several numbers", "Which is the best estimate for 398 + 207?", choice(["500", "600", "700", "800"], 1), {
      hints: ["Round each number to the nearest hundred."],
      steps: ["398 ≈ 400.", "207 ≈ 200.", "400 + 200 = 600."],
      why: "Rounding to friendly numbers gives a fast estimate that's close to the exact 605.",
    }),
    ex("ar2-m07", "medium", SUB, "Subtracting across zeros", "Work out 1,000 − 387.", num(613), {
      hints: ["Count up from 387: to 400, then to 1,000."],
      steps: ["387 → 400 is 13.", "400 → 1,000 is 600.", "13 + 600 = 613."],
      why: "Counting up through round numbers avoids borrowing across three zeros.",
      wrong: [{ match: 723, message: "Check: 387 + 723 = 1,110. Count up from 387 to 400 first." }],
    }),
    ex("ar2-m08", "medium", LINKS, "Inverse operations", "Find the missing number:  ___ − 45 = 80", num(125), {
      hints: ["The missing number minus 45 leaves 80. So it must be 80 plus…?"],
      steps: ["Undo the subtraction by adding: 80 + 45 = 125.", "Check: 125 − 45 = 80. ✓"],
      why: "The starting number is what you get back by adding 45 to 80.",
      wrong: [{ match: 35, message: "35 − 45 is negative. The starting number must be bigger than 80." }],
    }),
    ex(
      "ar2-m09",
      "medium",
      ADD,
      "Column addition",
      "Put the steps for 56 + 37 in order.",
      order(["Add the ones: 6 + 7 = 13", "Write 3 and carry 1 ten", "Add the tens: 5 + 3 + 1 = 9", "Answer: 93"], "first step first"),
      {
        hints: ["Column addition always starts on the right."],
        steps: ["Ones first, then deal with the carry, then the tens, then read the answer."],
        why: "Starting with the ones lets each carry flow into the next column.",
      },
    ),
    ex("ar2-m10", "medium", ADD, "Adding several numbers", "Work out 125 + 250 + 375.", num(750), {
      hints: ["Look for pairs that make a round number."],
      steps: ["125 + 375 = 500.", "500 + 250 = 750."],
      why: "You can add in any order, so pair numbers that make friendly totals.",
    }),

    // ── Hard ──
    ex("ar2-h01", "hard", SUB, "Subtracting across zeros", "Work out 6,004 − 2,567.", num(3437), {
      hints: ["The hundreds and tens are 0. Borrow from the thousands so the ones can subtract."],
      steps: ["6,004 = 5 thousands, 9 hundreds, 9 tens, 14 ones.", "Ones: 14 − 7 = 7. Tens: 9 − 6 = 3.", "Hundreds: 9 − 5 = 4. Thousands: 5 − 2 = 3.", "6,004 − 2,567 = 3,437."],
      why: "One borrowed thousand becomes 9 hundreds, 9 tens and 10 ones, so every column can subtract.",
      wrong: [{ match: 4563, message: "That comes from subtracting the smaller digit from the larger in each column. Borrow instead." }],
    }),
    ex("ar2-h02", "hard", LINKS, "Word problems", "Two numbers add up to 100. One is 36 more than the other. What is the larger number?", num(68), {
      hints: ["Take away the 36 extra, then share what's left equally."],
      steps: ["100 − 36 = 64.", "64 ÷ 2 = 32 is the smaller number.", "32 + 36 = 68.", "Check: 32 + 68 = 100. ✓"],
      why: "Removing the difference leaves two equal parts; adding it back gives the larger one.",
      wrong: [{ match: 64, message: "64 is what's left after removing the difference. Split it in half, then add 36 back." }],
    }),
    ex("ar2-h03", "hard", LINKS, "Inverse operations", "Which calculation checks that 742 − 389 = 353?", choice(["353 + 389", "742 + 389", "353 − 389", "742 + 353"], 0), {
      hints: ["Addition undoes subtraction. What should you add to the answer?"],
      steps: ["If 742 − 389 = 353, then 353 + 389 should give back 742.", "353 + 389 = 742. ✓"],
      why: "Adding the number you took away back onto the answer must return the starting number.",
    }),
    ex("ar2-h04", "hard", LINKS, "Word problems", "A shop had 1,200 items. It sold 345 on Monday and 289 on Tuesday. How many are left?", num(566), {
      hints: ["Find the total sold first, then subtract it from 1,200."],
      steps: ["Sold: 345 + 289 = 634.", "Left: 1,200 − 634 = 566."],
      why: "Combining the two sales first turns two subtractions into one.",
      wrong: [{ match: 1834, message: "Selling items reduces the stock: subtract what was sold." }],
    }),
    ex("ar2-h05", "hard", LINKS, "Inverse operations", "Complete:  2,476 + ___ = 5,000", num(2524), {
      hints: ["Find 5,000 − 2,476, or count up in steps."],
      steps: ["2,476 → 2,500 is 24.", "2,500 → 5,000 is 2,500.", "24 + 2,500 = 2,524."],
      why: "Counting up to round numbers finds the gap without borrowing across zeros.",
    }),

    // ── Mastery ──
    ex("ar2-x01", "mastery", SUB, "Subtracting across zeros", "Work out 8,000 − 3,456.", num(4544), {
      hints: ["Count up: 3,456 → 3,500 → 4,000 → 8,000."],
      steps: ["3,456 → 3,500: 44.", "3,500 → 4,000: 500.", "4,000 → 8,000: 4,000.", "44 + 500 + 4,000 = 4,544."],
      why: "Counting up through round numbers is a reliable way to subtract from a number with many zeros.",
    }),
    ex("ar2-x02", "mastery", ADD, "Carrying", "Work out 4,789 + 3,567.", num(8356), {
      hints: ["Every column carries here. Go carefully from the right."],
      steps: ["Ones: 9 + 7 = 16 → 6, carry 1.", "Tens: 8 + 6 + 1 = 15 → 5, carry 1.", "Hundreds: 7 + 5 + 1 = 13 → 3, carry 1.", "Thousands: 4 + 3 + 1 = 8.", "8,356."],
      why: "Each carry passes a full group of ten up to the next place.",
    }),
    ex("ar2-x03", "mastery", LINKS, "Word problems", "A train has 856 passengers. At a stop, 279 get off and 134 get on. How many are on the train now?", num(711), {
      hints: ["Getting off is subtraction, getting on is addition."],
      steps: ["856 − 279 = 577.", "577 + 134 = 711."],
      why: "Apply each change in turn: take away those who leave, then add those who board.",
    }),
    ex(
      "ar2-x04",
      "mastery",
      SUB,
      "Borrowing",
      "Sam says 403 − 158 = 355. What mistake did Sam make?",
      choice(["Subtracted the smaller digit from the larger in each column", "Forgot to carry", "Added instead of subtracting", "No mistake, it's right"], 0),
      {
        hints: ["Work out 403 − 158 yourself, then compare column by column."],
        steps: ["Correct answer: 403 − 158 = 245.", "Sam's ones: 8 − 3 = 5 (flipped). Tens: 5 − 0 = 5 (flipped).", "That's the 'smaller from larger' mistake."],
        why: "In subtraction the top number is always on top. When it's smaller, borrow; never flip the digits.",
      },
    ),
    ex("ar2-x05", "mastery", SUB, "Column subtraction", "What is 375 less than 2,000?", num(1625), {
      hints: ["“Less than” means subtract: 2,000 − 375."],
      steps: ["375 → 400 is 25.", "400 → 2,000 is 1,600.", "25 + 1,600 = 1,625."],
      why: "375 less than 2,000 is the gap you'd count up from 375 to 2,000, taken from 2,000.",
    }),
  ],
};
