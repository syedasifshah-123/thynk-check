import type { LevelContent } from "../../schema";
import { blocks, choice, dots, ex, fill, line, num, order, shade, slot, tapLine } from "../builders";

const COUNT = "Counting & comparing";
const PLACE = "Place value";
const LINE = "The number line";

export const LEVEL_1: LevelContent = {
  intro: {
    title: "Every digit has a job",
    body: [
      "Our number system uses just ten digits, 0 to 9. What a digit is worth depends on where it sits.",
      "Moving one place to the left makes a digit worth ten times more: ones, tens, hundreds, thousands…",
      "These blocks show 3 hundreds, 4 tens and 2 ones, which is 342.",
    ],
    visual: blocks(3, 4, 2),
  },
  example: {
    title: "Worked example",
    problem: "What is the value of the 7 in 4,732?",
    steps: [
      "Label the places from the right: 2 is ones, 3 is tens, 7 is hundreds, 4 is thousands.",
      "The 7 is in the hundreds place.",
      "So it is worth 7 × 100 = 700.",
    ],
    answer: "700",
  },
  exercises: [
    // ── Easy ──
    ex("ar1-e01", "easy", COUNT, "Counting objects", "How many dots are there?", choice(["6", "7", "8", "9"], 1), {
      visual: dots(7),
      hints: ["Count the full row first, then the extras."],
      steps: ["The top row has 5 dots.", "The bottom row has 2 more.", "5 + 2 = 7."],
      why: "A full row of 5 plus 2 more is 7. Grouping in fives makes counting fast and reliable.",
    }),
    ex("ar1-e02", "easy", COUNT, "Greater and less than", "Which group has more dots?", choice(["Group A", "Group B", "They're the same"], 0), {
      visual: dots(8, 6),
      hints: ["Count each group, or match dots in pairs and look for leftovers."],
      steps: ["Group A has 8 dots.", "Group B has 6 dots.", "8 > 6, so Group A has more."],
      why: "8 is greater than 6. Matching dots one-to-one leaves 2 extra in Group A.",
    }),
    ex("ar1-e03", "easy", COUNT, "Counting objects", "Shade exactly 6 squares.", shade(2, 5, 6), {
      hints: ["Tap a square to shade it. Count as you go."],
      steps: ["Tap squares one at a time, counting 1, 2, 3, 4, 5, 6.", "Stop at 6. Four squares stay empty."],
      why: "Any 6 squares work: the question is about the count, not which squares.",
    }),
    ex("ar1-e04", "easy", COUNT, "Ordering numbers", "Which number is the greatest?", choice(["89", "98", "79", "97"], 1), {
      hints: ["Compare the tens digits first."],
      steps: ["98 and 97 both have 9 tens, the most.", "Compare the ones: 8 > 7.", "So 98 is the greatest."],
      why: "Compare from the biggest place down: tens first, then ones only if the tens tie.",
      wrong: [{ match: 3, message: "97 and 98 tie on tens, so look at the ones: 8 beats 7." }],
    }),
    ex("ar1-e05", "easy", PLACE, "Ones, tens, hundreds", "What number do these blocks show?", num(235), {
      visual: blocks(2, 3, 5),
      hints: ["Flats are hundreds, rods are tens, small cubes are ones."],
      steps: ["2 flats = 200.", "3 rods = 30.", "5 cubes = 5.", "200 + 30 + 5 = 235."],
      why: "Each block type stands for one place value, so the counts become the digits: 2, 3, 5.",
      wrong: [{ match: 253, message: "Check which blocks are rods (tens) and which are cubes (ones)." }],
    }),
    ex("ar1-e06", "easy", LINE, "Reading scales", "Tap 7 on the number line.", tapLine(0, 10, 1, 7, [0, 5, 10]), {
      hints: ["Each tick is 1. Find 5 first, then count on."],
      steps: ["The middle label is 5.", "Count two ticks to the right: 6, 7."],
      why: "Every tick is worth 1, so 7 is two ticks past 5.",
    }),
    ex("ar1-e07", "easy", PLACE, "Ones, tens, hundreds", "Write the number that has 4 tens and 6 ones.", num(46), {
      hints: ["Tens come before ones when you write the number."],
      steps: ["4 tens = 40.", "6 ones = 6.", "40 + 6 = 46."],
      why: "The tens digit goes on the left, the ones digit on the right: 46.",
      wrong: [{ match: 64, message: "That's 6 tens and 4 ones. The tens digit is 4." }],
    }),
    ex("ar1-e08", "easy", COUNT, "Ordering numbers", "Put these numbers in order.", order(["14", "24", "41"]), {
      hints: ["Look at the tens digit of each number."],
      steps: ["14 has 1 ten, 24 has 2 tens, 41 has 4 tens.", "So the order is 14, 24, 41."],
      why: "With the same number of digits, the tens digit decides the order.",
    }),
    ex("ar1-e09", "easy", PLACE, "Reading large numbers", "What number comes just after 199?", num(200), {
      hints: ["Adding 1 to 9 ones makes a new ten."],
      steps: ["199 + 1: the ones become 10, which carries into the tens.", "The tens become 10 too, which carries into the hundreds.", "So 199 + 1 = 200."],
      why: "Nine ones plus one makes a ten, and that ripples up: 199 becomes 200.",
      wrong: [{ match: 1910, message: "Careful: 199 + 1 isn't written by sticking digits together. Carry the extra ten." }],
    }),
    ex("ar1-e10", "easy", COUNT, "Greater and less than", "Which symbol makes this true?  52 ___ 25", choice([">", "<", "="], 0), {
      hints: ["The symbol's open side faces the bigger number."],
      steps: ["52 has 5 tens; 25 has 2 tens.", "52 is bigger, so 52 > 25."],
      why: "The wide end of > points at the larger number, 52.",
    }),

    // ── Medium ──
    ex("ar1-m01", "medium", PLACE, "Ones, tens, hundreds", "What number do these blocks show?", choice(["17", "107", "170", "1007"], 1), {
      visual: blocks(1, 0, 7),
      hints: ["There are no rods. What digit holds the tens place?"],
      steps: ["1 flat = 100.", "0 rods = 0 tens.", "7 cubes = 7.", "So the number is 107."],
      why: "Zero is a placeholder: it keeps the 1 in the hundreds place.",
      wrong: [{ match: 0, message: "Without a 0 in the tens place, the 1 slips into the tens. You need 1, 0, 7." }],
    }),
    ex("ar1-m02", "medium", PLACE, "Value of a digit", "In 5,903, what is the value of the 9?", num(900), {
      hints: ["Count places from the right: ones, tens, hundreds…"],
      steps: ["3 is ones, 0 is tens, 9 is hundreds.", "9 hundreds = 900."],
      why: "A digit's value is the digit times its place: 9 × 100 = 900.",
      wrong: [{ match: 9, message: "9 is the digit. Its value depends on its place, which is hundreds here." }],
    }),
    ex(
      "ar1-m03",
      "medium",
      PLACE,
      "Ones, tens, hundreds",
      "Drag the digits to break 482 into hundreds, tens and ones.",
      fill([["482", "="], [slot(0), "hundreds", "+", slot(1), "tens", "+", slot(2), "ones"]], ["2", "4", "8", "0"], ["4", "8", "2"]),
      {
        hints: ["Read 482 left to right: hundreds, tens, ones."],
        steps: ["4 is in the hundreds place.", "8 is in the tens place.", "2 is in the ones place."],
        why: "482 = 400 + 80 + 2: each digit tells you how many of that place you have.",
      },
    ),
    ex("ar1-m04", "medium", LINE, "Reading scales", "What number is the arrow pointing to?", choice(["30", "40", "45", "60"], 1), {
      visual: line(0, 100, 10, 40, [0, 50, 100]),
      hints: ["10 equal jumps cover 0 to 100. How big is each jump?"],
      steps: ["100 ÷ 10 = 10, so each jump is 10.", "The arrow is 4 jumps from 0.", "4 × 10 = 40."],
      why: "Working out the size of one jump lets you read any unlabelled tick.",
    }),
    ex("ar1-m05", "medium", LINE, "Reading scales", "Tap 14 on the number line.", tapLine(0, 20, 2, 14, [0, 10, 20]), {
      hints: ["From 0 to 10 there are 5 jumps. So each jump is…?"],
      steps: ["10 ÷ 5 = 2, so each tick is 2.", "From 10, two more ticks: 12, 14."],
      why: "Each tick is worth 2 here, so 14 is two ticks past 10.",
    }),
    ex("ar1-m06", "medium", LINE, "Halfway points", "Which number is exactly halfway between 20 and 30?", num(25), {
      visual: line(20, 30, 1, undefined, [20, 30]),
      hints: ["Halfway means the same distance from both ends."],
      steps: ["The gap from 20 to 30 is 10.", "Half of 10 is 5.", "20 + 5 = 25."],
      why: "25 is 5 away from 20 and 5 away from 30, so it sits in the middle.",
    }),
    ex("ar1-m07", "medium", COUNT, "Ordering numbers", "Put these numbers in order.", order(["3,500", "3,055", "3,050", "3,005"], "largest first"), {
      hints: ["They all start with 3 thousand. Compare the hundreds, then the tens."],
      steps: ["3,500 has 5 hundreds; the others have 0 hundreds.", "Among the rest compare tens: 3,055 (5 tens) and 3,050 (5 tens) beat 3,005.", "3,055 > 3,050 because 5 ones > 0 ones."],
      why: "Compare place by place from the left until the digits differ.",
    }),
    ex("ar1-m08", "medium", PLACE, "Reading large numbers", "What is 10 more than 395?", num(405), {
      hints: ["Adding 10 changes the tens digit. What happens when 9 tens becomes 10 tens?"],
      steps: ["395 has 9 tens. One more ten makes 10 tens.", "10 tens = 1 hundred, so the hundreds go from 3 to 4.", "395 + 10 = 405."],
      why: "When a place reaches ten, it becomes one of the next place up.",
      wrong: [{ match: 3105, message: "Adding 10 doesn't stick a 10 into the number. 9 tens + 1 ten = 1 hundred." }],
    }),
    ex("ar1-m09", "medium", PLACE, "Reading large numbers", "Write “six thousand and forty” in digits.", num(6040), {
      hints: ["Think of the places: thousands, hundreds, tens, ones. Which places are empty?"],
      steps: ["6 thousands, 0 hundreds, 4 tens, 0 ones.", "So the number is 6,040."],
      why: "Zeros fill the empty hundreds and ones places so the 6 and 4 stay in the right spots.",
      wrong: [
        { match: 640, message: "That's six hundred and forty. Six thousand needs four digits." },
        { match: 60040, message: "That's sixty thousand and forty: one zero too many." },
      ],
    }),
    ex("ar1-m10", "medium", PLACE, "Value of a digit", "How many tens are in 340 altogether?", num(34), {
      hints: ["How many tens make 300? Then add the tens in 40."],
      steps: ["300 = 30 tens.", "40 = 4 tens.", "30 + 4 = 34 tens."],
      why: "The tens digit only shows the tens left over after hundreds. In total, 340 ÷ 10 = 34 tens.",
      wrong: [{ match: 4, message: "4 is the tens digit, but each hundred also contains 10 tens." }],
    }),

    // ── Hard ──
    ex("ar1-h01", "hard", PLACE, "Value of a digit", "Using 3, 8, 1 and 6 once each, make the largest possible 4-digit number.", num(8631), {
      hints: ["Put the biggest digit in the most valuable place."],
      steps: ["Thousands should get the biggest digit, 8.", "Then 6 in the hundreds, 3 in the tens, 1 in the ones.", "8,631."],
      why: "The leftmost place is worth the most, so digits go in descending order.",
    }),
    ex("ar1-h02", "hard", PLACE, "Value of a digit", "Using 3, 8, 1 and 6 once each, make the smallest possible 4-digit EVEN number.", num(1368), {
      hints: ["An even number ends in an even digit. Which even digit should go last?"],
      steps: ["The last digit must be 6 or 8.", "To keep the number small, use 1, 3 at the front.", "Options: 1,368 or 1,386. The smallest is 1,368."],
      why: "Small digits go in the big places; the ones digit must be even, and 1,368 < 1,386.",
      wrong: [{ match: 1386, message: "That's even, but swapping the last two digits gives a smaller even number." }],
    }),
    ex("ar1-h03", "hard", LINE, "Estimating position", "What number is the arrow pointing to?", num(700), {
      visual: line(0, 1000, 100, 700, [0, 500, 1000]),
      hints: ["There are 10 jumps from 0 to 1,000."],
      steps: ["1,000 ÷ 10 = 100 per jump.", "The arrow is 2 jumps past 500.", "500 + 200 = 700."],
      why: "Each jump is 100, so two jumps past the 500 label is 700.",
    }),
    ex("ar1-h04", "hard", PLACE, "Ones, tens, hundreds", "A number has 5 hundreds, 14 tens and 3 ones. What is it?", num(643), {
      hints: ["14 tens is more than 9 tens. How many hundreds hide inside it?"],
      steps: ["14 tens = 140.", "5 hundreds = 500.", "500 + 140 + 3 = 643."],
      why: "14 tens regroups into 1 hundred and 4 tens, so the hundreds digit becomes 6.",
      wrong: [{ match: 5143, message: "You can't write 14 in one place. 14 tens = 1 hundred + 4 tens." }],
    }),
    ex("ar1-h05", "hard", PLACE, "Reading large numbers", "Which number is the same as 3,000 + 40 + 7?", choice(["3,047", "3,407", "347", "30,047"], 0), {
      hints: ["Which places are missing? Fill them with zeros."],
      steps: ["3 thousands, 0 hundreds, 4 tens, 7 ones.", "That's 3,047."],
      why: "There are no hundreds, so a 0 holds the hundreds place.",
      wrong: [{ match: 1, message: "3,407 has 4 hundreds. But 40 is 4 tens." }],
    }),

    // ── Mastery ──
    ex("ar1-x01", "mastery", PLACE, "Value of a digit", "What is the value of the 6 in 862,415?", num(60000), {
      hints: ["Count places from the right: ones, tens, hundreds, thousands, ten thousands…"],
      steps: ["5 ones, 1 ten, 4 hundreds, 2 thousands, 6 ten thousands.", "6 × 10,000 = 60,000."],
      why: "The 6 sits in the ten-thousands place, so it's worth 60,000.",
      wrong: [{ match: 6000, message: "Close: count again. The 6 is one place further left than thousands." }],
    }),
    ex("ar1-x02", "mastery", COUNT, "Ordering numbers", "Put these numbers in order.", order(["7,009", "7,099", "7,909", "7,990"]), {
      hints: ["All start with 7 thousand. Compare hundreds, then tens."],
      steps: ["Hundreds: 0, 0, 9, 9.", "Among 7,009 and 7,099, tens decide: 0 < 9.", "Among 7,909 and 7,990, tens decide: 0 < 9."],
      why: "Comparing place by place from the left gives a reliable order.",
    }),
    ex("ar1-x03", "mastery", LINE, "Reading scales", "Tap 35 on the number line.", tapLine(0, 50, 5, 35, [0, 50]), {
      hints: ["There are 10 jumps from 0 to 50. How big is each one?"],
      steps: ["50 ÷ 10 = 5 per tick.", "35 ÷ 5 = 7, so it's the 7th tick."],
      why: "Each tick is 5, so 35 is 7 ticks from 0.",
    }),
    ex(
      "ar1-x04",
      "mastery",
      PLACE,
      "Ones, tens, hundreds",
      "I'm a 3-digit number. My hundreds digit is 4. My tens digit is twice my hundreds digit. My ones digit is 1 less than my tens digit. What number am I?",
      num(487),
      {
        hints: ["Work out one digit at a time, starting with hundreds."],
        steps: ["Hundreds = 4.", "Tens = 2 × 4 = 8.", "Ones = 8 − 1 = 7.", "The number is 487."],
        why: "Each clue fixes one digit, and the digits fill their places in order.",
      },
    ),
    ex("ar1-x05", "mastery", PLACE, "Reading large numbers", "What is 1,000 less than 25,300?", num(24300), {
      hints: ["Only the thousands digit changes. What is 5 thousands minus 1 thousand?"],
      steps: ["25,300 has 5 thousands.", "Take 1 thousand away: 4 thousands.", "25,300 − 1,000 = 24,300."],
      why: "Subtracting 1,000 lowers just the thousands digit by one.",
      wrong: [{ match: 25200, message: "That's 100 less. 1,000 less changes the thousands digit." }],
    }),
  ],
};
