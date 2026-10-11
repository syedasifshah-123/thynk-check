import type { LevelContent } from "../../schema";
import { choice, ex, fill, frac, num, ratio, slot } from "../builders";

const RATIOS = "Ratios";
const RATES = "Rates";
const PROP = "Proportion";

const RED = "#ef4444";
const BLUE = "#4f6bff";
const GREEN = "#22c55e";
const YELLOW = "#f5b301";

export const LEVEL_7: LevelContent = {
  intro: {
    title: "Comparing amounts",
    body: [
      "A ratio compares quantities. Here there are 3 red counters for every 2 blue: red : blue = 3 : 2.",
      "Ratios simplify like fractions: 6 : 4 = 3 : 2. A rate compares different units, like km per hour.",
      "To share an amount in a ratio, add the parts to find how many equal shares there are.",
    ],
    visual: ratio({ label: "Red", count: 3, color: RED }, { label: "Blue", count: 2, color: BLUE }),
  },
  example: {
    title: "Worked example",
    problem: "Share 40 sweets in the ratio 3 : 5.",
    steps: [
      "Total parts: 3 + 5 = 8.",
      "One part: 40 ÷ 8 = 5.",
      "Shares: 3 × 5 = 15 and 5 × 5 = 25.",
      "Check: 15 + 25 = 40. ✓",
    ],
    answer: "15 and 25",
  },
  exercises: [
    // ── Easy ──
    ex("ar7-e01", "easy", RATIOS, "Writing ratios", "What is the ratio of red to blue counters?", choice(["3 : 2", "2 : 3", "3 : 5", "5 : 3"], 0), {
      visual: ratio({ label: "Red", count: 3, color: RED }, { label: "Blue", count: 2, color: BLUE }),
      hints: ["Red comes first because the question says “red to blue”."],
      steps: ["3 red, 2 blue.", "red : blue = 3 : 2."],
      why: "A ratio keeps the same order as the words: red first, then blue.",
      wrong: [{ match: 1, message: "That's blue to red. The question asks for red to blue." }],
    }),
    ex("ar7-e02", "easy", RATIOS, "Simplifying ratios", "Simplify 6 : 4.", choice(["3 : 2", "2 : 1", "4 : 6", "3 : 4"], 0), {
      hints: ["Divide both numbers by the same number."],
      steps: ["Both divide by 2.", "6 : 4 = 3 : 2."],
      why: "Dividing both parts by their common factor keeps the comparison the same.",
    }),
    ex("ar7-e03", "easy", PROP, "Direct proportion", "For every 2 cats there are 5 dogs. If there are 4 cats, how many dogs are there?", num(10), {
      hints: ["The number of cats doubled. What happens to the dogs?"],
      steps: ["2 cats → 4 cats is × 2.", "5 dogs × 2 = 10 dogs."],
      why: "In a ratio, both parts scale by the same factor.",
      wrong: [{ match: 7, message: "Adding 2 to each side changes the ratio. Multiply both by 2 instead." }],
    }),
    ex("ar7-e04", "easy", RATES, "Unit rates", "3 pens cost $6. How much does 1 pen cost?", num(2, { unit: "$" }), {
      hints: ["Divide the cost by the number of pens."],
      steps: ["6 ÷ 3 = 2."],
      why: "The unit rate is the cost of one item: total ÷ number of items.",
    }),
    ex("ar7-e05", "easy", RATIOS, "Simplifying ratios", "Which ratio is equivalent to 1 : 4?", choice(["2 : 8", "2 : 6", "4 : 1", "1 : 5"], 0), {
      hints: ["Multiply both parts of 1 : 4 by the same number."],
      steps: ["1 : 4 × 2 = 2 : 8."],
      why: "Equivalent ratios come from multiplying both parts by the same number.",
    }),
    ex("ar7-e06", "easy", RATES, "Speed, distance and time", "A car travels 120 km in 2 hours. What is its average speed?", num(60, { unit: "km/h" }), {
      hints: ["Speed = distance ÷ time."],
      steps: ["120 ÷ 2 = 60 km/h."],
      why: "Speed is how far you go in one hour.",
    }),
    ex("ar7-e07", "easy", RATIOS, "Simplifying ratios", "Drag the number that makes the ratios equivalent.", fill([["2 : 3", "=", "4 :", slot(0)]], ["5", "6", "9"], ["6"]), {
      hints: ["2 became 4. What did it get multiplied by?"],
      steps: ["2 × 2 = 4.", "3 × 2 = 6."],
      why: "Both parts must be multiplied by the same factor: 2 : 3 = 4 : 6.",
      wrong: [{ match: "5", message: "Adding 2 to each part doesn't keep the ratio. Multiply instead." }],
    }),
    ex("ar7-e08", "easy", RATIOS, "Sharing in a ratio", "In a class of 30, the ratio of boys to girls is 1 : 2. How many girls are there?", num(20), {
      hints: ["How many equal parts are there in total?"],
      steps: ["1 + 2 = 3 parts.", "30 ÷ 3 = 10 per part.", "Girls: 2 × 10 = 20."],
      why: "Splitting 30 into 3 equal parts, the girls get two of them.",
      wrong: [{ match: 15, message: "That splits 30 in half, but the ratio has 3 parts, not 2." }],
    }),
    ex("ar7-e09", "easy", RATIOS, "Writing ratios", "What fraction of the counters are green? Give it in simplest form.", frac(2, 5, { simplest: true }), {
      visual: ratio({ label: "Green", count: 4, color: GREEN }, { label: "Yellow", count: 6, color: YELLOW }),
      hints: ["A fraction compares a part to the WHOLE: how many counters in total?"],
      steps: ["4 green out of 10 counters.", "4/10 = 2/5."],
      why: "The ratio is 4 : 6, but the fraction of the whole is 4 out of 10.",
    }),
    ex("ar7-e10", "easy", PROP, "Scaling recipes", "A recipe for 4 people uses 200 g of flour. How much flour for 8 people?", num(400, { unit: "g" }), {
      hints: ["8 people is double 4 people."],
      steps: ["4 → 8 is × 2.", "200 × 2 = 400 g."],
      why: "Twice as many people need twice as much of every ingredient.",
    }),

    // ── Medium ──
    ex("ar7-m01", "medium", RATIOS, "Sharing in a ratio", "Share 40 in the ratio 3 : 5. What is the larger share?", num(25), {
      hints: ["Find the total number of parts, then the size of one part."],
      steps: ["3 + 5 = 8 parts.", "40 ÷ 8 = 5.", "Larger share: 5 × 5 = 25."],
      why: "Each part is worth 5, and the larger share is 5 parts.",
      wrong: [{ match: 15, message: "15 is the smaller share. The larger one is 5 parts." }],
    }),
    ex("ar7-m02", "medium", RATIOS, "Simplifying ratios", "Simplify 18 : 12.", choice(["3 : 2", "2 : 3", "9 : 6", "6 : 4"], 0), {
      hints: ["The highest common factor of 18 and 12 is 6."],
      steps: ["18 ÷ 6 = 3, 12 ÷ 6 = 2.", "3 : 2."],
      why: "9 : 6 and 6 : 4 are equivalent too, but only 3 : 2 can't be simplified further.",
    }),
    ex("ar7-m03", "medium", RATES, "Unit rates", "5 apples cost $2.50. How much do 8 apples cost?", num(4, { unit: "$" }), {
      hints: ["Find the cost of one apple first."],
      steps: ["1 apple: 2.50 ÷ 5 = 0.50.", "8 apples: 8 × 0.50 = 4."],
      why: "The unit cost lets you price any number of apples.",
    }),
    ex("ar7-m04", "medium", RATES, "Best buy", "Which is the better buy?", choice(["500 g for $3", "750 g for $4", "Same value"], 1), {
      hints: ["Compare the price of 250 g in each."],
      steps: ["500 g for $3 → 250 g costs $1.50.", "750 g for $4 → 250 g costs $1.33.", "750 g is cheaper per gram."],
      why: "Comparing the same quantity (250 g) shows which pack gives more for your money.",
    }),
    ex("ar7-m05", "medium", RATES, "Speed, distance and time", "How many hours does it take to travel 150 km at 50 km/h?", num(3, { unit: "hours" }), {
      hints: ["Time = distance ÷ speed."],
      steps: ["150 ÷ 50 = 3 hours."],
      why: "At 50 km each hour, 150 km takes 3 hours.",
    }),
    ex("ar7-m06", "medium", PROP, "Solving proportions", "A map has a scale of 1 : 50,000. How many km does 4 cm on the map represent?", num(2, { unit: "km" }), {
      hints: ["1 cm on the map is 50,000 cm in real life. Convert to km at the end."],
      steps: ["4 × 50,000 = 200,000 cm.", "200,000 cm = 2,000 m = 2 km."],
      why: "Scale multiplies every map length; then convert units (100 cm = 1 m, 1,000 m = 1 km).",
      wrong: [{ match: 200000, message: "That's the right distance in centimetres. Convert to km." }],
    }),
    ex("ar7-m07", "medium", RATIOS, "Sharing in a ratio", "Orange squash is mixed with water in the ratio 1 : 4. How much squash is in 600 ml of drink?", num(120, { unit: "ml" }), {
      hints: ["How many parts make the whole drink?"],
      steps: ["1 + 4 = 5 parts.", "600 ÷ 5 = 120 ml per part.", "Squash is 1 part: 120 ml."],
      why: "The whole drink is 5 parts, and squash is one of them.",
      wrong: [{ match: 150, message: "That divides by 4, but squash + water make 5 parts in total." }],
    }),
    ex("ar7-m08", "medium", PROP, "Solving proportions", "6 workers take 10 days to build a wall. How long would 12 workers take, working at the same rate?", num(5, { unit: "days" }), {
      hints: ["More workers means less time. This is inverse proportion."],
      steps: ["Total work = 6 × 10 = 60 worker-days.", "60 ÷ 12 = 5 days."],
      why: "Doubling the workers halves the time: the total amount of work stays the same.",
      wrong: [{ match: 20, message: "More workers should finish faster, not slower." }],
    }),
    ex("ar7-m09", "medium", RATES, "Speed, distance and time", "Convert 72 km/h into metres per second.", num(20, { unit: "m/s" }), {
      hints: ["72 km = 72,000 m and 1 hour = 3,600 s."],
      steps: ["72,000 m ÷ 3,600 s = 20 m/s."],
      why: "Convert both units, then divide distance by time.",
    }),
    ex("ar7-m10", "medium", PROP, "Solving proportions", "Drag the value that makes the proportion true.", fill([["3 / 4", "=", slot(0), "/ 20"]], ["12", "15", "16", "5"], ["15"]), {
      hints: ["4 × 5 = 20. Do the same to the top."],
      steps: ["3 × 5 = 15.", "3/4 = 15/20."],
      why: "Equivalent fractions scale top and bottom by the same factor.",
    }),

    // ── Hard ──
    ex("ar7-h01", "hard", RATIOS, "Sharing in a ratio", "Share 84 in the ratio 2 : 3 : 7. What is the smallest share?", num(14), {
      hints: ["Add all three parts."],
      steps: ["2 + 3 + 7 = 12 parts.", "84 ÷ 12 = 7 per part.", "Smallest: 2 × 7 = 14."],
      why: "Three-part ratios work the same way: total parts, value of one part, then multiply.",
    }),
    ex("ar7-h02", "hard", RATIOS, "Sharing in a ratio", "The ratio of A's money to B's money is 3 : 4. B has 12 more than A. How much do they have altogether?", num(84), {
      hints: ["B has one more part than A. That one part is worth 12."],
      steps: ["4 − 3 = 1 part = 12.", "Total parts: 3 + 4 = 7.", "7 × 12 = 84."],
      why: "The difference between the shares tells you the value of one part.",
    }),
    ex("ar7-h03", "hard", RATES, "Speed, distance and time", "A cyclist rides 15 km in 45 minutes. What is her speed in km/h?", num(20, { unit: "km/h" }), {
      hints: ["45 minutes is 3/4 of an hour. How far in 15 minutes?"],
      steps: ["15 km in 45 min → 5 km in 15 min.", "60 min = 4 × 15 min → 20 km.", "20 km/h."],
      why: "Scale up to a full hour to get a speed in km per hour.",
      wrong: [{ match: 0.33, message: "That's km per minute. Convert to km per hour." }],
    }),
    ex(
      "ar7-h04",
      "hard",
      PROP,
      "Direct proportion",
      "Which drink tastes more strongly of orange?",
      choice(["2 orange : 5 water", "3 orange : 8 water", "They taste the same"], 0),
      {
        hints: ["Compare the fraction of each drink that is orange."],
        steps: ["2 : 5 → orange is 2/7 ≈ 0.286.", "3 : 8 → orange is 3/11 ≈ 0.273.", "2/7 is bigger."],
        why: "Strength depends on the share of orange in the whole drink, not the raw amounts.",
      },
    ),
    ex("ar7-h05", "hard", RATIOS, "Sharing in a ratio", "Concrete uses cement : sand : gravel in the ratio 1 : 2 : 3. With 4 bags of cement, how many bags of gravel are needed?", num(12, { unit: "bags" }), {
      hints: ["Cement went from 1 part to 4 bags."],
      steps: ["1 part = 4 bags.", "Gravel = 3 parts = 12 bags."],
      why: "Every part of the ratio scales by the same factor (× 4).",
    }),

    // ── Mastery ──
    ex("ar7-x01", "mastery", RATIOS, "Sharing in a ratio", "Share 90 in the ratio 4 : 5. What is the larger share?", num(50), {
      hints: ["How many parts in total?"],
      steps: ["4 + 5 = 9 parts.", "90 ÷ 9 = 10.", "5 × 10 = 50."],
      why: "One part is 10, and the larger share is 5 parts.",
    }),
    ex("ar7-x02", "mastery", PROP, "Direct proportion", "A car uses 8 litres of fuel for 100 km. How many litres for 250 km?", num(20, { unit: "litres" }), {
      hints: ["250 km is 2.5 times 100 km."],
      steps: ["100 → 250 is × 2.5.", "8 × 2.5 = 20 litres."],
      why: "Fuel used is directly proportional to distance.",
    }),
    ex("ar7-x03", "mastery", RATES, "Speed, distance and time", "A train travels for 2.5 hours at 84 km/h. How far does it go?", num(210, { unit: "km" }), {
      hints: ["Distance = speed × time."],
      steps: ["84 × 2 = 168.", "84 × 0.5 = 42.", "168 + 42 = 210 km."],
      why: "Speed tells you the distance per hour, so multiply by the hours.",
    }),
    ex("ar7-x04", "mastery", RATIOS, "Sharing in a ratio", "The ratio of red to blue beads is 5 : 3. There are 24 blue beads. How many beads are there altogether?", num(64), {
      hints: ["Blue is 3 parts. What is 1 part?"],
      steps: ["3 parts = 24, so 1 part = 8.", "Total = 8 parts = 64."],
      why: "Knowing one share's size lets you find every share and the total.",
      wrong: [{ match: 40, message: "40 is the number of red beads. The question asks for the total." }],
    }),
    ex("ar7-x05", "mastery", RATES, "Best buy", "Which is the best value per item?", choice(["4 for $5", "6 for $7", "10 for $12.50"], 1), {
      hints: ["Work out the price of one item in each deal."],
      steps: ["4 for $5 → $1.25 each.", "6 for $7 → about $1.17 each.", "10 for $12.50 → $1.25 each."],
      why: "The unit price is lowest for 6 for $7.",
    }),
  ],
};
