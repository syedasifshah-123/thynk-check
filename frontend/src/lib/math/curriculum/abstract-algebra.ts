import type { BranchSpec } from "./define";

export const ABSTRACT_ALGEBRA: BranchSpec = {
  id: "abstract-algebra",
  title: "Abstract Algebra",
  subtitle: "Groups, Rings & Fields",
  description: "Study the structure behind arithmetic itself: symmetry groups, rings and fields, and the maps that preserve them.",
  color: { main: "#a855f7", shadow: "#7e22ce", ink: "#ffffff" },
  tier: 1,
  prerequisite: { branchId: "number-theory", level: 3 },
  levels: [
    {
      title: "Algebraic Structures and Binary Operations",
      topics:
        "Binary operations: closure; associativity; commutativity | Identities and inverses: identity elements; inverse elements | Examples: integers mod n; matrices; symmetries",
    },
    {
      title: "Groups and Group Properties",
      topics:
        "Group axioms: definition; examples and non-examples | Basic properties: uniqueness of identity and inverses; cancellation | Order: order of a group; order of an element",
    },
    {
      title: "Subgroups and Cyclic Groups",
      topics:
        "Subgroups: subgroup test; generated subgroups | Cyclic groups: generators; classification | Lagrange's theorem: cosets; index",
    },
    {
      title: "Permutation Groups and Group Homomorphisms",
      topics:
        "Permutations: cycle notation; symmetric groups; even and odd permutations | Homomorphisms: definition; kernel and image | Isomorphisms: isomorphic groups; Cayley's theorem",
    },
    {
      title: "Rings and Integral Domains",
      topics:
        "Rings: axioms; examples; units | Integral domains: zero divisors; cancellation | Ideals: ideals and quotient rings; ring homomorphisms",
    },
    {
      title: "Fields and Polynomial Structures",
      topics:
        "Fields: definition; finite fields | Polynomial rings: division algorithm; roots and factors | Irreducibility: irreducible polynomials; field extensions",
    },
    {
      title: "Advanced Abstract Algebra and Structural Proofs",
      topics:
        "Quotient groups: normal subgroups; first isomorphism theorem | Group actions: orbits and stabilisers; Burnside's lemma | Galois ideas: symmetry of roots; solvability by radicals",
    },
  ],
};
