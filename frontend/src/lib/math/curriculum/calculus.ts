import type { BranchSpec } from "./define";

export const CALCULUS: BranchSpec = {
  id: "calculus",
  title: "Calculus",
  subtitle: "Change & Accumulation",
  description: "The mathematics of change: limits, derivatives and integrals, then series and functions of several variables.",
  color: { main: "#ef4444", shadow: "#c42c2c", ink: "#ffffff" },
  tier: 0,
  prerequisite: { branchId: "algebra", level: 7 },
  levels: [
    {
      title: "Functions, Graphs and Limits",
      topics:
        "Functions review: composition; inverse functions; graph transformations | Intuitive limits: approaching a value; one-sided limits | Limits from graphs and tables: estimating limits; limits at infinity",
    },
    {
      title: "Limits and Continuity",
      topics:
        "Limit laws: algebra of limits; factoring and cancelling | Special limits: sin x / x; rational functions | Continuity: types of discontinuity; intermediate value theorem",
    },
    {
      title: "Derivatives and Differentiation Rules",
      topics:
        "The derivative: gradient of a tangent; first principles | Rules: power rule; product and quotient rules; chain rule | Standard derivatives: exponentials, logarithms, trig functions",
    },
    {
      title: "Applications of Derivatives",
      topics:
        "Curve sketching: stationary points; increasing and decreasing; concavity | Optimisation: maximum and minimum problems | Rates: related rates; tangents and normals; linear approximation",
    },
    {
      title: "Antiderivatives and Definite Integrals",
      topics:
        "Antiderivatives: reversing differentiation; constant of integration | Definite integrals: Riemann sums; area under a curve | Fundamental theorem: connecting derivatives and integrals; area between curves",
    },
    {
      title: "Integration Techniques",
      topics:
        "Substitution: u-substitution; changing limits | Integration by parts: choosing u and dv; repeated parts | Other techniques: partial fractions; trigonometric integrals; volumes of revolution",
    },
    {
      title: "Sequences, Series and Convergence",
      topics:
        "Sequences: limits of sequences; monotone and bounded | Series: geometric series; telescoping series | Convergence tests: comparison, ratio and integral tests; Taylor and Maclaurin series",
    },
    {
      title: "Multivariable Calculus and Partial Derivatives",
      topics:
        "Functions of several variables: surfaces; level curves | Partial derivatives: gradients; tangent planes; chain rule | Multiple integrals: double integrals; applications to volume",
    },
  ],
};
