import type { BranchSpec } from "./define";

export const LOGIC: BranchSpec = {
  id: "logic",
  title: "Mathematical Logic",
  subtitle: "Truth & Proof",
  description: "The rules of correct reasoning: connectives and truth tables, quantifiers, proof techniques and the limits of formal systems.",
  color: { main: "#3b82f6", shadow: "#1d4ed8", ink: "#ffffff" },
  tier: 1,
  levels: [
    {
      title: "Propositions and Logical Connectives",
      topics:
        "Propositions: statements vs non-statements; truth values | Connectives: not, and, or, implies, iff | Translation: everyday language to logic",
    },
    {
      title: "Truth Tables and Logical Equivalence",
      topics:
        "Truth tables: building tables; tautologies and contradictions | Equivalence: De Morgan's laws; distributive laws | Implications: converse, inverse and contrapositive",
    },
    {
      title: "Predicates and Quantifiers",
      topics:
        "Predicates: open statements; domains | Quantifiers: for all; there exists; negating quantifiers | Nested quantifiers: order matters; translating definitions",
    },
    {
      title: "Direct Proofs, Contradiction and Contraposition",
      topics:
        "Direct proof: from hypothesis to conclusion | Contraposition: proving the contrapositive | Contradiction: assuming the opposite; classic examples",
    },
    {
      title: "Induction and Formal Proof Techniques",
      topics:
        "Mathematical induction: base case and inductive step | Strong induction: multiple base cases | Formal proofs: natural deduction; inference rules",
    },
    {
      title: "Formal Systems and Computability",
      topics:
        "Formal systems: axioms and rules; soundness and completeness | Computability: Turing machines; decidable problems | Limits: halting problem; Gödel's incompleteness theorems",
    },
    {
      title: "Model Theory and Advanced Logic",
      topics:
        "Models: structures and interpretations; satisfiability | Key theorems: compactness; Löwenheim–Skolem | Beyond first order: modal and higher-order logic",
    },
  ],
};
