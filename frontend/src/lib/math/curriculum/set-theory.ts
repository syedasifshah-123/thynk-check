import type { BranchSpec } from "./define";

export const SET_THEORY: BranchSpec = {
  id: "set-theory",
  title: "Set Theory",
  subtitle: "Collections & Infinity",
  description: "Sets, relations and functions, then the surprising arithmetic of infinity and the axioms everything rests on.",
  color: { main: "#d946ef", shadow: "#a21caf", ink: "#ffffff" },
  tier: 1,
  levels: [
    {
      title: "Sets, Elements and Subsets",
      topics:
        "Sets: roster and set-builder notation; membership | Subsets: proper subsets; empty set | Power sets: listing subsets; size of a power set",
    },
    {
      title: "Union, Intersection, Difference and Complements",
      topics:
        "Operations: union; intersection; difference | Complements: universal set; De Morgan's laws for sets | Venn diagrams: two and three sets; counting with inclusion–exclusion",
    },
    {
      title: "Cartesian Products and Relations",
      topics:
        "Cartesian products: ordered pairs; size of A × B | Relations: subsets of A × B; properties | Equivalence and order: equivalence classes; partial orders",
    },
    {
      title: "Functions, Injections, Surjections and Bijections",
      topics:
        "Functions as sets: domain, codomain, image | Types: injective; surjective; bijective | Inverses and composition: invertible functions; composing maps",
    },
    {
      title: "Cardinality, Countability and Infinite Sets",
      topics:
        "Cardinality: comparing sizes with bijections | Countable sets: integers and rationals are countable | Uncountable sets: Cantor's diagonal argument; Cantor's theorem",
    },
    {
      title: "Axiomatic Set Theory and Advanced Concepts",
      topics:
        "Paradoxes: Russell's paradox; why axioms are needed | ZFC: the axioms; axiom of choice | Ordinals and cardinals: well-ordering; transfinite arithmetic",
    },
  ],
};
