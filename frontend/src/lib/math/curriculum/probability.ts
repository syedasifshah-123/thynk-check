import type { BranchSpec } from "./define";

export const PROBABILITY: BranchSpec = {
  id: "probability",
  title: "Probability",
  subtitle: "Chance & Uncertainty",
  description: "Measure how likely things are, count outcomes cleverly, update beliefs with evidence and reason about random quantities.",
  color: { main: "#14b8a6", shadow: "#0d8f81", ink: "#ffffff" },
  tier: 0,
  levels: [
    {
      title: "Basic Probability and Events",
      topics:
        "Probability scale: impossible to certain; probability as a fraction | Events: outcomes and events; complementary events | Experiments: relative frequency; expected frequency",
    },
    {
      title: "Sample Spaces and Probability Rules",
      topics:
        "Sample spaces: listing outcomes; two-way tables; sample space diagrams | Rules: addition rule; mutually exclusive events | Venn diagrams: unions and intersections",
    },
    {
      title: "Counting Principles, Permutations and Combinations",
      topics:
        "Counting principle: multiplication rule; factorials | Permutations: arrangements; arrangements with repeats | Combinations: choosing groups; nCr and Pascal's triangle",
    },
    {
      title: "Conditional Probability and Independence",
      topics:
        "Conditional probability: P(A ∣ B); from tables and diagrams | Independence: testing independence; multiplication rule | Dependent events: without replacement",
    },
    {
      title: "Bayes' Theorem and Tree Diagrams",
      topics:
        "Tree diagrams: multi-stage experiments; combining branches | Total probability: law of total probability | Bayes' theorem: reversing conditions; medical test paradoxes",
    },
    {
      title: "Random Variables and Expected Value",
      topics:
        "Random variables: discrete distributions; probability tables | Expected value: mean of a random variable; fair games | Variance: spread of a random variable; linear transformations",
    },
    {
      title: "Probability Distributions and Advanced Applications",
      topics:
        "Binomial distribution: conditions; probabilities and mean | Other distributions: geometric; Poisson; normal approximation | Applications: simulation; risk and decision making",
    },
  ],
};
