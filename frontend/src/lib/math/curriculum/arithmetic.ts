import { ARITHMETIC_CONTENT } from "../content/arithmetic";
import type { BranchSpec } from "./define";

export const ARITHMETIC: BranchSpec = {
  id: "arithmetic",
  title: "Arithmetic",
  subtitle: "Numbers & Calculations",
  description: "Place value, the four operations, fractions, decimals, percentages and ratios, the toolkit every other branch is built on.",
  color: { main: "#4f6bff", shadow: "#3346d6", ink: "#ffffff" },
  tier: 0,
  content: ARITHMETIC_CONTENT,
  levels: [
    {
      title: "Counting, Number Sense & Place Value",
      topics:
        "Counting & comparing: counting objects; greater and less than; ordering numbers | Place value: ones, tens, hundreds; reading large numbers; value of a digit | The number line: reading scales; halfway points; estimating position",
    },
    {
      title: "Addition and Subtraction",
      topics:
        "Adding: column addition; carrying; adding several numbers | Subtracting: column subtraction; borrowing; subtracting across zeros | Connections: fact families; inverse operations; word problems",
    },
    {
      title: "Multiplication and Division",
      topics:
        "Multiplication: equal groups and arrays; times tables; multiplying by 10 and 100 | Division: sharing and grouping; remainders; dividing by 10 and 100 | Strategies: multi-digit multiplication; inverse checks; word problems",
    },
    {
      title: "Fractions and Mixed Numbers",
      topics:
        "Understanding fractions: parts of a whole; numerator and denominator; fractions on a number line | Equivalence: equivalent fractions; simplifying; comparing fractions | Operations: adding and subtracting; multiplying and dividing; mixed and improper numbers; fraction of an amount",
    },
    {
      title: "Decimals and Rounding",
      topics:
        "Decimal place value: tenths and hundredths; decimals on a number line; comparing decimals | Calculating: adding and subtracting decimals; multiplying and dividing decimals; multiplying by 10, 100, 1000; decimal ⇄ fraction | Rounding: nearest whole number; decimal places; estimation",
    },
    {
      title: "Percentages and Percentage Change",
      topics:
        "Meaning of percent: out of 100; percent ⇄ fraction ⇄ decimal; one number as a percentage of another |Percent of an amount: 10%, 25%, 50% shortcuts; any percentage; reverse percentages | Change: percentage increase; percentage decrease; discounts and interest",
    },
    {
      title: "Ratios, Rates and Proportions",
      topics:
        "Ratios: writing ratios; simplifying ratios; sharing in a ratio | Rates: unit rates; best buy; speed, distance and time | Proportion: direct proportion; scaling recipes; solving proportions",
    },
    {
      title: "Integers and Negative Numbers",
      topics:
        "Negative numbers: real-life contexts; ordering integers; the number line | Adding & subtracting: moving on the number line; subtracting negatives | Multiplying & dividing: sign rules; mixed operations",
    },
    {
      title: "Order of Operations (BODMAS), Powers and Roots",
      topics:
        "Order of operations: BODMAS/BIDMAS; brackets first; left-to-right rules | Powers: squares and cubes; index notation; powers of 10 | Roots: square roots; cube roots; estimating roots",
    },
    {
      title: "Advanced Arithmetic and Multi-Step Problems",
      topics:
        "Multi-step problems: planning a solution; mixed operations; checking answers | Real-world maths: money and budgets; time and rates; percentages in context | Reasoning: working backwards; estimation and sense-checking",
    },
  ],
};
