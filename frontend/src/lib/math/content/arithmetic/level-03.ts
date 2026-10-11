import type { LevelContent } from "../../schema";
import { array, choice, ex, fill, num, order, shade, slot } from "../builders";

const MUL = "Multiplication";
const DIV = "Division";
const STRAT = "Strategies";

export const LEVEL_3: LevelContent = {
  intro: {
    title: "Groups, arrays and sharing",
    body: [
      "Multiplication counts equal groups fast: 3 rows of 4 dots is 3 × 4 = 12.",
      "Division runs it backwards: 12 shared into 3 equal rows gives 4 in each row.",
      "Because they're inverses, every multiplication fact gives you two division facts for free.",
    ],
    visual: array(3, 4),
  },
  example: {
    title: "Worked example",
    problem: "Work out 24 × 13.",
    steps: [
      "Split 13 into 10 + 3.",
      "24 × 10 = 240.",
      "24 × 3 = 72.",
      "Add the parts: 240 + 72 = 312.",
    ],
    answer: "312",
  },
  exercises: [
    // ── Easy ──
    ex("ar3-e01", "easy", MUL, "Equal groups and arrays", "How many dots are in this array?", num(15), {
      visual: array(3, 5),
      hints: ["Count the rows and how many are in each row."],
      steps: ["3 rows of 5.", "3 × 5 = 15."],
      why: "An array is equal groups in rows, so rows × columns gives the total.",
    }),
    ex("ar3-e02", "easy", MUL, "Times tables", "Work out 7 × 8.", num(56), {
      hints: ["You might know 7 × 7 = 49. Add one more 7."],
      steps: ["7 × 7 = 49.", "49 + 7 = 56."],
      why: "Building from a fact you know is a reliable way to recall a harder one.",
      wrong: [
        { match: 54, message: "Close! 54 is 6 × 9. Try 7 × 7 = 49, then add 7." },
        { match: 63, message: "63 is 7 × 9. You need one less 7." },
      ],
    }),
    ex("ar3-e03", "easy", DIV, "Sharing and grouping", "Work out 45 ÷ 5.", num(9), {
      hints: ["How many 5s make 45?"],
      steps: ["5 × 9 = 45.", "So 45 ÷ 5 = 9."],
      why: "Division asks “how many groups of 5 fit in 45?”, which you answer with the 5 times table.",
    }),
    ex("ar3-e04", "easy", MUL, "Equal groups and arrays", "Which is the same as 4 groups of 6?", choice(["4 × 6", "4 + 6", "6 − 4", "46"], 0), {
      hints: ["“Groups of” means multiply."],
      steps: ["4 groups of 6 = 6 + 6 + 6 + 6 = 24 = 4 × 6."],
      why: "Repeated addition of equal groups is exactly what multiplication means.",
    }),
    ex("ar3-e05", "easy", MUL, "Multiplying by 10 and 100", "Work out 23 × 10.", num(230), {
      hints: ["Multiplying by 10 moves each digit one place to the left."],
      steps: ["2 tens become 2 hundreds; 3 ones become 3 tens.", "23 × 10 = 230."],
      why: "Every digit becomes ten times bigger, so it shifts one place left and a 0 fills the ones.",
    }),
    ex("ar3-e06", "easy", DIV, "Dividing by 10 and 100", "Work out 600 ÷ 100.", num(6), {
      hints: ["Dividing by 100 moves digits two places to the right."],
      steps: ["600 = 6 hundreds.", "6 hundreds ÷ 100 = 6."],
      why: "There are exactly 6 hundreds in 600.",
    }),
    ex("ar3-e07", "easy", MUL, "Equal groups and arrays", "Shade 12 squares to show 3 × 4.", shade(4, 5, 12), {
      hints: ["3 × 4 means 3 groups of 4. How many is that?"],
      steps: ["3 × 4 = 12.", "Shade any 12 squares (for example 3 rows of 4)."],
      why: "3 groups of 4 is 12 squares, however you arrange them.",
    }),
    ex("ar3-e08", "easy", MUL, "Times tables", "Drag the missing number.", fill([["6", "×", slot(0), "=", "42"]], ["6", "7", "8", "36"], ["7"]), {
      hints: ["Count up in sixes until you reach 42."],
      steps: ["6, 12, 18, 24, 30, 36, 42: that's 7 sixes.", "6 × 7 = 42."],
      why: "A missing factor is found by dividing: 42 ÷ 6 = 7.",
    }),
    ex("ar3-e09", "easy", DIV, "Sharing and grouping", "18 cookies are shared equally between 3 friends. How many does each get?", num(6), {
      hints: ["Share means divide."],
      steps: ["18 ÷ 3 = 6.", "Check: 3 × 6 = 18. ✓"],
      why: "Sharing equally splits the total into equal parts: 18 ÷ 3 = 6.",
    }),
    ex("ar3-e10", "easy", MUL, "Times tables", "Which number is a multiple of 9?", choice(["49", "54", "64", "74"], 1), {
      hints: ["Digits of a multiple of 9 add up to a multiple of 9."],
      steps: ["5 + 4 = 9, so 54 is a multiple of 9.", "9 × 6 = 54."],
      why: "54 = 9 × 6. The digit-sum test works because 10 leaves remainder 1 when divided by 9.",
    }),

    // ── Medium ──
    ex("ar3-m01", "medium", STRAT, "Multi-digit multiplication", "Work out 24 × 13.", num(312), {
      hints: ["Split 13 into 10 + 3 and multiply each part."],
      steps: ["24 × 10 = 240.", "24 × 3 = 72.", "240 + 72 = 312."],
      why: "Multiplying each part and adding uses the distributive property: 24 × (10 + 3).",
      wrong: [{ match: 96, message: "It looks like the 1 in 13 was treated as 1, not 10. 24 × 10 = 240." }],
    }),
    ex("ar3-m02", "medium", DIV, "Sharing and grouping", "Work out 156 ÷ 6.", num(26), {
      hints: ["Split 156 into 120 + 36: both divide easily by 6."],
      steps: ["120 ÷ 6 = 20.", "36 ÷ 6 = 6.", "20 + 6 = 26."],
      why: "Splitting into parts that are multiples of 6 makes division mental.",
    }),
    ex("ar3-m03", "medium", DIV, "Remainders", "What is the remainder when 47 is divided by 5?", num(2), {
      hints: ["What's the biggest multiple of 5 that fits into 47?"],
      steps: ["5 × 9 = 45.", "47 − 45 = 2."],
      why: "After 9 full groups of 5 (45), 2 are left over: that's the remainder.",
      wrong: [{ match: 9, message: "9 is how many fives fit. The remainder is what's left over." }],
    }),
    ex("ar3-m04", "medium", MUL, "Times tables", "Work out 125 × 8.", num(1000), {
      hints: ["Double 125 three times (× 2 × 2 × 2 = × 8)."],
      steps: ["125 × 2 = 250.", "250 × 2 = 500.", "500 × 2 = 1,000."],
      why: "Multiplying by 8 is doubling three times, and 125 doubles neatly.",
    }),
    ex("ar3-m05", "medium", STRAT, "Inverse checks", "Which calculation checks that 84 ÷ 7 = 12?", choice(["12 × 7", "84 × 7", "12 + 7", "84 − 12"], 0), {
      hints: ["Multiplication undoes division."],
      steps: ["If 84 ÷ 7 = 12, then 12 × 7 should give back 84.", "12 × 7 = 84. ✓"],
      why: "The answer times the divisor must return the starting number.",
    }),
    ex("ar3-m06", "medium", DIV, "Remainders", "A bus seats 52 people. How many buses are needed for 300 people?", num(6), {
      hints: ["300 ÷ 52 isn't a whole number. What happens to the leftover people?"],
      steps: ["52 × 5 = 260, which leaves 40 people.", "Those 40 still need a bus.", "So 6 buses."],
      why: "With a remainder, round up: everyone needs a seat, so a part-full bus still counts.",
      wrong: [{ match: 5, message: "5 buses carry 260 people, so 40 would be left behind. Round up." }],
    }),
    ex("ar3-m07", "medium", DIV, "Dividing by 10 and 100", "Work out 3,600 ÷ 40.", num(90), {
      hints: ["Divide by 10 first, then by 4."],
      steps: ["3,600 ÷ 10 = 360.", "360 ÷ 4 = 90."],
      why: "Dividing by 40 is the same as dividing by 10 and then by 4.",
      wrong: [{ match: 900, message: "That's 3,600 ÷ 4. Remember to divide by 10 as well." }],
    }),
    ex("ar3-m08", "medium", MUL, "Times tables", "Put these products in order.", order(["12 × 5", "9 × 7", "8 × 8"]), {
      hints: ["Work out each product."],
      steps: ["12 × 5 = 60.", "9 × 7 = 63.", "8 × 8 = 64."],
      why: "Compare products by calculating them: 60 < 63 < 64.",
    }),
    ex(
      "ar3-m09",
      "medium",
      STRAT,
      "Multi-digit multiplication",
      "Complete the area-model working for 23 × 4.",
      fill([["23 × 4", "=", "80", "+", slot(0), "=", slot(1)]], ["12", "92", "7", "82"], ["12", "92"]),
      {
        hints: ["23 = 20 + 3. You've done 20 × 4 = 80. What is 3 × 4?"],
        steps: ["3 × 4 = 12.", "80 + 12 = 92."],
        why: "Splitting 23 into tens and ones and multiplying each gives two easy products to add.",
      },
    ),
    ex("ar3-m10", "medium", MUL, "Times tables", "Work out 6 × 7 × 5.", num(210), {
      hints: ["You can multiply in any order. Which pair makes a round number?"],
      steps: ["6 × 5 = 30.", "30 × 7 = 210."],
      why: "Multiplication can be done in any order, so pair 6 × 5 = 30 first.",
    }),

    // ── Hard ──
    ex("ar3-h01", "hard", STRAT, "Multi-digit multiplication", "Work out 368 × 27.", num(9936), {
      hints: ["Split 27 into 20 + 7."],
      steps: ["368 × 20 = 7,360.", "368 × 7 = 2,576.", "7,360 + 2,576 = 9,936."],
      why: "Long multiplication is just two smaller multiplications added together.",
      wrong: [{ match: 3312, message: "That's 368 × 9. Split 27 into 20 + 7 and multiply each part." }],
    }),
    ex("ar3-h02", "hard", DIV, "Sharing and grouping", "Work out 2,016 ÷ 24.", num(84), {
      hints: ["How many 24s are in 2,000? Try 24 × 80 first."],
      steps: ["24 × 80 = 1,920.", "2,016 − 1,920 = 96.", "96 ÷ 24 = 4.", "80 + 4 = 84."],
      why: "Chunking takes away big multiples of 24 first, then mops up the rest.",
    }),
    ex("ar3-h03", "hard", DIV, "Remainders", "Egg boxes hold 12 eggs. How many FULL boxes can you make from 200 eggs?", num(16), {
      hints: ["Find how many 12s fit in 200. Only full boxes count."],
      steps: ["12 × 16 = 192.", "200 − 192 = 8 eggs left over: not enough for a full box.", "16 full boxes."],
      why: "Here the remainder is dropped, because a box with 8 eggs isn't full.",
      wrong: [{ match: 17, message: "A 17th box would only have 8 eggs. The question asks for full boxes." }],
    }),
    ex("ar3-h04", "hard", STRAT, "Inverse checks", "Which has the largest answer?", choice(["25 × 40", "999 ÷ 1", "48 × 21", "3,000 ÷ 3"], 2), {
      hints: ["Work out each one: some are tricks in disguise."],
      steps: ["25 × 40 = 1,000.", "999 ÷ 1 = 999.", "48 × 21 = 1,008.", "3,000 ÷ 3 = 1,000.", "Largest: 48 × 21."],
      why: "48 × 21 = 48 × 20 + 48 = 960 + 48 = 1,008, just above the two 1,000s.",
    }),
    ex("ar3-h05", "hard", STRAT, "Inverse checks", "Find the missing number:  ___ × 15 = 405", num(27), {
      hints: ["Divide 405 by 15. Try 15 × 20 first."],
      steps: ["15 × 20 = 300; 405 − 300 = 105.", "105 ÷ 15 = 7.", "20 + 7 = 27."],
      why: "A missing factor is found by division: 405 ÷ 15 = 27.",
    }),

    // ── Mastery ──
    ex("ar3-x01", "mastery", MUL, "Multiplying by 10 and 100", "Work out 409 × 6.", num(2454), {
      hints: ["Split 409 into 400 + 9."],
      steps: ["400 × 6 = 2,400.", "9 × 6 = 54.", "2,400 + 54 = 2,454."],
      why: "The 0 in the tens place means only the hundreds and ones contribute.",
    }),
    ex("ar3-x02", "mastery", DIV, "Sharing and grouping", "Work out 945 ÷ 7.", num(135), {
      hints: ["Split 945 into 700 + 245."],
      steps: ["700 ÷ 7 = 100.", "245 ÷ 7 = 35.", "100 + 35 = 135."],
      why: "Breaking 945 into multiples of 7 makes the division manageable.",
    }),
    ex("ar3-x03", "mastery", STRAT, "Word problems", "Tickets cost 14 each. How much do 28 tickets cost?", num(392), {
      hints: ["28 × 14: try 28 × 10 + 28 × 4."],
      steps: ["28 × 10 = 280.", "28 × 4 = 112.", "280 + 112 = 392."],
      why: "Total cost is number of tickets times price per ticket.",
    }),
    ex("ar3-x04", "mastery", DIV, "Remainders", "What is the remainder when 1,000 is divided by 7?", num(6), {
      hints: ["7 × 140 = 980. How much further to 1,000?"],
      steps: ["7 × 142 = 994.", "1,000 − 994 = 6."],
      why: "After the largest multiple of 7 below 1,000 (994), 6 is left over.",
    }),
    ex("ar3-x05", "mastery", STRAT, "Word problems", "A rectangle has an area of 96 cm² and a width of 8 cm. How long is it?", num(12, { unit: "cm" }), {
      hints: ["Area = length × width. Which operation finds a missing side?"],
      steps: ["length × 8 = 96.", "length = 96 ÷ 8 = 12 cm."],
      why: "Division undoes the multiplication in the area formula.",
      wrong: [{ match: 88, message: "Area isn't found by subtracting. Use length × width = 96." }],
    }),
  ],
};
