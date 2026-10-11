import type { BranchSpec } from "./define";

export const DISCRETE: BranchSpec = {
  id: "discrete",
  title: "Discrete Mathematics",
  subtitle: "Finite Structures",
  description: "Logic, sets, counting, graphs and recurrences: the mathematics of computers, networks and algorithms.",
  color: { main: "#06b6d4", shadow: "#0891b2", ink: "#ffffff" },
  tier: 0,
  levels: [
    {
      title: "Logic, Statements and Basic Reasoning",
      topics:
        "Statements: propositions; negation | Connectives: and, or, if–then | Reasoning: valid arguments; common fallacies",
    },
    {
      title: "Sets, Relations and Functions",
      topics:
        "Sets: notation; subsets; Venn diagrams | Relations: reflexive, symmetric, transitive; equivalence relations | Functions: one-to-one and onto; composition",
    },
    {
      title: "Counting Principles and Combinatorics",
      topics:
        "Counting rules: sum and product rules; inclusion–exclusion | Arrangements: permutations; combinations | Pigeonhole principle: basic and generalised forms",
    },
    {
      title: "Graphs, Networks and Trees",
      topics:
        "Graphs: vertices and edges; degree; handshake lemma | Paths: Euler and Hamilton paths; connectivity | Trees: spanning trees; shortest paths",
    },
    {
      title: "Recurrence Relations and Sequences",
      topics:
        "Recurrences: defining sequences recursively; Fibonacci | Solving: iteration; characteristic equations | Applications: counting problems; growth of algorithms",
    },
    {
      title: "Algorithms, Complexity and Discrete Structures",
      topics:
        "Algorithms: pseudocode; searching and sorting | Complexity: big-O notation; comparing growth rates | Structures: binary numbers; Boolean algebra; logic circuits",
    },
    {
      title: "Advanced Combinatorics and Applications",
      topics:
        "Generating functions: encoding sequences; solving counting problems | Advanced counting: derangements; Catalan numbers | Applications: coding theory; scheduling and matching",
    },
  ],
};
