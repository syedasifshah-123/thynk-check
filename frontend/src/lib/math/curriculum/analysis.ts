import type { BranchSpec } from "./define";

export const ANALYSIS: BranchSpec = {
  id: "analysis",
  title: "Mathematical Analysis",
  subtitle: "Rigorous Calculus",
  description: "Rebuild calculus from the ground up with precise definitions, epsilon–delta arguments and careful proofs.",
  color: { main: "#f43f5e", shadow: "#be123c", ink: "#ffffff" },
  tier: 1,
  prerequisite: { branchId: "calculus", level: 4 },
  levels: [
    {
      title: "Real Numbers and Number Properties",
      topics:
        "Number systems: naturals to reals; irrationality of √2 | Order and bounds: supremum and infimum; completeness axiom | Inequalities: triangle inequality; absolute value",
    },
    {
      title: "Sequences and Convergence",
      topics:
        "Convergence: ε–N definition; uniqueness of limits | Limit theorems: algebra of limits; squeeze theorem | Key results: monotone convergence; Bolzano–Weierstrass; Cauchy sequences",
    },
    {
      title: "Limits and Continuity",
      topics:
        "Function limits: ε–δ definition; sequential characterisation | Continuity: continuous functions; uniform continuity | Theorems: intermediate value theorem; extreme value theorem",
    },
    {
      title: "Differentiation and the Mean Value Theorem",
      topics:
        "Differentiability: derivative as a limit; differentiable implies continuous | Mean value theorems: Rolle's theorem; MVT; consequences | Taylor's theorem: remainder terms; approximation",
    },
    {
      title: "Riemann Integration",
      topics:
        "Riemann sums: partitions; upper and lower sums | Integrability: integrability criteria; integrable functions | Fundamental theorem: rigorous statement and proof",
    },
    {
      title: "Infinite Series and Convergence Tests",
      topics:
        "Series: partial sums; convergence and divergence | Tests: comparison, ratio, root and alternating series tests | Absolute convergence: rearrangements; power series",
    },
    {
      title: "Rigorous Proofs and Epsilon-Delta Reasoning",
      topics:
        "Writing proofs: choosing ε and δ; structuring arguments | Counterexamples: pathological functions; boundary cases | Function sequences: pointwise vs uniform convergence",
    },
    {
      title: "Advanced Real Analysis",
      topics:
        "Metric ideas: open and closed sets in ℝ; compactness in ℝ | Uniform convergence: continuity, integration and differentiation of limits | Further topics: Weierstrass approximation; introduction to measure",
    },
  ],
};
