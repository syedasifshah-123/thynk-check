import type { BranchSpec } from "./define";

export const ALGEBRA: BranchSpec = {
  id: "algebra",
  title: "Algebra",
  subtitle: "Variables & Equations",
  description: "Use letters for unknowns, balance equations, and describe patterns and relationships with expressions, graphs and functions.",
  color: { main: "#8b5cf6", shadow: "#6d3fd9", ink: "#ffffff" },
  tier: 0,
  levels: [
    {
      title: "Variables and Algebraic Expressions",
      topics:
        "Variables: letters as unknowns; writing expressions from words | Evaluating: substituting values; order of operations in expressions | Terms: coefficients and constants; like terms",
    },
    {
      title: "Simplifying Expressions and the Distributive Property",
      topics:
        "Simplifying: collecting like terms; multiplying terms | Distributive property: expanding a(b + c); expanding with negatives | Factorising: common factors; checking by expanding",
    },
    {
      title: "Linear Equations",
      topics:
        "One-step equations: inverse operations; balancing | Multi-step equations: two-step equations; unknowns on both sides; brackets | Applications: forming equations from words; checking solutions",
    },
    {
      title: "Inequalities and Number Lines",
      topics:
        "Inequality symbols: <, >, ≤, ≥; reading inequalities | Number lines: open and closed circles; representing solution sets | Solving: linear inequalities; flipping the sign when multiplying by a negative",
    },
    {
      title: "Polynomials and Factorization",
      topics:
        "Polynomials: degree and terms; adding and subtracting polynomials | Multiplying: expanding double brackets; special products | Factorization: common factors; trinomials; difference of two squares",
    },
    {
      title: "Quadratic Equations",
      topics:
        "Solving by factoring: zero-product property | Completing the square: vertex form | Quadratic formula: discriminant; number of roots; applications",
    },
    {
      title: "Functions, Graphs and Relationships",
      topics:
        "Functions: inputs and outputs; function notation; domain and range | Linear graphs: gradient; intercepts; y = mx + c | Other graphs: quadratic graphs; reading and interpreting graphs",
    },
    {
      title: "Advanced Algebra and Systems of Equations",
      topics:
        "Systems of equations: substitution; elimination; graphical solutions | Advanced expressions: algebraic fractions; rearranging formulas | Sequences: nth term; arithmetic and geometric rules",
    },
  ],
};
