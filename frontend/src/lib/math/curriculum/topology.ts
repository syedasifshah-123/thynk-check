import type { BranchSpec } from "./define";

export const TOPOLOGY: BranchSpec = {
  id: "topology",
  title: "Topology",
  subtitle: "Shape Without Distance",
  description: "What stays the same when you stretch and bend: open sets, continuity, connectedness and compactness.",
  color: { main: "#84cc16", shadow: "#4d7c0f", ink: "#1a2e05" },
  tier: 1,
  prerequisite: { branchId: "set-theory", level: 4 },
  levels: [
    {
      title: "Open and Closed Sets: Introductory Concepts",
      topics:
        "Intervals: open, closed and half-open intervals | Open and closed sets in ℝ: neighbourhoods; boundary points | Properties: unions and intersections of open sets",
    },
    {
      title: "Topological Spaces and Bases",
      topics:
        "Topologies: axioms; discrete and indiscrete topologies | Bases: generating a topology; standard topology on ℝ | Subspaces: subspace topology; product topology",
    },
    {
      title: "Continuous Functions and Homeomorphisms",
      topics:
        "Continuity: preimages of open sets; equivalent definitions | Homeomorphisms: topological equivalence; coffee cup and doughnut | Invariants: properties preserved by homeomorphisms",
    },
    {
      title: "Connectedness and Path Connectedness",
      topics:
        "Connectedness: separations; connected subsets of ℝ | Path connectedness: paths; path-connected implies connected | Components: connected components; applications",
    },
    {
      title: "Compactness",
      topics:
        "Open covers: covers and subcovers; definition of compactness | Compact sets in ℝ: Heine–Borel theorem | Properties: continuous images; closed subsets of compact sets",
    },
    {
      title: "Metric Spaces and Convergence",
      topics:
        "Metrics: distance functions; examples | Metric topology: open balls; convergence of sequences | Completeness: Cauchy sequences; complete metric spaces",
    },
    {
      title: "Advanced Topology and Applications",
      topics:
        "Algebraic topology: fundamental group; Euler characteristic | Surfaces: classification of surfaces; orientability | Applications: networks; data analysis; fixed-point theorems",
    },
  ],
};
